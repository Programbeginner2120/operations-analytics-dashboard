# Dashboard Workflow Explained (2026-03-30)

This document walks through what actually happens at each stage of the dashboard — startup, adding a card, and configuring a card — in plain terms. It also explains why the abstractions exist.

---

## The Cast of Characters

Before the workflows make sense, it helps to know what each piece is responsible for.

### Backend

| Class | One-line job |
|---|---|
| `PlaidController` | Receives HTTP requests, extracts the JWT user ID, delegates to `PlaidService`, returns JSON |
| `PlaidService` | Orchestrates everything Plaid-related: link tokens, token exchange, item management, and data fetching |
| `PlaidDataSourceConnector` | A Spring bean factory — its only job is to create `PlaidDataSourceConnection` objects |
| `PlaidDataSourceConnection` | A short-lived object (not a Spring bean) that holds one Plaid access token and actually calls the Plaid API |
| `DataQuery` | A generic "what do you want, and for what date range?" container passed down the stack |
| `DataPoint<E>` | Wraps a single piece of fetched data (a transaction, an account balance, etc.) with metadata |
| `PlaidMetric` | An enum of things you can ask Plaid for (`ACCOUNT_BALANCE`, `TRANSACTIONS`). Each value knows its Java response type |
| `PlaidTokenEncryptionService` | AES-256-GCM encrypt/decrypt for access tokens stored in the database |
| `PlaidItemEncryptingConverter` | A transparent decorator — transparently encrypts when saving to the DB and decrypts when loading |

### Frontend Services

| Service | One-line job |
|---|---|
| `DataSourceRegistryService` | A `Map<sourceType, strategy>`. The only place that knows which strategies exist |
| `DashboardService` | Owns the `cards` signal array. Coordinates adding, updating, removing cards and fetching their data |
| `PlaidDataSourceStrategyService` | Implements `DataSourceStrategy` for Plaid — knows how to fetch data and hand back a ready-to-render chart shape |
| `PlaidService` | Thin HTTP client. Maps method calls to backend API endpoints (`/plaid/...`) |
| `DataService` | Two utilities: `wrapDataPoint()` and `unwrapDataPoint()`. That's it |
| `PlaidTransactionTransformerService` | Takes `PlaidTransaction[]` → `BarChartData` (two views: by date, or by merchant) |
| `PlaidAccountTransformerService` | Takes `PlaidAccount[]` → `PieChartData` (balances per account) |

### Frontend Components

| Component | One-line job |
|---|---|
| `DashboardLayoutComponent` | Renders the page grid. Loops over the `cards` signal and emits one `DashboardCardComponent` per card |
| `DashboardCardComponent` | Renders a single card — the chart it currently holds and the "..." config button that opens the modal |
| `PlaidConfigComponent` | The form inside the config modal — institution picker, chart metric picker. Emits a `configChange` output every time the user adjusts a field |

---

## Workflow 1: App Startup

When the app loads and the dashboard route is activated, this sequence runs:

**Step 1 — `DashboardService` constructor executes**

```
DashboardService constructor
  → registry.register(plaidStrategy)
  → this.refreshDataSourceStatus()
```

The service registers the Plaid strategy into the `DataSourceRegistryService` map. It then immediately checks whether the user has any connected data sources.

**Step 2 — `refreshDataSourceStatus()` fires HTTP requests**

```
refreshDataSourceStatus()
  → registry.getRegisteredSourceTypes()           // ['PLAID']
  → plaidStrategy.getConnectedSources()           // returns Observable
    → plaidService.getConnectedItems()            // GET /plaid/items
      → backend: PlaidController.getItems()
        → plaidService.getItemsByUserId(userId)
        → plaidItemRepository.findByUserId(userId)
        → returns List<PlaidItem> (with decrypted institution names)
```

**Step 3 — Status signals update**

```
forkJoin(results) resolves
  → connectedDataSources.set([...])
  → hasConnectedDataSources.set(true or false)
```

