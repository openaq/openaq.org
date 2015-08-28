var React = require('react');
var Link = require('react-router').Link;

var Header = require('./header');

var Home = React.createClass({

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  render: function () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='light no-logo' />
        <div className='home page'>
          {/* banner */}
          <div className='banner'>
            <div className='inner'>
              <h1 className='site-title'>OpenAQ</h1>
              <p className='site-description'>Building the first open, real-time air quality data hub for the world.</p>
              <p className='cta-wrapper'><a href='#/sources' title='See the available sources' className='bttn-cta light large'>Access & Contribute Data</a></p>
            </div>
          </div>
          {/* banner */}
          {/* content-blocks */}
          <div className='content-blocks'>
            <div className='inner'>
              <section className='feat-block'>
                <h2>What is OpenAQ?</h2>
                <div className='prose'>
                  <p>We are a community of scientists, software developers, and lovers of open environmental data. Together, we are building an open, real-time database that provides programmatic and historical access to air quality data.</p>
                </div>
              </section>
              <section className='feat-block'>
                <h2>Why OpenAQ?</h2>
                <div className='prose'>
                  <p>Globally, thousands of stations publish real-time air quality info that just disappears after it’s displayed. We are aggregating, standardizing and sharing this info so that the public - from researchers to media - can do awesome things with it. </p>
                </div>
              </section>
              <section className='feat-block'>
                <h2>Get Involved</h2>
                <div className='prose'>
                  <p>Our highest priority is building a community around open real-time air quality data, and we’d love you to join us.  Chat with us on <a href='https://openaq-slackin.herokuapp.com/' target='_blank'>Slack</a>, contribute code on <a href='https://github.com/openaq' target='_blank'>GitHub</a>, suggest new <Link to='sources'>data sources</Link> or just <a href='http://eepurl.com/bi1Uhn' target='_blank'>join the mailing list</a>.</p>
                </div>
              </section>
            </div>
          </div>
          {/* content-block */}
        </div>
      </div>
    );
  }
});

module.exports = Home;
