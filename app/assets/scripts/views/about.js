'use strict';
import React from 'react';
import { connect } from 'react-redux';
import JoinFold from '../components/join-fold';

var About = React.createClass({
  displayName: 'About',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>About Us</h1>
              <div className='inpage__introduction'>
                <p>Our mission is to fight air inequality by opening up air quality data and connecting a diverse global, grassroots community of individuals and organizations.</p>
              </div>
            </div>
          </div>

          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--home/cover--home.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--intro' id='about-fold-intro'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>We are guided by principles</h1>
              </header>

              <ul className='principles-list'>
                <li>
                  <article className='card card--principle'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <div className='card__badge'>
                          <img src='/assets/graphics/layout/oaq-icon-illu-48-historical.svg' width='40' height='40' alt='Illustration' />
                        </div>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <h1 className='card__title'>Historical + Programmatic access</h1>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Giving air quality data a wider audience.</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>

                <li>
                  <article className='card card--principle'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <div className='card__badge'>
                          <img src='/assets/graphics/layout/oaq-icon-illu-48-opensource.svg' width='40' height='40' alt='Illustration' />
                        </div>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <h1 className='card__title'>Open source</h1>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Encouraging open collaboration in the open.</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>

                <li>
                  <article className='card card--principle'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <div className='card__badge'>
                          <img src='/assets/graphics/layout/oaq-icon-illu-48-community.svg' width='40' height='40' alt='Illustration' />
                        </div>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <h1 className='card__title'>Community driven</h1>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Working to help each other do impactful work.</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </section>

          <section className='fold fold--type-a' id='about-fold-story'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Our story</h1>
                <div className='fold__teaser prose prose--responsive'>
                  <p>The seed of the idea for OpenAQ emerged from a small open air quality project in Ulaanbaatar, Mongolia, launched by co- founders Joe Flasher and Christa Hasenkopf along with Mongolian colleagues.</p>
                  <p>Amazed at the outsized-impact a little open air quality data can have on a community, Christa, an atmospheric scientist, fell in love with open air quality projects.</p>
                  <p>A few years later, she and Joe, a software developer, wondered: what would happen if all of the world’s air quality data were made available for the public to explore? One day, they quit wondering, started building, and began asking passionate people around the world to help.</p>
                </div>
              </header>
              <figure className='fold__media'>
                <aside className='aside-highlight'>
                  <div className='aside-highlight__contents'>
                    <div className='aside-highlight__prose'>
                      <p>We believe in organizational missions evolving over time.</p>
                    </div>
                  </div>
                </aside>
              </figure>
            </div>
          </section>

          <section className='fold fold--semi-light' id='about-fold-sponsors'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Partners and Sponsors</h1>
              </header>
              <ul className='sponsor-list'>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://www.climateworks.org/'><img src='/assets/graphics/content/sponsors/climateworks.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://developmentseed.org/'><img src='/assets/graphics/content/sponsors/devseed.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://aws.amazon.com/'><img src='/assets/graphics/content/sponsors/aws.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='http://www.fz-juelich.de/portal/DE/Home/home_node.html/'><img src='/assets/graphics/content/sponsors/fj.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://erc.europa.eu/'><img src='/assets/graphics/content/sponsors/erc.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='http://sites.agu.org/'><img src='/assets/graphics/content/sponsors/agu.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='http://earthjournalism.net/'><img src='/assets/graphics/content/sponsors/ejn.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://www.internews.org/'><img src='/assets/graphics/content/sponsors/internews.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://keen.io/'><img src='/assets/graphics/content/sponsors/keenio.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://www.nih.gov/'><img src='/assets/graphics/content/sponsors/nih.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://www.openscienceprize.org/'><img src='/assets/graphics/content/sponsors/openscience.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='http://thrivingearthexchange.org/'><img src='/assets/graphics/content/sponsors/tex.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://wellcome.ac.uk/'><img src='/assets/graphics/content/sponsors/wellcome.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://www.hhmi.org/'><img src='/assets/graphics/content/sponsors/hhmi.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='http://www.echoinggreen.org/'><img src='/assets/graphics/content/sponsors/echoing-green.jpeg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='http://www.wri.org/'><img src='/assets/graphics/content/sponsors/WRI.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://www.paulhastings.com/'><img src='/assets/graphics/content/sponsors/PH.jpg' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='http://godleyfamilyfoundation.org/'><img src='/assets/graphics/content/sponsors/godley.png' alt='Sponsor logo' /></a></li>
                <li><a title='Visit sponsor website' className='sponsor-list__item' target='_blank' href='https://www.radiant.earth/'><img src='/assets/graphics/content/sponsors/radiantearth.png' alt='Sponsor logo' /></a></li>
              </ul>
              <footer className='fold__footer'>
                <a href='mailto:' className='sponsor-button' title='View page'><span>Become a sponsor</span></a>
              </footer>
            </div>
          </section>

          <section className='fold fold--type-b' id='about-fold-book'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>We are an open book</h1>
                <div className='fold__teaser prose prose--responsive'>
                  <p>We value transparency so all our records are publically available.</p>
                  <p className='fold__main-action'>
                    <a href='#' className='button-book-download' title='Download'><span>Download 2018 Form 990</span></a>
                  </p>
                </div>
              </header>
              <figure className='fold__media'>
                <article className='card card--book'>
                  <a href='#' className='card__contents' title='Download'>
                    <header className='card__header'>
                      <div className='card__headline'>
                        <p className='card__subtitle'>2018</p>
                        <h1 className='card__title'>Form 990</h1>
                      </div>
                    </header>
                    <figure className='card__media'>
                      <div className='card__thumb'>
                        <img src='/assets/graphics/content/view--about/card-book-media.jpg' width='724' height='348' alt='Card media' />
                      </div>
                    </figure>
                    <footer className='card__footer'>
                      <img src='/assets/graphics/layout/oaq-logo-col-pos.svg' alt='OpenAQ logotype' width='72' height='40' />
                    </footer>
                  </a>
                </article>
              </figure>
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

module.exports = connect(selector, dispatcher)(About);
