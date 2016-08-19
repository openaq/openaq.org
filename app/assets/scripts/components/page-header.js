'use strict';
import React from 'react';
import { IndexLink, Link } from 'react-router';
import c from 'classnames';
import _ from 'lodash';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    routes: React.PropTypes.array
  },

  getInitialState: function () {
    return {
      dataMenu: false
    };
  },

  documentListener: function (e) {
    if (e.preventClose !== true && this.state.dataMenu) {
      this.setState({dataMenu: false});
    }
  },

  dataMenuClick: function (e) {
    e.preventDefault();
    this.setState({dataMenu: !this.state.dataMenu});
  },

  dataMenuItemClick: function (e) {
    this.setState({dataMenu: false});
    document.documentElement.classList.remove('offcanvas-revealed');
  },

  onRootMenuClick: function (e) {
    document.documentElement.classList.remove('offcanvas-revealed');
  },

  offcanvasMenuClick: function (e) {
    e.preventDefault();
    document.documentElement.classList.toggle('offcanvas-revealed');
  },

  onNavDataClick: function (e) {
    // When clicking a nav block, add a property to the event indicating that
    // the block shouldn't be toggled on body click.
    e.preventClose = true;
  },

  componentDidMount: function () {
    document.addEventListener('click', this.documentListener);
    this.refs.navData.addEventListener('click', this.onNavDataClick);
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.documentListener);
    this.refs.navData.removeEventListener('click', this.onNavDataClick);
  },

  render: function () {
    let pageName = _.get(_.last(this.props.routes), 'name', '');
    let activeData = [
      'countriesHub', 'country',
      'locationsHub', 'location'
    ].indexOf(pageName) !== -1;

    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <h1 className='page__title'><a href='/' title='Visit homepage'>OpenAQ</a></h1>
          </div>
          <nav className='page__prime-nav'>
            <h2 className='page__prime-nav-title'><a href='#nav-block-browse' onClick={this.offcanvasMenuClick}><span>Menu</span></a></h2>
            <div className='nav-block' id='nav-block-browse'>
              <ul className='browse-menu'>
                <li><IndexLink to='/' title='Go to OpenAQ homepage' className='browse-menu__item' activeClassName='browse-menu__item--active' onClick={this.onRootMenuClick}><span>Home</span></IndexLink></li>

                <li className={c('sub-nav-block-wrapper', {'sub-revealed': this.state.dataMenu})} ref='navData'>
                  <a href='#' title='Show data sections' className={c('browse-menu__item', {'browse-menu__item--active': activeData})} onClick={this.dataMenuClick}><span>Data</span></a>
                  <div className='sub-nav-block' id='sub-nav-block-data'>
                    <ul className='browse-menu browse-menu--sub'>
                      <li><Link to='/map' title='Visit Map page' className='browse-menu__item' activeClassName='browse-menu__item--active' onClick={this.dataMenuItemClick}><span>Map</span></Link></li>
                      <li><Link to='/locations' title='Visit locations page' className='browse-menu__item' activeClassName='browse-menu__item--active' onClick={this.dataMenuItemClick}><span>Locations</span></Link></li>
                      <li><Link to='/countries' title='Visit Countries page' className='browse-menu__item' activeClassName='browse-menu__item--active' onClick={this.dataMenuItemClick}><span>Countries</span></Link></li>
                    </ul>
                  </div>
                </li>

                <li><Link to='/community' title='Visit community page' className='browse-menu__item' activeClassName='browse-menu__item--active' onClick={this.onRootMenuClick}><span>Community</span></Link></li>
                <li><a href='https://medium.com/@openaq' title='Visit OpenAQ blog on medium' className='browse-menu__item' target='_blank' onClick={this.onRootMenuClick}><span>Blog</span></a></li>
                <li><Link to='/about' title='Visit about page' className='browse-menu__item' activeClassName='browse-menu__item--active' onClick={this.onRootMenuClick}><span>About</span></Link></li>

              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
