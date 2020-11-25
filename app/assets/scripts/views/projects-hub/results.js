import React from 'react';
import { PropTypes as T } from 'prop-types';

import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import ProjectCard from './project-card';

export default function Results({
  fetched,
  fetching,
  error,
  projects,
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

  return projects.map(project => {
    let openModal = () =>
      openDownloadModal({
        project: project,
      });
    return (
      <ProjectCard
        key={project.projectId}
        id={project.projectId}
        onDownloadClick={openModal}
        lastUpdate={project.lastUpdated}
        name={project.projectName}
        subtitle={project.subtitle}
        sourceType={project.sourceType}
        collectionStart={project.collectionStart}
        totalLocations={project.locations}
        totalMeasurements={project.count}
        parametersList={project.parameters}
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