**Step 4 — `DashboardLayoutComponent` template reacts**

```
hasConnectedDataSources() signal was read in template
  → if false: "No data sources connected" empty state is shown
  → if true: the card grid is shown
```

The key insight here: `DashboardLayoutComponent` didn't subscribe to anything manually. Angular's signal reactivity means the template automatically re-evaluates when `hasConnectedDataSources` changes.

---

## Workflow 2: Adding a Card

The user is on the dashboard and clicks "Add Card."

**Step 1 — Button click travels to `DashboardService.addCard()`**

```
DashboardLayoutComponent.addCard()
  → dashboardService.addCard()
```

**Step 2 — Service validates and creates a default card**

```
addCard()
  → hasConnectedDataSources() !== true → bail out (guard)
  → registry.getRegisteredSourceTypes()           // ['PLAID']
  → registry.getStrategy('PLAID')                 // PlaidDataSourceStrategyService
  → strategy.getDefaultCard()
```

`getDefaultCard()` returns a hardcoded `Partial<DashboardCard>` — a bar chart showing transactions by date for the last 7 days, pointing at "All" institutions. This is where each data source can define its own sensible default rather than the service needing to know about Plaid specifics.

**Step 3 — Card is appended to the signal**

```
_cards.update(cards => [...cards, newCard])
```

The `DashboardLayoutComponent` template is listening to `cards()`, so it immediately adds a new `DashboardCardComponent` to the DOM. At this point the card has no `transformedData`, so the card renders a skeleton loading state.

**Step 4 — `refreshCardData()` fires a fetch**

```
refreshCardData(newCard.id)
  → _cards().find(c => c.id === cardId)            // get the card's config
  → registry.getStrategy(card.dataSourceType)      // PlaidDataSourceStrategyService
  → strategy.fetchAndTransform(card)               // returns Observable<BarChartData>
```

**Step 5 — The strategy routes the request**

Inside `PlaidDataSourceStrategyService.fetchAndTransform()`:

```
card.transformConfig.method = 'transactionsByDate'
  → plaidService.loadTransactions(startDate, endDate, institutionId)
    → GET /plaid/transactions?startDate=...&endDate=...
```

**Step 6 — Backend processes the request**

```
PlaidController.getTransactions(userId, startDate, endDate, institutionId)
  → builds DataQuery { metric: TRANSACTIONS, startDate, endDate, filters: {institutionId} }
  → plaidService.fetchData(userId, query)
    → plaidItemRepository.findByUserId(userId)     // load all linked items from DB
    → filter items where institutionId matches     // if not 'All'
    → for each item:
        create DataSourceConfig with decrypted accessToken
        plaidConnector.createConnection(config)   // creates PlaidDataSourceConnection
        connection.fetchData(query)               // try-with-resources
          → PlaidDataSourceConnection.fetchData()
            → PlaidMetric.TRANSACTIONS match
            → calls Plaid API: transactionsGet(accessToken, startDate, endDate)
            → maps each Transaction → DataPoint<Transaction> with metadata
        closes connection
    → returns flattened List<DataPoint<Transaction>>
  → controller serializes to JSON → HTTP response
```

Note the `try-with-resources` on the connection. `PlaidDataSourceConnection` is not a Spring bean — it is created fresh per request, holds an access token in memory only for the duration of the call, and is then discarded. This is intentional: no stale connection objects floating around.

**Step 7 — Frontend unwraps and transforms**

```
HTTP response arrives as DataPoint<PlaidTransaction>[]
  → datapoints.map(dp => dataService.unwrapDataPoint(dp))
    → returns PlaidTransaction[] (just the .value from each DataPoint)
  → transactionTransformer.transactionsByDate(transactions)
    → groups by date, sums amounts per date
    → returns BarChartData { xAxisData: ['2026-01-01', ...], yAxisData: [142.50, ...], ... }
```

