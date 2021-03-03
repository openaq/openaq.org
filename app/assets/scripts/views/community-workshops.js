import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import widont from '../utils/widont';
import _ from 'lodash';
import c from 'classnames';
import { Dropdown } from 'openaq-design-system';

import WorkshopFold from '../components/workshop-fold';
import content from '../../../content/*.json';
import pngImages from '../../graphics/content/view--community-workshops/*.png';
import jpgImages from '../../graphics/content/view--community-workshops/*.jpg';
import jpegImages from '../../graphics/content/view--community-workshops/*.jpeg';

import QsState from '../utils/qs-state';

import StripeCommunityWorkshops from '../../graphics/content/view--community-workshops/stripe--community-workshops.jpg';

function getImage(path) {
  const filename = path && path.split('workshops/')[1]?.split('.')[0];
  return (
    filename &&
    (pngImages[filename] || jpgImages[filename] || jpegImages[filename] || null)
  );
}

// Values for the filters.
const filterData = {
  location: {
    values: _(content.workshops)
      .values()
      .map(o => o.location)
      .filter(Boolean)
      .uniq()
      .value(),
    label: 'locations',
  },
};

class CommunityWorkshops extends React.Component {
  constructor(props) {
    super(props);

    this.qsState = new QsState({
      location: {
        accessor: 'filter.location',
        default: null,
      },
    });

    this.state = this.qsState.getState(props.location.search.substr(1));
  }

  onFilterSelect(what, value, e) {
    e.preventDefault();
    this.setState(
      {
        filter: Object.assign({}, this.state.filter, {
          [what]: value,
        }),
      },
      () => {
        const qObj = this.qsState.getQueryObject(this.state);
        this.props.history.push(
          Object.assign({}, this.props.location, { query: qObj })
        );
      }
    );
  }

  renderFilterDropdown(what) {
    const values = filterData[what].values;
    const label = `All ${filterData[what].label}`;
    const current = this.state.filter[what];

    return (
      <Dropdown
        triggerElement="a"
        triggerTitle={`Filter by ${what}`}
        triggerText={current || label}
      >
        <ul role="menu" className="drop__menu drop__menu--select">
          <li>
            <a
              className={c('drop__menu-item', {
                'drop__menu-item--active': current === null,
              })}
              href="#"
              target="_blank"
              rel="noreferrer"
              title="Show all values"
              data-hook="dropdown:close"
              onClick={this.onFilterSelect.bind(this, what, null)}
            >
              <span>{label}</span>
            </a>
          </li>
          {values.map(o => (
            <li key={o}>
              <a
                className={c('drop__menu-item', {
                  'drop__menu-item--active': current === o,
                })}
                href="#"
                target="_blank"
                rel="noreferrer"
                title={`Filter by ${o}`}
                data-hook="dropdown:close"
                onClick={this.onFilterSelect.bind(this, what, o)}
              >
                <span>{o}</span>
              </a>
            </li>
          ))}
        </ul>
      </Dropdown>
    );
  }

  renderWorkshops() {
    const { location } = this.state.filter;

    // TODO
    let cards = _(content.workshops).sortBy('order').values();

    // Apply filters if they're set
    if (location) {
      cards = cards.filter(o => {
        if (location && o.location !== location) {
          return false;
        }
        return true;
      });
    }
    cards = cards
      .map(o => {
        return (
          <li key={o.filename}>
            <article className="card card--workshop">
              <a
                className="card__contents"
                href={o.url}
                title="View more"
                target="_blank"
                rel="noreferrer"
              >
                <figure className="card__media">
                  <div className="card__cover">
                    <img
                      src={
                        getImage(o.image) ||
                        'https://via.placeholder.com/640x320'
                      }
                      width="640"
                      height="320"
                      alt="Card cover"
                    />
                  </div>
                </figure>
                <header className="card__header">
                  <div className="card__headline">
                    <p className="card__subtitle">{o.location}</p>
                    <h1 className="card__title">{o.title}</h1>
                  </div>
                </header>
                <footer className="card__footer">
                  <p className="card__footer-detail">{o.date}</p>
                </footer>
              </a>
            </article>
          </li>
        );
      })
      .value();

    return (
      <section className="fold" id="community-fold-workshops">
        <div className="inner">
          <header className="fold__header">
            <h1 className="fold__title">Workshops</h1>
            <nav className="fold__nav">
              <h2>Filter by</h2>
              <h3>Location</h3>
              {this.renderFilterDropdown('location')}
              <p className="summary">Showing {cards.length} workshops</p>
            </nav>
          </header>
          <ul className="workshop-list">
            {cards.length ? (
              cards
            ) : (
              <p>No workshops found for the given filters</p>
            )}
          </ul>
        </div>
      </section>
    );
  }

  render() {
    return (
      <section className="inpage">
        <header className="inpage__header">
          <div className="inner">
            <div className="inpage__headline header--centered">
              <h1 className="inpage__title">OpenAQ Workshops</h1>
              <div className="inpage__introduction">
                <p>
                  {widont(
                    'We hold workshops to help people in various sectors find the most impactful ways they can fight air inequality in their local community.'
                  )}
                </p>
                <p>
                  <a href="mailto:info@openaq.org">Contact us</a>
                  {widont(
                    ', if you are interested in holding a workshop in your community.'
                  )}
                </p>
              </div>
            </div>
          </div>
          <figure className="inpage__media inpage__media--stripe media">
            <div className="media__item">
              <img
                src={StripeCommunityWorkshops}
                alt="Stripe image"
                width="2880"
                height="960"
              />
            </div>
          </figure>
        </header>
        <div className="inpage__body">
          {this.renderWorkshops()}
          <WorkshopFold />
        </div>
      </section>
    );
  }
}

CommunityWorkshops.propTypes = {
  location: T.object,
  history: T.object,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

// Connect to access router.
module.exports = connect()(CommunityWorkshops);
