var React = require('react');
var ReactIntl = require('react-intl');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedRelative = ReactIntl.FormattedRelative;
var FormattedMessage = ReactIntl.FormattedMessage;

var DetailItem = React.createClass({

  mixins: [IntlMixin],

  propTypes: {
    location: React.PropTypes.object
  },

  getCSVURL: function (l) {
    return 'https://api.openaq.org/v1/measurements?format=csv&location=' + l.location;
  },

  render: function () {
    var l = this.props.location;
    return (
      <div className='location-detail'>
        <div className='inner'>
          <div className='title'><a href={l.sourceURL} title='See source site' target='_blank'>{l.location}</a></div>
          <div className='extra'><span>Count</span>: <FormattedMessage message={this.getIntlMessage('sources.card.measurements')} number={l.count} /></div>
          <div className='extra'><span>Last Updated</span>: <FormattedRelative value={l.lastUpdated} /></div>
          <div className='extra'><span>Collecting Since</span>: <FormattedRelative value={l.firstUpdated} /></div>
          <div className='extra'><span>Values</span>: {l.parameters.join(', ')}</div>
          <div className='extra'><span>Resolution</span>: {l.resolution}</div>
        </div>
        <div className='divider'></div>
        <div className='links'>
          <a href={this.getCSVURL(l)} title='Download CSV of all data'><span className='collecticon collecticon-download'></span></a>
        </div>
      </div>
    );
  }
});

module.exports = DetailItem;