**Step 8 — Card signal updates, chart renders**

```
DashboardService._cards.update(cards =>
  cards.map(c => c.id === cardId ? { ...c, transformedData } : c)
)
```

`DashboardCardComponent` reads `card()` which is a signal input. Its `barChartData` computed signal re-evaluates:

```
barChartData = computed(() => {
  if (card().visualizationType === BAR_CHART)
    return card().transformedData as BarChartData | undefined
})
```

The skeleton disappears and the bar chart renders.

---

## Workflow 3: Configuring a Card

The user clicks the "..." (ellipsis) button on an existing card.

**Step 1 — Modal opens, editable state is initialized**

```
openConfigModal()
  → editableTitle.set(card().title)
  → editableDataSourceType.set(card().dataSourceType)
  → editableVisualizationType.set(card().visualizationType)
  → draftConfig.set({ queryConfig, transformConfig })
  → isModalOpen.set(true)
```

**Step 2 — The `effect()` inside `DashboardCardComponent` fires**

This is the "black magic" part. Back in the constructor, there is an `effect()` that watches `isModalOpen()` and `configContainer()`:

```
effect(() => {
  if (!isModalOpen()) {
    activeConfigRef?.destroy()      // tear down on close
    return
  }

  const vcr = configContainer()     // the <ng-container #configContainer>
  if (activeConfigRef) {
    // modal already open — just push updated visualizationType down
    activeConfigRef.setInput('visualizationType', editableVisualizationType())
    return
  }

  // First open: dynamically create the config component
  vcr.clear()
  const strategy = registry.getStrategy(card().dataSourceType)   // PlaidDataSourceStrategyService
  const componentRef = vcr.createComponent(strategy.getConfigComponent())
  //                                        ↑ returns PlaidConfigComponent class
```

`vcr.createComponent(PlaidConfigComponent)` creates the component programmatically and inserts it into the `<ng-container #configContainer>` slot in the modal template. Angular handles its lifecycle automatically from this point.

**Step 3 — Inputs are pushed down into the dynamic child**

```
  componentRef.setInput('queryConfig',       card.queryConfig)
  componentRef.setInput('transformConfig',   card.transformConfig)
  componentRef.setInput('connectedSources',  dashboardService.connectedDataSources())
  componentRef.setInput('visualizationType', editableVisualizationType() ?? card.visualizationType)
```

**Step 4 — The parent subscribes to the child's output**

```
  componentRef.instance.configChange.subscribe(cfg => {
    draftConfig.set(cfg)
  })
```

`configChange` is an `output<DataSourceConfigOutput>()` on `PlaidConfigComponent`. Any time the user changes a dropdown inside the Plaid config form, the child emits a `DataSourceConfigOutput` and the parent stores it in `draftConfig` — without either component needing a direct reference to the other.

**Step 5 — `PlaidConfigComponent` initializes itself**

```
ngOnInit()
  → editableInstitutionId.set(queryConfig().institutionId ?? 'All')
  → editableBarChartMetric.set(transformConfig().method ?? 'transactionsByDate')
```

And its own `effect()` fires immediately (Angular effects run synchronously on the first evaluation):

```
effect(() => {
  const institutionId = editableInstitutionId()
  const metric        = editableBarChartMetric()
  const vizType       = visualizationType()
  const baseQC        = queryConfig()

  // Build updated queryConfig and transformConfig
  // emit configChange
  this.configChange.emit({ queryConfig, transformConfig })
})
```

This initial emit populates the parent's `draftConfig` with the card's current settings, so if the user saves without changing anything, the values are correct.

**Step 6 — User changes a dropdown**

Say the user switches from "Bar Chart" to "Pie Chart" in the parent's visualization select.

