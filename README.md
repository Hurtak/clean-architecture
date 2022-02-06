# Clean architecture example

-   Example web server application implementing the [Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) concept as an example web server.
-   API spec is from https://www.todobackend.com/
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
    -   `/src/1-data-providers`
    -   `/src/2-entrypoints`
    -   `/src/3-use-cases`
    -   `/src/4-entities`
-   Start the project with `npm run dev` (see all the scripts you can run in [package.json](package.json)).
-   After the project is started, there is example data put in the database (see [storage-migrations.ts](src/1-data-providers/storage/storage-migrations.ts)).

## TODOs

-   Is `TodoWithoutId` really entity (core business type) or should it be higher, like in use-cases (it is need in use-cases but it does not feel like it belongs there)?
-   Since `1-data-providers` can be also communication with 3rd party services that do not provide data, eg send email service, maybe this should be named differently?
-   Maybe rename `4-entities` to `4-domain` to be more clear?
-   Feedback from Reddit thread https://www.reddit.com/r/typescript/comments/qq8psv/ratecriticize_my_typescript_clean_architecture/
-   Maybe Zod validation errors should not get returned directly by API in `additionalData` but transformed to out own data type in api-ports?
-   Maybe add more than one thing in the use-case? So we have more than one of each in the use case?
    -   something like dummy email service?
-   `3-use-cases/todos.ts` pretty much re-implements storage types, maybe we could share it somehow?
-   make sure every response is JSON based
    -   400 JSON parse error response is a text
    -   404 response is a text
    -   500 response is a text

## Related links

-   https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
-   https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/
-   https://dev.to/bespoyasov/clean-architecture-on-frontend-4311
-   https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/
-   https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/
-   https://github.com/mattia-battiston/clean-architecture-example
