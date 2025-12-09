## How to Run (Local Development)

### 1. Database

You need a PostgreSQL instance running on port 5432.

**Option A: via Docker Compose**
```bash
docker compose up -d db
````

**Option B: Manual Docker/Podman run**
If you prefer running a standalone container:

```bash
docker run -d \
  --name minesweeper-db \
  -p 5432:5432 \
  -e POSTGRES_DB=minesweeper \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=minesweeper \
  postgres:16-alpine
```

*Default credentials: user=`postgres`, pass=`minesweeper`.*

### 2. Backend

The backend needs environment variables set before starting.

1.  Navigate to the backend folder: `cd backend`
2.  Create your env config by copying the template:

3.
    ```
    cp \
    src/main/kotlin/minesweeper/infrastructure/localdev/.setenv.template \
    src/main/kotlin/minesweeper/infrastructure/localdev/.setenv`
    ``` 

4. Load the variables into your shell:
    ```bash
    source ./src/main/kotlin/minesweeper/infrastructure/localdev/.setenv
    ```
5. Start the server:
    ```bash
    ./gradlew bootRun
    ```

### 3. Frontend

1.  Navigate to the frontend folder: `cd frontend`
2.  Install dependencies (first run only): `npm install`
3.  Start the dev server:
    ```bash
    ng serve
    ```
4.  The frontend is available at `http://localhost:4200` (proxies API requests to port 8080).
