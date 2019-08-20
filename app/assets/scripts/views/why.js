'use strict';
import React from 'react';
import { connect } from 'react-redux';
import widont from '../utils/widont';
import JoinFold from '../components/join-fold';

var Why = React.createClass({
  displayName: 'Why open air quality?',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header inpage__header--jumbo'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Why open air quality?</h1>
              <div className='inpage__introduction'>
                <p>Because everyone should have access to clean air.</p>
              </div>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--why/cover--why.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--intro'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>{widont('Poor air quality is one of the largest public health threats of our time.')}</h1>
              </header>
              <figure className='fold__media prose prose--responsive'>
                <ul className='big-stats-list'>
                  <li className='big-stat'><strong className='big-stat__value'>8.8M</strong> <span className='big-stat__label'>deaths each year</span></li>
                  <li className='big-stat'><strong className='big-stat__value'>90%</strong> <span className='big-stat__label'>in developing countries</span></li>
                </ul>
              </figure>
            </div>
          </section>

          <section className='fold' id='why-fold-toll'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__subtitle'>The toll of air inequality</h1>
                <h2 className='fold__title'>1 in 8 premature deaths in the world</h2>
                <div className='fold__teaser prose prose--responsive'>
                  <p>Air pollution is the 4th largest risk factor to human health on the planet, according to the Global Burden of Disease study. 92% of the world population lives in areas where the air quality does not meet the World Health Organization guideline, and air pollution disproportionately affects those in developing countries.</p>
                </div>
              </header>
              <div className='fold__lead'>
                <div className='fold__claim'>
                  <p>While air pollution poses one of the largest public health burdens on the planet, it is completely solvable with existing technologies and infrastructures.</p>
                </div>
                <figure className='fold__media'>
                  <img src='/assets/graphics/content/view--why/fold-toll-media.jpg' alt='Fold media' width='1652' height='972' />
                </figure>
              </div>
              <div className='fold__body prose prose--responsive'>
                <p>Evidence from Bangkok to London to Pittsburgh show that it can be solved. The common thread of success from city to city and country to country in battling air pollution involves a simple premise: positive change is effected when there is sustained will to address pollution and a solid set of plans to do so. Whether these are formal government policies, informal community-led activities, or most often, a combination of the two.</p>
                <p>Two drivers that build that sustained will and solid plans are: a community with a diverse background (e.g. scientists, tech folks, policymakers, medical doctors, journalists, activists, etc.) and their access to open data.</p>
              </div>
            </div>
          </section>

          <section className='fold fold--type-a' id='why-fold-data-access'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__subtitle'>A lack of data access</h1>
                <h2 className='fold__title'>People lack access to open air quality data</h2>
                <div className='fold__teaser prose prose--responsive'>
                  <p>Data, if measured, are often only shared in human-readable or temporary ways. Even in countries that provide data openly, the data are shared in disparate formats. In several places, even if data are generated, they are not shared openly. This lack of harmonized data access does not allow the full ecosystem of scientific work, policy analyses, data-driven media, open tools, and a global network to develop.</p>
                </div>
              </header>
              <figure className='fold__media'>
                <img src='/assets/graphics/content/view--why/fold-data-access-media.jpg' alt='Fold media' width='1030' height='1920' />
              </figure>
            </div>
          </section>

          <section className='fold' id='why-fold-harmonizing-data'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__subtitle'>Harmonizing data for impact </h1>
                <h2 className='fold__title'>Air quality data into a single format</h2>
                <div className='fold__teaser prose prose--responsive'>
                  <p>We foster a community of data-users to build open-source, shareable tools on top of the data, to use the data in a variety of scientific, policy, and other community-driven ways, and to connect with one another across sectors and geographies.</p>
                </div>
              </header>

              <figure className='fold__media'>
                <img src='/assets/graphics/content/view--why/fold-harmonizing-media.jpg' alt='Fold media' width='2222' height='1380' />
              </figure>

              <div className='infold'>
                <div className='infold__teaser prose prose--responsive'>
                  <p>We foster a community of data-users to build open-source, shareable tools on top of the data, to use the data in a variety of scientific, policy, and other community-driven ways, and to connect with one another across sectors and geographies.</p>
                </div>
                <figure className='infold__media'>
                  <img src='/assets/graphics/content/view--why/oaq-pollutats-graph.png' alt='Graphic: the 7 pollutants we share' width='1134' height='1188' />
                  <figcaption className='infold__media-caption'>The 7 pollutants we share</figcaption>
                </figure>
              </div>

              <div className='fold__block'>
                <ul className='big-stats-list'>
                  <li className='big-stat'><strong className='big-stat__value'>15M</strong> <span className='big-stat__label'>Data requests/month</span></li>
                </ul>
                <div className='fold__claim'>
                  <p>The platform receives about 15 million data requests each month from individuals and organizations around the world.</p>
                </div>
                <div className='fold__body prose prose--responsive'>
                  <p>To date, data from OpenAQ have been used to produce peer-reviewed scientific research papers, to power web and phone apps, to calibrate citizen science and private sector low-cost sensor efforts, and more. Community members have built open-source tools off of the universal dataset, enabling a statistician in Indonesia to quickly analyze data because of something someone in Mongolia created.</p>
                  <p>Community members have connected virtually through our Slack Channel and also through our city-level workshops. They have gone on to conduct new scientific studies done in collaboration with local policy experts, jointly lobbied for new air quality standards, and requested their government open up their air quality data.</p>
                </div>
              </div>
            </div>
          </section>

          <JoinFold />

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

module.exports = connect(selector, dispatcher)(Why);
