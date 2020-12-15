import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import { formatThousands } from '../../utils/format';
import Card, { CardDetails, FooterActions } from '../../components/card';

export default function ProjectCard({
  onDownloadClick,
  lastUpdated,
  id,
  name,
  subtitle,
  sourceType,
  firstUpdated,
  totalLocations,
  totalMeasurements,
  parametersList,
}) {
  let updated = moment(lastUpdated).fromNow();
  let started = moment(firstUpdated).format('YYYY/MM/DD');
  let ended = moment(lastUpdated).format('YYYY/MM/DD');

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
            {
              label: 'Measurands',
              value: parametersList
                .map(p => p.measurand.toUpperCase())
                .join(', '),
            },
          ]}
        />
      )}
      renderFooter={() => (
        <FooterActions
          what={name}
          onDownloadClick={onDownloadClick}
          viewMorePath={`/project/${encodeURIComponent(id)}`}
        />
      )}
    />
  );
}

ProjectCard.propTypes = {
  onDownloadClick: T.func,
  lastUpdated: T.string,
  name: T.string,
  id: T.oneOfType([T.string, T.number]),
  subtitle: T.string,
  sourceType: T.oneOfType([T.array, T.string]),
  firstUpdated: T.string,
  totalLocations: T.number,
  totalMeasurements: T.number,
  parametersList: T.array,
};
