import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import { formatThousands } from '../../utils/format';
import Card, { CardDetails, FooterActions } from '../../components/card';

export default function LocationCard({
  onDownloadClick,
  lastUpdated,
  name,
  subtitle,
  sourceType,
  firstUpdated,
  totalMeasurements,
  parametersList,
  id,
  city,
  countryData,
  sourcesData,
}) {
  let updated = moment(lastUpdated).fromNow();
  let started = moment(firstUpdated).format('YYYY/MM/DD');

  const country = countryData || {};
  let sources = [];
  if (sourcesData.length) {
    sourcesData.forEach((o, i) => {
      sources.push(
        <a href={o.sourceURL} title={`View source for  ${name}`} key={o.name}>
          {o.name}
        </a>
      );
      if (i < sourcesData.length - 1) {
        sources.push(', ');
      }
    });
  }

  return (
    <Card
      title={
        <>
          {name} <small>{subtitle}</small>
          <small>
            in {city}, {country.name}
          </small>
        </>
      }
      subtitle={
        <>
          Updated <strong>{updated}</strong>
        </>
      }
      tags={sourceType}
      renderBody={() => (
        <CardDetails
          list={[
            { label: 'Collection started', value: started },
            {
              label: 'Measurements',
              value: formatThousands(totalMeasurements),
            },
            {
              label: 'Values',
              value: parametersList.map(p => p.measurand).join(', '),
            },
            ...(sources.length ? [{ label: 'Sources', value: sources }] : []),
          ]}
        />
      )}
      renderFooter={() => (
        <FooterActions
          what={name}
          onDownloadClick={onDownloadClick}
          viewMorePath={`/location/${encodeURIComponent(id)}`}
        />
      )}
    />
  );
}

LocationCard.propTypes = {
  onDownloadClick: T.func,
  lastUpdated: T.string,
  name: T.string,
  subtitle: T.string,
  sourceType: T.oneOfType([T.array, T.string]),
  firstUpdated: T.string,
  totalLocations: T.number,
  totalMeasurements: T.number,
  parametersList: T.array,

  compact: T.bool,
  id: T.oneOfType([T.number, T.string]),
  city: T.string,
  countryData: T.object,
  sourcesData: T.array,
  lastUpdate: T.string,
  collectionStart: T.string,
};
