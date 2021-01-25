import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import LocationCard from '../locations-hub/location-card';

export default function Results({
  fetched,
  fetching,
  error,
  locationGroups,
  id,
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

  if (!Object.values(locationGroups).length) {
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
      <div className="countries-list">
        {Object.entries(locationGroups).map(([city, cityLocations]) => (
          <section
            className="fold fold--locations"
            key={city}
            data-cy="country-list"
          >
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">
                  {city}{' '}
                  <small>
                    {cityLocations.length}{' '}
                    {cityLocations.length > 1 ? 'locations' : 'location'}
                  </small>
                </h1>
                <p className="fold__main-action">
                  <a
                    href="#"
                    className="location-download-button"
                    title={`Download ${city} data`}
                    onClick={() =>
                      openDownloadModal({
                        country: id,
                        area: city,
                      })
                    }
                  >
                    Download
                  </a>
                </p>
              </header>
              <div className="inpage__results">
                {cityLocations.map(loc => {
                  let openModal = () =>
                    openDownloadModal({
                      country: loc.country,
                      area: loc.city,
                      location: loc.id,
                    });
                  return (
                    <LocationCard
                      mobile={loc.isMobile}
                      key={loc.id}
                      city={loc.city}
                      country={loc.country}
                      firstUpdated={loc.firstUpdated}
                      id={loc.id}
                      lastUpdated={loc.lastUpdated}
                      name={loc.name}
                      onDownloadClick={openModal}
                      parametersList={loc.parameters}
                      sources={loc.sources}
                      sourceType={loc.sourceType}
                      totalMeasurements={loc.measurements}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
      {!(!fetched || error || !Object.values(locationGroups).length) && (
        <ReactPaginate
          previousLabel={<span>previous</span>}
          nextLabel={<span>next</span>}
          breakLabel={<span className="pages__page">...</span>}
          pageCount={totalPages}
          forcePage={page - 1}
          marginPagesDisplayed={4}
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
  fetched: PropTypes.bool,
  fetching: PropTypes.bool,
  error: PropTypes.bool,
  locationGroups: PropTypes.object,
  id: PropTypes.string,
  totalPages: PropTypes.number,
  page: PropTypes.number,
  openDownloadModal: PropTypes.func,
  handlePageClick: PropTypes.func,
  history: PropTypes.object,
};
