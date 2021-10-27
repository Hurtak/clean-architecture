# Clean architecture example

-   Example repository implementing the Clean architecture (Onion architecture) concepts
    -   API spec is from https://www.todobackend.com/
    -   Language: TypeScript
    -   Web server: Express
    -   Database: SQLite (in memory)

## Links

-   https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
-   https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/
-   https://dev.to/bespoyasov/clean-architecture-on-frontend-4311
-   https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/
-   https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/
-   https://github.com/mattia-battiston/clean-architecture-example

## TODOs

-   logger - the api routes are async and express is sync + done, we do not correctly call done, so the middlewares do not work correctly
    -   test 404 routes if they log 404
    -   test throwing in routes and the generic error handler
-   exceptions or maybe type?
-   tests?
-   cleanup
    -   handle TODOs
    -   handle @ts-ignore
