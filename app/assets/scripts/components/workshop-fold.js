'use strict';
import React from 'react';
import { Link } from 'react-router';

var WorkshopFold = React.createClass({
  displayName: 'WorkshopFold',

  render: function () {
    return (
      <section className='workshop-fold'>
        <div className='inner'>
          <header className='workshop-fold__header'>
            <h1 className='workshop-fold__title'>Hold a Workshop</h1>
            <div className='prose prose--responsive'>
              <p>Interested in convening various members of your community around open air quality data? We can help!</p>
              <p><Link to='/community' className='workshop-go-button' title='Learn more'><span>Learn how</span></Link></p>
            </div>
          </header>

          <figure className='workshop-fold__media'>
            <img src='/assets/graphics/content/view--community-workshops/workshop-fold-media.jpg' alt='Cover image' width='830' height='830' />
          </figure>
        </div>
      </section>
    );
  }
});

module.exports = WorkshopFold;
