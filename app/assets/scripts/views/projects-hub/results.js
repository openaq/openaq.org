import React from 'react';
import { PropTypes as T } from 'prop-types';

import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import ProjectCard from './project-card';

const defaultProject = {
  id: 1,
  onDownloadClick: '',
  lastUpdate: '',
  name: 'Dataset name',
  organization: 'Organization name',
  sourceType: 'mobile',
  collectionStart: new Date(2019, 9, 1),
  records: 181829,
  count: 97933,
  parameters: ['co', 'no2', 'o3'],
};

export default function Results({
  fetched,
  fetching,
  error,
  projects, // = [defaultProject],
  openDownloadModal,
}) {
  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingMessage />;
  }

  if (error) {
    return (
      <InfoMessage>
        <p>We coudn&apos;t get the data. Please try again later.</p>
        <p>
          If you think there&apos;s a problem, please{' '}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            contact us.
          </a>
        </p>
      </InfoMessage>
    );
  }

  if (!projects.length) {
    return (
      <InfoMessage>
        <p>No data was found for your criteria.</p>
        <p>
          Maybe you&apos;d like to suggest a{' '}
          <a
            href="https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform"
            title="Suggest a new source"
          >
            new source
          </a>{' '}
          or{' '}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            let us know
          </a>{' '}
          what location you&apos;d like to see data for.
        </p>
      </InfoMessage>
    );
  }

  return projects.map(o => {
    let openModal = () =>
      openDownloadModal({
        project: o.project,
      });
    return (
      <ProjectCard
        key={o.id}
        onDownloadClick={openModal}
        lastUpdate={o.lastUpdated}
        name={o.name}
        organization={o.organization}
        sourceType={o.sourceType}
        collectionStart={o.collectionStart}
        totalRecords={o.records}
        totalMeasurements={o.count}
        parametersList={o.parameters}
      />
    );
  });
}

Results.propTypes = {
  fetched: T.bool,
  fetching: T.bool,
  error: T.bool,
  project: T.array,
  openDownloadModal: T.func,
};
