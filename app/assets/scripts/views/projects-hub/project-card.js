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
  firstUpdated,
  totalLocations,
  totalMeasurements,
  parametersList,
  sources,
  sensorType,
  entity,
  isMobile,
  isAnalysis,
}) {
  let updated = moment(lastUpdated).fromNow();
  let started = moment(firstUpdated).format('YYYY/MM/DD');
  let ended = moment(lastUpdated).format('YYYY/MM/DD');

  return (
    <Card
      id="project"
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
      tags={[
        sensorType,
        entity,
        isMobile ? 'Mobile' : 'Stationary',
        isAnalysis && 'Analysis',
      ]}
      renderBody={() => (
        <CardDetails
          id="project"
          list={[
            { label: 'Collection dates', value: `${started} - ${ended}` },
            { label: 'Locations', value: formatThousands(totalLocations) },
            {
              label: 'Measurements',
              value: formatThousands(totalMeasurements),
            },
            {
              label: 'Parameters',
              value: parametersList.map(p => p.displayName).join(', '),
            },
            {
              label: sources.length > 1 ? 'Sources' : 'Source',
              value: sources?.map(source => [
                <a
                  href={source.url}
                  title={`View source for ${name}`}
                  key={source.organization}
                  className={!source.url && 'disabled'}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {source.organization || source.name}
                </a>,
              ]),
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
  sensorType: T.string,
  entity: T.string,
  isMobile: T.bool,
  sources: T.array,
  firstUpdated: T.string,
  totalLocations: T.number,
  totalMeasurements: T.number,
  parametersList: T.array,
  isAnalysis: T.bool,
};
