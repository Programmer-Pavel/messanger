## Installing Dependencies

To install project dependencies, use:

```bash
npm ci
```

This command installs packages strictly according to `package-lock.json`, ensuring consistent dependency versions across all developers.

**Important:** Do not use `npm install` for installing dependencies, as it may update `package-lock.json` and cause version inconsistencies.
