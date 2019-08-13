'use strict';
import React from 'react';
import { IndexLink, Link } from 'react-router';
import c from 'classnames';

import Breakpoint from './breakpoint';
import SmartLink from './smart-link';

const subMenus = [
  {
    id: 'open-data',
    title: 'Open Data',
    items: [
      {
        title: 'Locations',
        description: 'Mauris posuere mauris a molestie ultrices.',
        className: 'sub-menu__link--locations',
        url: '/locations'
      },
      {
        title: 'Countries',
        description: 'Mauris posuere mauris a molestie ultrices.',
        className: 'sub-menu__link--countries',
        url: '/countries'
      },
      {
        title: 'World map',
        description: 'Mauris posuere mauris a molestie ultrices.',
        className: 'sub-menu__link--map',
        url: '/map'
      },
      {
        title: 'Use API',
        description: 'Mauris posuere mauris a molestie ultrices.',
        className: 'sub-menu__link--api',
        url: 'https://docs.openaq.org/'
      }
    ]
  },
  {
    id: 'community',
    title: 'Community',
    items: [
      {
        title: 'Overview',
        description: 'Passioned about air quality data? Join our community.',
        className: null,
        url: '/community'
      },
      {
        title: 'Impact',
        description: 'A community using the data to fight air inquality in the most exciting ways.',
        className: null,
        url: '/community/projects'
      },
      {
        title: 'Workshops',
        description: 'Convene local communities to start new projects and collaborations to fight air pollution.',
        className: null,
        url: '/community/workshops'
      }
    ]
  },
  {
    id: 'about',
    title: 'About us',
    items: [
      {
        title: 'Our organization',
        description: 'Our mission is to fight air inequality.',
        className: null,
        url: '/about'
      },
      {
        title: 'Frequently Asked Questions',
        description: 'What, why and who.',
        className: null,
        url: 'https://github.com/openaq/openaq-info/blob/master/FAQ.md'
      }
    ]
  }
];

function isDescendant (parent, child) {
  var node = child.parentNode;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

class PageHeader extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      openMobileMenu: false,
      openSubMenu: null
    };

    this.onMobileMenuClick = this.onMobileMenuClick.bind(this);
    this.onBodyClick = this.onBodyClick.bind(this);
    this.onLinkNavigate = this.onLinkNavigate.bind(this);
  }

  componentDidMount () {
    document.addEventListener('click', this.onBodyClick);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onBodyClick);
  }

  onBodyClick (e) {
    const descendant = isDescendant(document.querySelector('#page-prime-nav'), e.target);
    if (!descendant) {
      this.setState({
        openMobileMenu: null,
        openSubMenu: null
      });
    }
  }

  onMenuClick (what, e) {
    e.preventDefault();
    this.setState({
      openSubMenu: this.state.openSubMenu === what
        ? null
        : what
    });
  }

  onLinkNavigate () {
    // When navigating reset menu.
    this.setState({
      openMobileMenu: null,
      openSubMenu: null
    });
  }

  onMobileMenuClick (e) {
    e.preventDefault();
    this.setState({
      openMobileMenu: !this.state.openMobileMenu,
      openSubMenu: null
    });
  }

  renderGlobalMenu () {
    const altClass = name =>
      c('global-menu__link global-menu__link--alt', {
        'global-menu__link--active': this.state.openSubMenu === name
      });

    return (
      <ul className='global-menu'>
        <li>
          <Link to='/' title='View page' className='global-menu__link' onClick={this.onLinkNavigate}>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to='/why' title='View page' className='global-menu__link' onClick={this.onLinkNavigate}>
            <span>Why open air quality?</span>
          </Link>
        </li>
        <li>
          <a
            href='#nav-group-open-data'
            title='View menu'
            className={altClass('open-data')}
            onClick={this.onMenuClick.bind(this, 'open-data')}
          >
            <span>Open data</span>
          </a>
        </li>
        <li>
          <a
            href='#nav-group-community'
            title='View menu'
            className={altClass('community')}
            onClick={this.onMenuClick.bind(this, 'community')}
          >
            <span>Community</span>
          </a>
        </li>
        <li>
          <a href='https://medium.com/@openaq' title='View blog' className='global-menu__link' target='_blank' onClick={this.onLinkNavigate}>
            <span>Blog</span>
          </a>
        </li>
        <li>
          <a
            href='#nav-group-about'
            title='View menu'
            className={altClass('about')}
            onClick={this.onMenuClick.bind(this, 'about')}
          >
            <span>About us</span>
          </a>
        </li>
      </ul>
    );
  }

  render () {
    return (
      <header className='page__header' role='banner'>
        <h1 className='page__title'>OpenAQ</h1>

        <nav className='page__prime-nav nav' id='page-prime-nav'>
          <div className='nav__group nav__group--main'>
            <div className='inner'>
              <IndexLink
                to='/'
                title='Visit homepage'
                className='nav__home-link'
                onClick={this.onLinkNavigate}
              >
                <img
                  src='/assets/graphics/layout/oaq-logo-col-pos.svg'
                  alt='OpenAQ logotype'
                  width='72'
                  height='40'
                />
                <span>Home</span>
              </IndexLink>
              <Link
                to='/community'
                title='View page'
                className='nav__action-link'
                onClick={this.onLinkNavigate}
              >
                <span>Get involved</span>
              </Link>
              <Breakpoint>
                {({ largeUp }) =>
                  largeUp ? (
                    this.renderGlobalMenu()
                  ) : (
                    <a
                      href='#nav-group-global'
                      title='Jump to main menu'
                      className={c('nav__burguer-link', {
                        'nav__burguer-link--alt': this.state.openMobileMenu
                      })}
                      onClick={this.onMobileMenuClick}
                    >
                      <span>Jump to main menu</span>
                    </a>
                  )
                }
              </Breakpoint>
            </div>
          </div>

          <Breakpoint>
            {({ largeDown }) =>
              largeDown && (
                <div
                  className={c('nav__group nav__group--sub', {
                    'nav__group--active':
                      this.state.openMobileMenu && !this.state.openSubMenu
                  })}
                  id='nav-group-global'
                >
                  <div className='inner'>
                    <h3 className='nav__title visually-hidden'>Main</h3>
                    {this.renderGlobalMenu()}
                  </div>
                </div>
              )
            }
          </Breakpoint>

          {subMenus.map(group => (
            <div
              key={group.id}
              className={c('nav__group nav__group--sub', {
                'nav__group--active': this.state.openSubMenu === group.id
              })}
              id={`nav-group-${group.id}`}
            >
              <div className='inner'>
                <h3 className='nav__title nav__title--sub'>
                  <a
                    href='#nav-group-global'
                    title='Jump to main menu'
                    onClick={this.onMenuClick.bind(this, null)}
                  >
                    <span>{group.title}</span>
                  </a>
                </h3>
                <ul className='sub-menu'>
                  {group.items.map(item => (
                    <li key={item.title}>
                      <SmartLink
                        to={item.url}
                        title='View page'
                        className={c('sub-menu__link', item.className)}
                        onClick={this.onLinkNavigate}
                     >
                        <h5>{item.title}</h5>
                        {item.description && (<p>{item.description}</p>)}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

        </nav>
      </header>
    );
  }
}

PageHeader.propTypes = {
  routes: React.PropTypes.array
};

module.exports = PageHeader;
