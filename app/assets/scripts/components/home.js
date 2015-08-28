var React = require('react');

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
                  <p>Lorem ipsum In ullamco voluptate in Excepteur aliquip sit irure culpa velit mollit ullamco esse enim aute dolor non tempor exercitation est laboris labore sed sint commodo aute velit minim veniam sint occaecat dolore ad ex.</p>
                </div>
              </section>
              <section className='feat-block'>
                <h2>Why OpenAQ?</h2>
                <div className='prose'>
                  <p>Lorem ipsum Adipisicing est consectetur ea proident dolore sint eiusmod dolor anim ad nostrud tempor occaecat nostrud quis ut dolore sit tempor consectetur eiusmod laborum ut eu nostrud non reprehenderit ad id quis in officia aliqua.</p>
                </div>
              </section>
              <section className='feat-block'>
                <h2>Join the Project</h2>
                <div className='prose'>
                  <p>Lorem ipsum Nulla ut culpa dolore voluptate elit ea Ut minim in velit consequat ut esse labore aliquip occaecat aliqua ex officia Ut non cupidatat reprehenderit non laboris occaecat quis ad.</p>
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
