import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import { formatThousands } from '../../utils/format';
import Card, { CardDetails, FooterActions } from '../../components/card';

export default function ProjectCard({
  onDownloadClick,
  lastUpdate,
  name,
  subtitle,
  sourceType,
  collectionStart,
  totalLocations,
  totalMeasurements,
  parametersList,
}) {
  let updated = moment(lastUpdate).fromNow();
  let started = moment(collectionStart).format('YYYY/MM/DD');
  let ended = moment(lastUpdate).format('YYYY/MM/DD');

  return (
    <Card
      title={
        <>
          {name} <small>{subtitle}</small>
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
            { label: 'Locations', value: formatThousands(totalLocations) },
            {
              label: 'Measurements',
              value: formatThousands(totalMeasurements),
            },
            { label: 'Collection dates', value: `${started} - ${ended}` },
            { label: 'Measurands', value: parametersList.join(', ') },
          ]}
        />
      )}
      renderFooter={() => (
        <FooterActions
          what={name}
          onDownloadClick={onDownloadClick}
          viewMorePath={`/project/${encodeURIComponent(name)}`}
        />
      )}
    />
  );
}

ProjectCard.propTypes = {
  onDownloadClick: T.func,
  lastUpdate: T.string,
  name: T.string,
  subtitle: T.string,
  sourceType: T.oneOfType([T.array, T.string]),
  collectionStart: T.instanceOf(Date),
  totalLocations: T.number,
  totalMeasurements: T.number,
  parametersList: T.array,
};
