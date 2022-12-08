# End-to-end Tests

## Overview

This section contains the end-to-end testing of the website using the [Playwright](https://playwright.dev/) testing framework with Node.js.


## Development

Using Node v16 install the packages using yarn:

```sh
yarn install
```

Before testing ensure the Hugo development server is running the site on port 1313 (default)

Once the installation has finished run the tests using:

```
yarn playwright test
```

To run the tests with tracing enabled run 

```sh
yarn playwright test --trace on
```




