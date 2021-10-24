# Clean architecture example

-   Example repository implementing
    -   https://www.todobackend.com/ with additional AUTH layer (so the CRUD operations are not global but per user)
    -   Implemented with Clean architecture (Onion architecture)
    -   TypeScript & Express
    -   SQLite (in memory)

## TODOs

-   src/3-use-cases/todos.ts USE CASE is importing DATA PROVIDER, but it is only type, so maybe it is fine?
-   tests?
-   handle TODOs
