# Application Configuration Guide

## Environment-Specific Configuration

This application uses Spring Boot profiles to manage environment-specific configuration.

### Local Development Setup

1. **Create your local configuration file:**
   ```bash
   cd backend/src/main/resources
   cp application-local.yaml.example application-local.yaml
   ```

2. **Update credentials:**
   Edit `application-local.yaml` and replace the placeholder values with your actual credentials:
   - Database credentials (username, password)
   - Plaid API credentials (client-id, secret)

3. **Activate the local profile:**
   
   Choose one of the following methods:

   **Option A: Environment Variable (Recommended)**
   ```bash
   export SPRING_PROFILES_ACTIVE=local
   ```
   
   **Option B: IDE Configuration**
   - IntelliJ IDEA: Run → Edit Configurations → Active profiles: `local`
   - VS Code: Add to launch.json: `"env": {"SPRING_PROFILES_ACTIVE": "local"}`
   
   **Option C: Command Line**
   ```bash
   ./gradlew bootRun --args='--spring.profiles.active=local'
   ```

### Configuration Files

- `application.yaml` - Base configuration with placeholders (committed to git)
- `application-local.yaml` - Local development credentials (git-ignored)
- `application-local.yaml.example` - Template for new developers (committed to git)

### Security Notes

- **Never commit `application-local.yaml`** - It's already in `.gitignore`
- The base `application.yaml` uses environment variable placeholders
- For production, use environment variables or secure secret management

### Configuration Properties

The application binds Plaid configuration using `@ConfigurationProperties`:

```yaml
plaid:
  client-id: YOUR_PLAID_CLIENT_ID
  secret: YOUR_PLAID_SECRET
  environment: sandbox  # or development, production
```

These are automatically injected into the `PlaidProperties` class and used throughout the application.