```
editableVisualizationType.set('PIE_CHART')
  → parent's effect re-runs (because it reads editableVisualizationType())
  → activeConfigRef is already set, so:
      activeConfigRef.setInput('visualizationType', 'PIE_CHART')
  → PlaidConfigComponent.visualizationType() is now 'PIE_CHART'
  → PlaidConfigComponent's effect re-runs
  → transformConfig.method is set to 'accountsByBalance'
  → configChange emits { queryConfig, transformConfig: { method: 'accountsByBalance' } }
  → parent's draftConfig.set(...) receives new config
```

The `@if (visualizationType() === DashboardVisualizationType.BAR_CHART)` in the Plaid config template also hides the "Bar Chart Metric" dropdown automatically.

**Step 7 — User saves**

```
saveConfig()
  → draft = draftConfig()
  → updates = {
      title:              editableTitle(),
      dataSourceType:     editableDataSourceType(),
      visualizationType:  editableVisualizationType(),
      queryConfig:        draft.queryConfig,
      transformConfig:    draft.transformConfig
    }
  → dashboardService.updateCard(card().id, updates)
```

Inside `updateCard()`:

```
_cards.update(cards => cards.map(card => {
  if (card.id === id) {
    const updated = { ...card, ...updates }
    if (updates.queryConfig || updates.transformConfig || updates.visualizationType) {
      updated.transformedData = undefined    // ← clears stale chart data
      needsRefresh = true
    }
    return updated
  }
  return card
}))

if (needsRefresh) refreshCardData(id)
```

Clearing `transformedData` immediately puts the card back into the skeleton loading state. Then `refreshCardData` fires the full backend fetch + transform cycle (Workflow 2, Steps 5–8) to populate the card with fresh data matching the new configuration.

**Step 8 — Modal closes**

```
closeModal()
  → isModalOpen.set(false)
  → parent's effect fires
  → activeConfigRef.destroy()   // Angular cleans up PlaidConfigComponent fully
  → activeConfigRef = null
```

---

## Why the Abstractions Exist

### `DataSourceStrategy` interface + registry

The `DashboardService` never imports `PlaidDataSourceStrategyService` directly for data operations. It only ever calls `registry.getStrategy(sourceType)` and then calls methods on the `DataSourceStrategy` interface. The result: adding a new data source (e.g., Stripe) requires zero changes to `DashboardService` — just implement the interface and call `registry.register(stripeStrategy)`.

### Dynamic component loading for config UIs

Each data source has a completely different set of query parameters. The Plaid config needs an institution picker and a metric selector. A hypothetical Stripe config would need entirely different fields. Rather than putting a `@if (sourceType === 'PLAID') {...} @else if (sourceType === 'STRIPE') {...}` block inside the dashboard card modal, `strategy.getConfigComponent()` returns the right Angular component class at runtime. The card modal just creates whatever comes back and subscribes to its `configChange` output. Again, no changes to the card component when new sources are added.

### `DataPoint<T>` as the backend contract

The backend doesn't return raw Plaid SDK objects across the HTTP boundary. It wraps them in `DataPoint<T>`, which includes `metric`, `timestamp`, `metadata`, and `sourceType` alongside the actual value. This means the frontend gets consistent envelope structure regardless of which source produced the data. `DataService.unwrapDataPoint()` peels the envelope off to hand just the typed value to the transformer.

### Transformers as separate services

`PlaidTransactionTransformerService` and `PlaidAccountTransformerService` exist purely to convert domain objects (transactions, accounts) into chart-friendly shapes (`BarChartData`, `PieChartData`). They have no HTTP calls, no signals, no Angular-specific behavior — just pure input-to-output functions. This makes them trivial to unit test and easy to extend with new transform methods without touching the strategy service.

### Short-lived `PlaidDataSourceConnection` on the backend

The connection object is not a Spring bean. It is created by `PlaidDataSourceConnector.createConnection(config)` for each request, holds a plaintext access token in memory only for the duration of `fetchData()`, and is closed immediately after via `try-with-resources`. This limits the time any decrypted credential lives in memory and means there are no connection-pool management concerns.
