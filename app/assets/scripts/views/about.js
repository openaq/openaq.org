'use strict';
import React from 'react';
import { connect } from 'react-redux';

var About = React.createClass({
  displayName: 'About',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline header--centered'>
              <h1 className='inpage__title'>About Us</h1>
              <div className='inpage__introduction'>
                <p>We empower communities to end air inequality through open data.</p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--media-bleed-left'>
            <div className='inner'>
              <div className='fold__media'>
                <figure className='media' style={{backgroundImage: 'url(assets/graphics/content/about1.jpg)'}}>
                  <img className='media__item' src='assets/graphics/content/about1.jpg' width='768' height='768' alt='About image 1' />
                </figure>
              </div>
              <div className='fold__copy'>
                <header className='fold__header'>
                  <h1 className='fold__title'>Our Mission</h1>
                </header>
                <div className='fold__body'>
                  <p>Our mission is to enable previously impossible science, impact policy and empower the public to fight air pollution through open data, open-source tools, and cooperation.</p>
                </div>
                <a href='https://medium.com/@openaq/the-mission-of-openaq-e290e4ae4a0a' target='_blank' className='button button--large button--primary-bounded'>Learn More</a>
              </div>
            </div>
          </section>

          <section className='fold fold--filled fold--media-bleed-right'>
            <div className='inner'>
              <div className='fold__media'>
                <figure className='media' style={{backgroundImage: 'url(assets/graphics/content/about2.jpg)'}}>
                  <img className='media__item' src='assets/graphics/content/about2.jpg' width='768' height='768' alt='About image 2' />
                </figure>
              </div>
              <div className='fold__copy'>
                <header className='fold__header'>
                  <h1 className='fold__title'>Data Sources</h1>
                </header>
                <div className='fold__body'>
                  <p>
We aggregate physical air quality data from public data sources provided by government, research-grade and other sources. These awesome groups do the hard work of measuring these data and publicly sharing them, and our community makes them more universally-accessible to both humans and machines. Note: (1) We do not validate or transform the data from their originating sources. (2) Real-time data, by their nature, often have not undergone quality assurance or control processes by their originating sources. (3) Please contact originating sources for more detailed information not provided on this platform.</p>
                <a href='https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85'>Data Disclaimer and More Information</a>
                </div>
              </div>
            </div>
          </section>

          <section className='fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Partners and Sponsors</h1>
              </header>
              <div className='fold__body'>
                <ul className='sponsors__list'>
                  <li><a className='sponsors__item' target='_blank' href='https://www.climateworks.org/'><img src='assets/graphics/content/sponsors/climateworks.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://developmentseed.org/'><img src='assets/graphics/content/sponsors/devseed.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://aws.amazon.com/'><img src='assets/graphics/content/sponsors/aws.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://www.fz-juelich.de/portal/DE/Home/home_node.html/'><img src='assets/graphics/content/sponsors/fj.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://erc.europa.eu/'><img src='assets/graphics/content/sponsors/erc.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://sites.agu.org/'><img src='assets/graphics/content/sponsors/agu.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://earthjournalism.net/'><img src='assets/graphics/content/sponsors/ejn.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.internews.org/'><img src='assets/graphics/content/sponsors/internews.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://keen.io/'><img src='assets/graphics/content/sponsors/keenio.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.nih.gov/'><img src='assets/graphics/content/sponsors/nih.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.openscienceprize.org/'><img src='assets/graphics/content/sponsors/openscience.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://thrivingearthexchange.org/'><img src='assets/graphics/content/sponsors/tex.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://wellcome.ac.uk/'><img src='assets/graphics/content/sponsors/wellcome.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.hhmi.org/'><img src='assets/graphics/content/sponsors/hhmi.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://www.echoinggreen.org/'><img src='assets/graphics/content/sponsors/echoing-green.jpeg' alt='View sponsor website'/></a></li>
                     <li><a className='sponsors__item' target='_blank' href='http://www.wri.org/'><img src='assets/graphics/content/sponsors/WRI.jpg' alt='View sponsor website'/></a></li>
                <li><a className='sponsors__item' target='_blank' href='https://www.paulhastings.com/'><img src='assets/graphics/content/sponsors/PH.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://godleyfamilyfoundation.org/'><img src='assets/graphics/content/sponsors/godley.png' alt='View sponsor website'/></a></li>
                    <li><a className='sponsors__item' target='_blank' href='https://www.radiant.earth/'><img src='assets/graphics/content/sponsors/radiantearth.png' alt='View sponsor website'/></a></li>
                       </ul>
              </div>
            </div>
          </section>

        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(About);
