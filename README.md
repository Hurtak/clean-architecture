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

-   patch route
-   maybe add something more so we have more than one of each in the use case?
-   exceptions or maybe type?
    -   if (error instanceof TodoTextTooShort || error instanceof TodoTextTooLong) {
-   Problems/Questions:
    -   there is import of types from outer layers to inner ones, how to solve this?
    -   how would we do auth? In the 2-entry-point API we would call 3-use-case User.isAuthenticated and based on that conditionally call Todo.get (also in 2-entry-point)?
-   tests?
-   cleanup
    -   handle TODOs
