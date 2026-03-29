# Food Order System - Software Architecture Assignment

Mini system that demonstrates:
- Service-based architecture (3 Spring Boot services)
- Event-driven patterns (choreography and orchestration)
- PostgreSQL + partitioning demos
- Docker multi-stage build and Docker Compose runtime

## 1) Project Structure

```text
food-order-system/
├── order-service/
├── payment-service/
├── kitchen-service/
├── docker-compose.yml
└── README.md
```

## 2) Architecture Diagram

```text
Client
  |
  v
Order Service  ----(REST)----> Payment Service ----(REST)----> Kitchen Service
  |
  +--(PostgreSQL: orders + partition-demo tables/schemas)
```

## 3) Event Flow Diagrams

### Choreography

```text
1) Client -> Order Service: POST /order (mode=choreography)
2) Order Service publishes local OrderCreatedEvent
3) Listener in Order Service calls Payment Service /events/order-created
4) Payment Service processes payment + publishes PaymentCompletedEvent
5) Listener in Payment Service calls Kitchen Service /events/payment-completed
6) Kitchen Service prepares food
```

### Orchestration

```text
1) Client -> Order Service: POST /order (mode=orchestration)
2) Order Service (orchestrator component) calls Payment Service /pay
3) Orchestrator calls Kitchen Service /cook
```

## 4) APIs

### Order Service (port 8081)
- `POST /order`
  - Body:
    ```json
    {
      "customerName": "Alice",
      "itemName": "Burger",
      "quantity": 2,
      "mode": "choreography"
    }
    ```
  - `mode`: `choreography` or `orchestration`

- Partition demo endpoints:
  - `POST /partition/horizontal`
    ```json
    { "name": "John", "gender": "male" }
    ```
  - `POST /partition/vertical`
    ```json
    { "name": "Anna", "address": "HCM City" }
    ```
  - `POST /partition/function`
    ```json
    { "payload": "demo-log" }
    ```

### Payment Service (port 8082)
- `POST /pay`
- `POST /events/order-created`

### Kitchen Service (port 8083)
- `POST /cook`
- `POST /events/payment-completed`

## 5) Database and Partitioning

### PostgreSQL
- Database: `food_order`
- Main table: `orders`
- Auto-init by `order-service/src/main/resources/schema.sql` + `data.sql`

### Horizontal partition demo
- `user_male`
- `user_female`
- Logic routes by gender.

### Vertical partition demo
- `user_basic(id, name)`
- `user_detail(id, address)`

### Function partition demo
- Schemas:
  - `payment_data`
  - `kitchen_data`
- Tables:
  - `payment_data.audit_log`
  - `kitchen_data.audit_log`

## 6) Run with Docker Compose

From root folder:

```bash
docker compose up --build
```

Services:
- Order: `http://localhost:8081`
- Payment: `http://localhost:8082`
- Kitchen: `http://localhost:8083`
- PostgreSQL: `localhost:5432`

## 7) Docker Optimization Used

- Multi-stage Dockerfile in each service:
  - Build stage: `maven:3.9.6-eclipse-temurin-17`
  - Runtime stage: `eclipse-temurin:17-jre-jammy`
- `.dockerignore` excludes build/IDE artifacts.
- PostgreSQL uses lightweight `postgres:16-alpine`.

## 8) DockerHub Push (example)

```bash
docker build -t <username>/order-service ./order-service
docker push <username>/order-service
```

Repeat for `payment-service` and `kitchen-service`.

## 9) Monolithic vs Service-based

- Monolithic:
  - Single codebase, single deployment unit, shared DB and modules.
- Service-based:
  - 3 independent services, independent deployment, REST communication.

## 10) Choreography vs Orchestration Comparison

| Criteria | Choreography | Orchestration |
|---|---|---|
| Control | Distributed | Centralized |
| Coupling | Lower | Higher |
| Scalability | High | Medium |
| Debugging | Harder | Easier |
| Resilience | High | Depends on orchestrator |

### Final Decision

For this mini system, **choreography** is preferred when prioritizing scalability and resilience because no single orchestrator becomes a bottleneck or single point of failure.
Orchestration is still implemented for easier flow tracing and debugging in simple environments.

## 11) Create PostgreSQL Image with Data (manual demo)

1. Start DB:
   ```bash
   docker run --name demo-pg -e POSTGRES_PASSWORD=123 -e POSTGRES_DB=food_order -p 5432:5432 -d postgres:16-alpine
   ```
2. Insert sample data (via `psql` or any SQL client).
3. Commit image:
   ```bash
   docker commit demo-pg <username>/food-order-db:seeded
   ```
