'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { ScrollArea, Dropdown } from 'openaq-design-system';
import ReactPaginate from 'react-paginate';
import LocationCard from '../components/location-card';

var LocationsHub = React.createClass({
  displayName: 'LocationsHub',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Air Quality Data</h1>
              <div className='inpage__introduction'>
                <p>We’re currently collecting data in 20 different countries and continuously adding more. We aggregate PM2.5, PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and black carbon (BC). If you can’t find the location you’re looking for please suggest the source of send us an email.</p>
                <p><a href='#' className='button-inpage-download'>Download Daily Data - 2016/07/18 <small>(3MB)</small></a></p>
              </div>
            </div>
            <div className='inpage__actions'>
              <a href='' className='button-inpage-api'>API</a>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner full-flex'>

            <aside className='inpage__aside'>
              <h2 className='content-prime-title'>Filter Locations</h2>

              <div className='filters filters--country'>
                <h3 className='filters__title'>Countries</h3>

                  <ScrollArea
                    speed={0.8}
                    className='filters__group'
                    contentClassName='filters__group-inner'
                    smoothScrolling={true}
                    horizontal={false} >

                    {[0, 0, 0, 0, 0, 0, 0].map(o => {
                      return (
                        <label className='form__option form__option--custom-checkbox'>
                          <input type='checkbox' value='Checkbox 1' id='form-checkbox-1' name='form-checkbox' />
                          <span className='form__option__text'>Checkbox 1</span>
                          <span className='form__option__ui'></span>
                        </label>
                      );
                    })}
                  </ScrollArea>

              </div>

              <div className='filters filters--values'>
                <h3 className='filters__title'>Values</h3>
                <div className='filters__group'>

                  <ScrollArea
                    speed={0.8}
                    className='filters__group'
                    contentClassName='filters__group-inner'
                    smoothScrolling={true}
                    horizontal={false} >

                    {['PM2.5', 'PM10', 'O3', 'SO2', 'NO2', 'CO', 'BC'].map(o => {
                      return (
                        <label className='form__option form__option--custom-checkbox'>
                          <input type='checkbox' value='Checkbox 1' id='form-checkbox-1' name='form-checkbox' />
                          <span className='form__option__text'>{o}</span>
                          <span className='form__option__ui'></span>
                        </label>
                      );
                    })}
                  </ScrollArea>
                </div>
              </div>
            </aside>

            <div className='inpage__content'>
              <div className='content__meta'>
                <div className='filters-summary'>
                  <h3 className='filters-summary-title'>Filters <a href='' title='Clear all selected filters'><small>(Clear All)</small></a></h3>
                  <button type='button' className='button--filter-pill'><span>Australia</span></button>
                  <button type='button' className='button--filter-pill'><span>PM2.5</span></button>
                  <button type='button' className='button--filter-pill'><span>O3</span></button>
                </div>

                <div className='content__actions'>
                  <h3>Sort By</h3>
                  <Dropdown
                    triggerElement='a'
                    triggerClassName='button button--primary-bounded drop__toggle--caret'
                    triggerTitle='Show/hide sort options'
                    triggerText='Recently Updated' >

                    <ul role='menu' className='drop__menu drop__menu--select'>
                      <li><a className='drop__menu-item drop__menu-item--active' title='This is Item 1b' href='#'>Recenty Updated</a></li>
                      <li><a className='drop__menu-item' title='This is Item 2b' href='#'>Name</a></li>
                      <li><a className='drop__menu-item' title='This is Item 3b' href='#'>Measurements</a></li>
                    </ul>
                  </Dropdown>
                </div>

                <div className='content__heading'>
                  <h2 className='content-prime-title'>Results <small>Showing <strong>1235</strong> locations</small></h2>
                </div>
              </div>

              <div className='inpage__results'>
                <LocationCard />
                <LocationCard />
                <LocationCard />
                <LocationCard />
                <LocationCard />
              </div>

              <ReactPaginate
                previousLabel={<span>previous</span>}
                nextLabel={<span>next</span>}
                breakLabel={<span className='pages__page'>...</span>}
                pageNum={15}
                forceSelected={3 - 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                clickCallback={this.handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages'}
                pageClassName={'pages__wrapper'}
                pageLinkClassName={'pages__page'}
                activeClassName={'active'} />

              <div className='disclaimers'>
                <p>Data are from official, stationary government monitors and not smaller-scale or mobile monitors. It is our intent to attribute all data to their originating sources. Please contact us if you notice otherwise. </p>
                <p>Note: We do not guarantee the accuracy of any data aggregated to the platform.  Please see originating sites for more information.</p>
              </div>
            </div>
          </div>
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

module.exports = connect(selector, dispatcher)(LocationsHub);
