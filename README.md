# Clean architecture example

-   Example web server application implementing the [Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) concept as an example web server.
-   API spec is based on https://www.todobackend.com/
-   Technology
    -   Language: TypeScript
    -   Database: SQLite (in memory)
    -   Web server: Koa
-   Fell free to comment and suggest improvements either by creating issue or PR :).

## My current understanding of the Clean architecture

![Clean architecture diagram](./diagram.png)

## Implementation notes

-   The project is trying to implement the [Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) as cleanly as possible on small example app.
-   The folder structure mirrors the Clean architecture as closely as possible. The folders that directly relate to the Clean architecture concepts (and the diagram above) have number prefixes, so they are sorted from the most outer layer to the most inner layer.
    -   `/src/0-config`
    -   `/src/1-external-services`
    -   `/src/2-entrypoints`
    -   `/src/3-use-cases`
    -   `/src/4-entities`
-   There are eslint rules preventing importing from inner layer to the outer layers (see nested `.eslintrc` files).
-   Start the project with `npm run dev` (see all the scripts you can run in [package.json](package.json)).
-   After the project is started, there is example data put in the database (see [storage-migrations.ts](src/1-external-services/storage/storage-migrations.ts)).

## API

-   Routes
    -   `/heartbeat` GET
    -   `/todos` GET, POST, DELETE
    -   `/todos/:id` GET, PATCH, DELETE
-   API Spec
    -   https://www.todobackend.com/
-   Postman
    -   [clean-code.postman_collection.json](./clean-code.postman_collection.json)

## TODOs

-   validation should happen in use-cases?
-   use either?
-   Maybe add more than one thing in the use-case? So we have more than one of each in the use case?
    -   something like dummy email service?

## Related links

-   https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
-   https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/
-   https://dev.to/bespoyasov/clean-architecture-on-frontend-4311
-   https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/
-   https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/
-   https://github.com/mattia-battiston/clean-architecture-example
