import React from 'react';
import { PropTypes as T } from 'prop-types';
import ReactPaginate from 'react-paginate';

import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import ProjectCard from './project-card';

export default function Results({
  fetched,
  fetching,
  error,
  projects,
  totalPages,
  page,
  openDownloadModal,
  handlePageClick,
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

  return (
    <>
      <div className="inpage__results">
        {projects.map(project => {
          let openModal = () =>
            openDownloadModal({
              downloadType: 'projects',
              country: project.countries && project.countries[0],
              project: project.id,
            });
          return (
            <ProjectCard
              key={project.id}
              id={project.id}
              onDownloadClick={openModal}
              lastUpdated={project.lastUpdated}
              name={project.subtitle}
              sourceType={project.sourceType}
              sources={project.sources}
              firstUpdated={project.firstUpdated}
              totalLocations={project.locations}
              totalMeasurements={project.measurements}
              parametersList={project.parameters}
              isMobile={project.isMobile}
              isAnalysis={project.isAnalysis}
              sensorType={project.sensorType}
              entity={project.entity}
            />
          );
        })}
      </div>
      {!(!fetched || error || !projects.length) && (
        <ReactPaginate
          previousLabel={<span>previous</span>}
          nextLabel={<span>next</span>}
          breakLabel={<span className="pages__page">...</span>}
          pageCount={totalPages}
          forcePage={page - 1}
          marginPagesDisplayed={2}
          pageRangeDisplayed={4}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages'}
          pageClassName={'pages__wrapper'}
          pageLinkClassName={'pages__page'}
          activeClassName={'active'}
        />
      )}
    </>
  );
}

Results.propTypes = {
  fetched: T.bool,
  fetching: T.bool,
  error: T.bool,
  projects: T.array,
  totalPages: T.number,
  page: T.number,
  openDownloadModal: T.func,
  handlePageClick: T.func,
  history: T.object,
};
