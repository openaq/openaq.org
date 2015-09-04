var fs = require('fs');

// String to modify
var i18n = {
    locales: ['en-US'],
    messages: {
        header: {
          code: 'Code',
          api: 'API',
          sources: 'Sources',
          about: 'About',
          methodology: 'Methodology',
          home: 'Home'
        },
        footer: '{number, plural, =0 {Made} =1 {# measurement captured} other {# measurements captured}} with {heart} by {link} and the {email} team.',
        sources: {
          addData: 'Suggest a Source',
          card: {
            measurements: '{number, plural, =1 {# measurement} other {# measurements}}'
          }
        },
        about: {}
    }
};

/**
 * Probably best not to edit below here
 */
i18n.messages.sources.intro = fs.readFileSync(__dirname + '/sources/intro.md', 'utf8');
i18n.messages.about.intro = fs.readFileSync(__dirname + '/about/intro.md', 'utf8');

module.exports = i18n;
