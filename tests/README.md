# End-to-end Tests

## Overview

This section contains the end-to-end testing of the website using the [Playwright](https://playwright.dev/) testing framework with Node.js.


## Development

Using Node v20 install the packages using npm:

```sh
npm install && npm playwright install
```

Before testing ensure the Hugo development server is running the site on port 1313 (default)

Once the installation has finished run the tests using:

```
npm playwright test
```

To run the tests with tracing enabled run 

```sh
npm playwright test --trace on
```
