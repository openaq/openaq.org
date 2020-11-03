import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import { schemas } from 'openaq-data-format';

import config from '../../config';

const locationSchema = schemas.location;

export default function Metadata ({ loc, loc: { data: { metadata } } }) {
  if (!metadata) return null;

  const exclude = [
    'id',
    'coordinates',
    'city',
    'country',
    'instruments',
    'parameters',
    'attribution'
  ];

  const allProperties = Object.keys(locationSchema.properties)
      .filter((key) => {
        return !exclude.includes(key) && metadata[key];
      });

  const propertiesMain = [];
  const propertiesSec = [];
  const length = Math.ceil(allProperties.length / 2);

  allProperties.forEach((key, i) => {
    const prop = locationSchema.properties[key];
    prop.key = key;
    let val = metadata[prop.key];

    if (prop.format && prop.format === 'date-time') {
      val = moment.utc(val).format('YYYY/MM/DD');
    }
    if (prop.type && prop.type === 'boolean') {
      val = val ? 'Yes' : 'No';
    }

    const sectionIndex = Math.floor(i / length);

    switch (sectionIndex) {
      case 0: {
        propertiesMain.push(<dt key={`${key}-${prop.title}`} className='metadata-detail-title'>{prop.title}</dt>);
        propertiesMain.push(<dd key={`${key}-${prop.title}-val`}>{val}</dd>);
        break;
      }
      case 1: {
        propertiesSec.push(<dt key={`${key}-${prop.title}`} className='metadata-detail-title'>{prop.title}</dt>);
        propertiesSec.push(<dd key={`${key}-${prop.title}-val`}>{val}</dd>);
        break;
      }
    }
  });

  return (
      <section className='fold' id='location-fold-metadata'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Metadata</h1>
          </header>
          <div className='fold__body'>
            <div className='col-main'>
              <dl className='global-details-list'>
                {propertiesMain}
              </dl>
            </div>
            <div className='col-sec'>
              <dl className='global-details-list'>
                {propertiesSec}
              </dl>
            </div>
          </div>
          <div className='update-metadata-callout'>
            <p>
              Have more information about this location? <a href={`${config.metadata}/location/${loc.data.id}`} title="Update the metadata">Update the metadata</a>
            </p>
          </div>
        </div>
      </section>
  );
}

Metadata.propTypes = {
  loc: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object
  })
};
