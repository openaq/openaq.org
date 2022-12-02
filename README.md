# OpenAQ.org website

## Development

The website is built using [Hugo](https://gohugo.io) for content management and static site generation.


For styles SCSS is used with the [openaq-design-system]() SCSS library. Dart Sass is required to compile SCSS and must be installed and available in PATH for Hugo to access.

To use dart-sass with Hugo, install [dart-sass-embedded](https://github.com/sass/dart-sass-embedded) as follows:

1. Download the binary to match your platform from the releases page: https://github.com/sass/dart-sass-embedded/releases

2. Place the downloaded binary in the desired directory on your system. e.g. ~/bin/sass_embedded

3. Add the path to the binary to your system's PATH:

    .zshrc
    ```
    export PATH="${HOME}/bin/sass_embedded:${PATH}"
    ```

Dart Sass will now be discoverable by Hugo.