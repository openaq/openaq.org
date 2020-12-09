import React from 'react';
import { PropTypes as T } from 'prop-types';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';

import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import LocationCard from './location-card';

export default function Results({
  fetched,
  fetching,
  error,
  locations,
  countries,
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

  if (!locations.length) {
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
        {locations.map(loc => {
          let countryData = _.find(countries, { code: loc.country });
          let sourcesData = [loc.sources];

          let openModal = () =>
            openDownloadModal({
              country: loc.country,
              area: loc.city,
              location: loc.location,
            });
          return (
            <LocationCard
              id={loc.id}
              onDownloadClick={openModal}
              key={loc.id}
              name={loc.name}
              city={loc.city}
              sourceType={loc.sourceType}
              countryData={countryData}
              sourcesData={sourcesData}
              totalMeasurements={loc.measurements}
              parametersList={loc.parameters}
              lastUpdate={loc.lastUpdated}
              collectionStart={loc.firstUpdated}
            />
          );
        })}
      </div>
      {!(!fetched || error || !locations.length) && (
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
  locations: T.array,
  countries: T.array,
  sources: T.array,
  parameters: T.array,
  totalPages: T.number,
  page: T.number,
  openDownloadModal: T.func,
  handlePageClick: T.func,
  history: T.object,
};
