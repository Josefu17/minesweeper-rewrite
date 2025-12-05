Starting the application Locally:

### Set the environment variables
Set the environment variables by renaming `.setenv.template` to `.setenv` and setting the password

Then run (from the **root** folder):
```bash
. ./backend/src/main/kotlin/minesweeper/infrastructure/localdev/.setenv
```

Alternatively, from the `/backend` folder:
```bash
. ./src/main/kotlin/minesweeper/infrastructure/localdev/.setenv
```

### Run (from the /backend folder)
`./gradlew bootRun`