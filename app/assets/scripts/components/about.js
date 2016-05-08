var React = require('react');
var ReactIntl = require('react-intl');
var MdastComponent = require('./mdast-react-component');

var Header = require('./header');
var Footer = require('./footer');

var IntlMixin = ReactIntl.IntlMixin;

var About = React.createClass({

  mixins: [
    IntlMixin
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  render: function () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='dark' />
        <div className='about page'>
          <div className='intro'>
            <MdastComponent>{this.getIntlMessage('about.intro')}</MdastComponent>
          </div>
          <div className='sponsors'>
            <div className='title'>Partners and Sponsors</div>
            <hr />
            <a href='https://developmentseed.org' title='Development Seed' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/devseed.png'/>
            </a>
            <a href='https://aws.amazon.com' title='Amazon Web Services' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/aws.png'/>
            </a>
            <a href='https://www.nih.gov/' title='National Institutes of Health' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/nih.jpg'/>
            </a>
            <a href='http://thrivingearthexchange.org/' title='Thriving Earth Exchange' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/tex.png'/>
            </a>
            <a href='http://sites.agu.org/' title='American Geophysical Union' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/agu.jpg'/>
            </a>
            <a href='http://earthjournalism.net/' title='Earth Journalism Network' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/ejn.png'/>
            </a>
            <a href='https://www.internews.org/' title='Internews' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/internews.png'/>
            </a>
            <a href='https://keen.io' title='Keen.io' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/keenio.jpg'/>
            </a>
            <a href='http://www.wellcome.ac.uk/' title='Wellcome Trust' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/wellcome.jpg'/>
            </a>
            <a href='http://openscienceprize.org/' title='The Open Science Prize' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/openscience.png'/>
            </a>
            <a href='https://www.hhmi.org/' title='Howard Hughes Medical Institute' target='_blank'>
              <img src='/assets/graphics/layout/sponsors/hhmi.jpg'/>
            </a>
          </div>
        </div>
        <Footer locales={this.props.locales} messages={this.props.messages} />
      </div>
    );
  }
});

module.exports = About;
