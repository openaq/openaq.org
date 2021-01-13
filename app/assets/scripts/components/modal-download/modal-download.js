'use strict';
import React, { useEffect, useMemo, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';
import moment from 'moment';
import { stringify as buildAPIQS } from 'qs';
import OpenAQ from 'openaq-design-system';
const { Modal, ModalHeader, ModalBody } = OpenAQ.Modal;

import { toggleValue } from '../../utils/array';
import {
  fetchLocationsByCountry,
  invalidateLocationsByCountry,
} from '../../actions/action-creators';
import config from '../../config';
import { formatThousands } from '../../utils/format';

import LocationSelector from './location-selector';
import DateSelector from './date-selector';

const EMPTY = '--';

const computeApiUrl = (values, initalQS = {}) => {
  let state = _.clone(values);
  _.forEach(state, (o, i) => {
    if (o === null || o === '--' || !o.length) {
      delete state[i];
    }
  });

  if (state.startYear && state.startMonth && state.startDay) {
    let sDate = moment(
      `${state.startYear}/${parseInt(state.startMonth) + 1}/${state.startDay}`,
      'YYYY/M/D'
    );
    if (sDate.isValid()) {
      state.sDate = sDate.toISOString();
    }
  }

  if (state.endYear && state.endMonth && state.endDay) {
    let eDate = moment(
      `${state.endYear}/${parseInt(state.endMonth) + 1}/${state.endDay}`,
      'YYYY/M/D'
    );
    if (eDate.isValid()) {
      state.eDate = eDate.toISOString();
    }
  }

  // Build url.
  let qs = initalQS;

  // It's enough to have one of these.
  if (state.locLocation) {
    qs.location = state.locLocation;
  } else if (state.locArea) {
    qs.city = state.locArea;
  } else if (state.locCountry) {
    qs.country = state.locCountry;
  }

  if (state.sDate) {
    qs.date_from = state.sDate;
  }

  if (state.eDate) {
    qs.date_to = state.eDate;
  }

  if (state.parameters) {
    qs.parameter = state.parameters;
  }

  qs = `${config.api}/measurements?${buildAPIQS(qs)}`;

  return qs;
};

function ModalDownload(props) {
  console.log(
    '🚀 ~ file: modal-download.js ~ line 26 ~ ModalDownload ~ props',
    props
  );
  const {
    countries,
    revealed,
    onModalClose,
    locationsByCountry,
    country,
    area,
    location,
    parameters,
    _invalidateLocationsByCountry,
    _fetchLocationsByCountry,
  } = props;

  const [formState, setFormState] = useState({
    locCountry: EMPTY,
    locArea: EMPTY,
    locLocation: EMPTY,
    startYear: EMPTY,
    startMonth: EMPTY,
    startDay: EMPTY,
    endYear: EMPTY,
    endMonth: EMPTY,
    endDay: EMPTY,
    parameters: [],
  });

  useEffect(() => {
    setFormState(s => ({
      ...s,
      locCountry: country || EMPTY,
      locArea: area || EMPTY,
      locLocation: location || EMPTY,
    }));
  }, [country, area, location]);

  useEffect(() => {
    if (country) {
      _invalidateLocationsByCountry();
      _fetchLocationsByCountry(country);
    }
  }, [country]);

  const onOptSelect = (key, e) => {
    let newState = {
      ...formState,
      [key]: e.target.value,
    };

    if (key === 'locCountry') {
      _invalidateLocationsByCountry();
      _fetchLocationsByCountry(e.target.value);
      newState.locArea = EMPTY;
      newState.locLocation = EMPTY;
    } else if (key === 'locArea') {
      newState.locLocation = EMPTY;
    }
    setFormState(newState);
  };

  const onParameterSelect = value => {
    setFormState(s => ({ ...s, parameters: toggleValue(s.parameters, value) }));
  };

  const measurementsCount = (countries || []).reduce(
    (p, c) => p + Number(c.count),
    0
  );

  const [coreParam, additionalParam] = useMemo(
    () => _.partition(parameters, p => p.isCore),
    [parameters]
  );

  return (
    <Modal
      id="modal-download"
      className="modal--medium"
      onCloseClick={onModalClose}
      revealed={revealed}
    >
      <ModalHeader>
        <div className="modal__headline">
          <h1 className="modal__title">Data Download</h1>
        </div>
      </ModalHeader>
      <ModalBody>
        {countries && (
          <div className="prose">
            <p className="modal__description">
              Customize the data you want to download. Currently, the last two
              years of data are available from this form.{' '}
              <a
                href="https://openaq-fetches.s3.amazonaws.com/index.html"
                target="_blank"
                rel="noreferrer"
              >
                Realtime
              </a>{' '}
              and{' '}
              <a
                href="http://openaq-data.s3.amazonaws.com/index.html"
                target="_blank"
                rel="noreferrer"
              >
                daily
              </a>{' '}
              archives of all {formatThousands(measurementsCount)} are also
              available.{' '}
              <a
                // eslint-disable-next-line inclusive-language/use-inclusive-words
                href="https://github.com/openaq/openaq-info/blob/master/FAQ.md#90days"
                target="_blank"
                rel="noreferrer"
              >
                More Info
              </a>{' '}
            </p>

            <form className="form form--download">
              <LocationSelector
                countries={countries}
                fetching={locationsByCountry.fetching}
                fetched={locationsByCountry.fetched}
                locations={locationsByCountry.data.results}
                locCountry={formState.locCountry}
                locArea={formState.locArea}
                locLocation={formState.locLocation}
                onOptSelect={onOptSelect}
              />
              <DateSelector
                type="start"
                onOptSelect={onOptSelect}
                dateState={formState}
              />
              <DateSelector
                type="end"
                onOptSelect={onOptSelect}
                dateState={formState}
              />
              <Parameters
                title="Core parameters"
                list={coreParam}
                selected={formState.parameters}
                onSelect={onParameterSelect}
              />
              <Parameters
                title="Additional parameters"
                list={additionalParam}
                selected={formState.parameters}
                onSelect={onParameterSelect}
              />
              {/*
            {this.renderResultCountMessage()} */}

              <div className="form__actions">
                <button
                  type="button"
                  className="button button--primary-bounded"
                  onClick={onModalClose}
                >
                  Cancel
                </button>
                <a
                  href={computeApiUrl(formState, { format: 'csv' })}
                  className={c('button-modal-download', { disabled: false })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Selection <small>(csv)</small>
                </a>
              </div>
            </form>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

ModalDownload.propTypes = {
  _fetchLocationsByCountry: T.func,
  _invalidateLocationsByCountry: T.func,
  onModalClose: T.func,
  revealed: T.bool,

  countries: T.array,
  parameters: T.array,

  locationsByCountry: T.object,

  // Preselect
  country: T.string,
  area: T.string,
  location: T.string,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    countries: state.baseData.data.countries,
    parameters: state.baseData.data.parameters,

    locationsByCountry: state.locationsByCountry,
  };
}

function dispatcher(dispatch) {
  return {
    _invalidateLocationsByCountry: (...args) =>
      dispatch(invalidateLocationsByCountry(...args)),
    _fetchLocationsByCountry: (...args) =>
      dispatch(fetchLocationsByCountry(...args)),
  };
}

module.exports = connect(selector, dispatcher)(ModalDownload);

function Parameters(props) {
  const { title, list, selected, onSelect } = props;

  return (
    <fieldset className="form__fieldset form__fieldset--parameters">
      <legend className="form__legend">{title}</legend>
      <div className="form__option-group">
        {list.map(o => {
          const checked = selected.indexOf(o.id) !== -1;
          const onChange = onSelect.bind(null, o.id);
          return (
            <label
              className="form__option form__option--custom-checkbox"
              htmlFor={o.id}
              key={o.id}
            >
              <input
                type="checkbox"
                value={o.id}
                id={o.id}
                name="form-checkbox"
                onChange={onChange}
                checked={checked}
              />
              <span className="form__option__text">{o.displayName}</span>
              <span className="form__option__ui"></span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

Parameters.propTypes = {
  title: T.string,
  list: T.array,
  selected: T.array,
  onSelect: T.func,
};
