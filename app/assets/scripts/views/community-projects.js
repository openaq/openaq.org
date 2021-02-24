import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import widont from '../utils/widont';
import _ from 'lodash';
import c from 'classnames';
import { Dropdown } from 'openaq-design-system';

import ConnectFold from '../components/connect-fold';
import CommunityCard from '../components/community-card';
import content from '../../../content/*.json';
import pngImages from '../../graphics/content/view--community-projects/projects/**/*.png';
import jpgImages from '../../graphics/content/view--community-projects/projects/**/*.jpg';
import jpegImages from '../../graphics/content/view--community-projects/projects/**/*.jpeg';

import QsState from '../utils/qs-state';
import StripeCommunityProjects from '/assets/graphics/content/view--community-projects/stripe--community-projects.jpg';

function getLogo(path) {
  const filename = path && path.split('logos/')[1]?.split('.')[0];
  return (
    filename &&
    (pngImages.logos?.[filename] ||
      jpgImages.logos?.[filename] ||
      jpegImages.logos?.[filename] ||
      null)
  );
}
function getCover(path) {
  const filename = path && path.split('covers/')[1]?.split('.')[0];
  return (
    filename &&
    (pngImages.covers?.[filename] ||
      jpgImages.covers?.[filename] ||
      jpegImages.covers?.[filename] ||
      null)
  );
}

// Values for the filters.
const filterData = {
  type: {
    values: _(content.projects)
      .values()
      .map(o => o.type)
      .filter(Boolean)
      .uniq()
      .sortBy()
      .value(),
    label: 'types',
  },

  location: {
    values: _(content.projects)
      .values()
      .map(o => o.location)
      .filter(Boolean)
      .uniq()
      .sortBy()
      .value(),
    label: 'locations',
  },
};

class CommunityProjects extends React.Component {
  constructor(props) {
    super(props);

    this.qsState = new QsState({
      type: {
        accessor: 'filter.type',
        default: null,
      },
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

  renderProjects() {
    const { type, location } = this.state.filter;

    let cards = _(content.projects).values();

    // Apply filters if they're set
    if (type || location) {
      cards = cards.filter(o => {
        if (type && o.type !== type) {
          return false;
        }
        if (location && o.location !== location) {
          return false;
        }
        return true;
      });
    }

    cards = cards
      .map(o => {
        return (
          <CommunityCard
            key={_.kebabCase(o.title)}
            horizontal={true}
            title={o.title}
            linkTitle="View this community contribution"
            url={o.url}
            imageNode={
              <img
                width="256"
                height="256"
                src={getCover(o.image)}
                alt="Project image"
              />
            }
            type={o.type}
            location={o.location}
            logo={getLogo(o.logo)}
          >
            <div
              className="card__prose"
              dangerouslySetInnerHTML={{ __html: o.body }}
            />
          </CommunityCard>
        );
      })
      .value();

    return (
      <section className="fold" id="community-fold-projects">
        <div className="inner">
          <header className="fold__header">
            <h1 className="fold__title">Projects</h1>
            <nav className="fold__nav">
              <h2>Filter by</h2>
              <h3>Type</h3>
              {this.renderFilterDropdown('type')}
              <h3>Location</h3>
              {this.renderFilterDropdown('location')}
              <p className="summary">Showing {cards.length} projects</p>
            </nav>
          </header>
          <ul className="project-list">
            {cards.length ? (
              cards
            ) : (
              <p>No projects found for the given filters</p>
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
              <h1 className="inpage__title">Community Impact</h1>
              <div className="inpage__introduction">
                <p>
                  {widont(
                    'Projects of our community using the data to fight air inquality in the most exciting ways.'
                  )}
                </p>
              </div>
            </div>
          </div>
          <figure className="inpage__media inpage__media--stripe media">
            <div className="media__item">
              <img
                src={StripeCommunityProjects}
                alt="Stripe image"
                width="2880"
                height="960"
              />
            </div>
          </figure>
        </header>
        <div className="inpage__body">
          {this.renderProjects()}
          <ConnectFold />
        </div>
      </section>
    );
  }
}

CommunityProjects.propTypes = {
  location: T.object,
  history: T.object,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

// Connect to access router.
module.exports = connect()(CommunityProjects);
