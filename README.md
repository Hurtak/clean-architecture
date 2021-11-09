# Clean architecture example

-   Example web server application implementing the [Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) concept as an example web server.
-   API spec is from https://www.todobackend.com/
-   Technology
    -   Language: TypeScript
    -   Database: SQLite (in memory)
    -   Web server: Koa

## My current understanding of the Clean architecture

![Clean architecture diagram](./diagram.png)

## Implementation notes

-   The project is trying to implement the [Clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) as cleanly as possible on small example app
-   The folder structure mirrors the Clean architecture as closely as possible. The folders that directly relate to the Clean architecture concepts (and the diagram above) have number prefixes, so they are sorted from the most outer layer to the most inner layer.
    -   `/src/0-config`
    -   `/src/1-data-providers`
    -   `/src/2-entrypoints`
    -   `/src/3-use-cases`
    -   `/src/4-entities`
-   Start the project with `npm run dev` (see all the scripts in [package.json](package.json)).

## Problems/Questions

-   Is `TodoWithoutId` really entity (core business type) or should it be higher, like in use-cases (it is need in use-cases but it does not feel like it belongs there)?
-   There is import of types from outer layers to inner ones.
    -   For example `3-use-case/todos` imports `1-data-providers/storage` which is violation of the rule that dependencies flow only inward. The dependency itself flows inward (the storage is dependency injected) byt the type definition import violates this.
-   Since `1-data-providers` can be also communication with 3rd party services that do not provide data, eg send email service, maybe this should be named differently?
-   What about logger? Currently it is in `1-data-providers` so it can be used by other `1-data-providers` but it is not really providing data or communicate with external service, it seems to fit more into `2-entry-point` since it is kind of empty entry point with output (console) type of thing, but we cannot move it there (to `2-entry-point`) since logger needs to be dependency injected into other `1-data-providers`. Maybe renaming `1-data-providers` could also solve this.
-   Maybe rename `4-entities` to `4-domain` to be more clear?

## Remaining work

-   Maybe Zod validation errors should not get returned directly by API in `additionalData` but transformed to out own data type in api-ports?
-   Maybe add more than one thing in the use-case, something like dummy email service? So we have more than one of each in the use case?

## Nice to have

-   make sure every response is JSON based
    -   400 JSON parse error response is a text
    -   404 response is a text
    -   500 response is a text
-   add linter rule preventing of import of modules from inner to outer layers
-   add tests

## Related links

-   https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
-   https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/
-   https://dev.to/bespoyasov/clean-architecture-on-frontend-4311
-   https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/
-   https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/
-   https://github.com/mattia-battiston/clean-architecture-example
