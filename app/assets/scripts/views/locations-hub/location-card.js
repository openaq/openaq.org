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
  country,
  sources,
}) {
  let updated = moment(lastUpdated).fromNow();
  let started = moment(firstUpdated).format('YYYY/MM/DD');

  return (
    <Card
      title={
        <>
          {name} <small>{subtitle}</small>
          <small>
            in {city}, {country}
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
            {
              label: 'Sources',
              value: (
                <a
                  href={sources.sourceURL}
                  title={`View source for ${name}`}
                  key={sources.name}
                >
                  {sources.name}
                </a>
              ),
            },
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
  id: T.string,
  city: T.string,
  country: T.object,
  sources: T.array,
  lastUpdate: T.string,
  collectionStart: T.string,
};
