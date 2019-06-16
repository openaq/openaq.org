# OpenAQ

OpenAQ is a community of scientists, software developers and lovers of open environmental data. OpenAQ is building an open, real-time database that provides programmatic and historical access to air quality data.

## Development environment

Requirements:

- [git](https://git-scm.com)
- [nvm](https://github.com/creationix/nvm)

Clone this repository locally and activate the required Node.js version:

```
nvm install
```

Install module dependencies:

```
npm install
```

### Getting started

```
$ npm run serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

### Other commands
Compile the sass files, javascript... Use this instead of ```npm run serve``` if you don't want to watch.
```
$ npm run build
```