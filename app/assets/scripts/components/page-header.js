'use strict';
import React from 'react';
import { IndexLink, Link } from 'react-router';

const m = (min, max) => window.innerWidth >= min && window.innerWidth <= max;

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    routes: React.PropTypes.array
  },

  render: function () {
    window.refresh = () => this.setState({a: Date.now()});

    return (
      <header className='page__header' role='banner'>
        <h1 className='page__title'>OpenAQ</h1>

        <nav className='page__prime-nav nav'>

          <div className='nav__group nav__group--main'>
            <div className='inner'>

              <IndexLink to='/' title='Visit homepage' className='nav__home-link'>
                <img src='/assets/graphics/layout/oaq-logo-col-pos.svg' alt='OpenAQ logotype' width='72' height='40' />
                <span>Home</span>
              </IndexLink>
              <Link to='/community' title='View page' className='nav__action-link'><span>Get involved</span></Link>
              {m(991, 3000) && (
                <ul className='global-menu'>
                  <li><a href='#' title='View page' className='global-menu__link'><span>Home</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link'><span>Why open air quality?</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link global-menu__link--alt global-menu__link--active'><span>Open data</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link global-menu__link--alt'><span>Community</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link'><span>Blog</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link global-menu__link--alt'><span>About us</span></a></li>
                </ul>
              )}
              {m(0, 991) && (
                <a href='#nav-group-global' title='View menu' className='nav__burguer-link nav__burguer-link--alt'><span>Jump to main menu</span></a>
              )}
            </div>
          </div>

          {m(0, 991) && (
            <div className='nav__group nav__group--sub' id='nav-group-global'>
              <div className='inner'>
                <h3 className='nav__title visually-hidden'>Main</h3>
                <ul className='global-menu'>
                  <li><a href='#' title='View page' className='global-menu__link'><span>Home</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link'><span>Why open air quality?</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link global-menu__link--alt'><span>Open data</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link global-menu__link--alt'><span>Community</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link'><span>Blog</span></a></li>
                  <li><a href='#' title='View page' className='global-menu__link global-menu__link--alt'><span>About us</span></a></li>
                </ul>
              </div>
            </div>
          )}

          <div className='nav__group nav__group--sub' id='nav-group-open-data'>
            <div className='inner'>
              <h3 className='nav__title nav__title--sub'><a href='#' title='Back'><span>Open data</span></a></h3>
              <ul className='sub-menu'>
                <li>
                  <a href='#' title='View page' className='sub-menu__link sub-menu__link--locations'>
                    <h5>Locations</h5>
                    <p>Mauris posuere mauris a molestie ultrices.</p>
                  </a>
                </li>
                <li>
                  <a href='#' title='View page' className='sub-menu__link sub-menu__link--countries'>
                    <h5>Countries</h5>
                    <p>Mauris posuere mauris a molestie ultrices.</p>
                  </a>
                </li>
                <li>
                  <a href='#' title='View page' className='sub-menu__link sub-menu__link--map'>
                    <h5>World map</h5>
                    <p>Mauris posuere mauris a molestie ultrices.</p>
                  </a>
                </li>
                <li>
                  <a href='#' title='View page' className='sub-menu__link sub-menu__link--api'>
                    <h5>Use API</h5>
                    <p>Mauris posuere mauris a molestie ultrices.</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </nav>
      </header>
    );
  }
});

module.exports = PageHeader;
