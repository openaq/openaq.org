# End-to-end Testing

End-to-end (e2e) tests are functional tests for automated click-testing of critical paths. It is better to automate this rather than relying on the users to do the testing.
This project is using [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) as end-to-end testing framework.

To run the tests locally, start the development server [ℹ️](../README.md/#getting-started) and run `npm run cy:open`, which opens the interactive test runner.

```
npm run cy:open
```

You can watch tests run in real time as you develop your applications. TDD FTW 🤩!

It is also possible to run the tests and get the results in the command line only with `npm run cy:run`.

Some **testing strategies** with Cypress:

- write specs that will solely test a single behavior
- each spec should be written in isolation and avoid coupling
- avoid brittle selectors, use `data-*` attributes instead
- set state directly/programmatically before testing (e.g. use the endpoint to [request](https://docs.cypress.io/api/commands/request.html) a login token instead of making cypress click the login button)

Read more on best practices here: https://docs.cypress.io/guides/references/best-practices.html
