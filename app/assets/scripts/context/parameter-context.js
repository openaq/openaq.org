import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import config from '../config';

const defaultState = {
  fetchedParams: false,
  fetchingParams: false,
  paramError: null,
  parameters: null,
};

export const ParameterContext = React.createContext([{}, () => {}]);

export function ParameterProvider(props) {
  const [
    { fetchedParams, fetchingParams, paramError, parameters },
    setState,
  ] = useState(defaultState);
  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetchingParams: true, paramError: null }));

      fetch(`${config.api}/parameters`)
        .then(response => {
          if (response.status >= 400) {
            throw new paramError('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            setState(state => ({
              ...state,
              fetchedParams: true,
              fetchingParams: false,
              parameters: json.results,
            }));
          },
          e => {
            console.log('e', e);
            setState(state => ({
              ...state,
              fetchedParams: true,
              fetchingParams: false,
              paramError: e,
            }));
          }
        );
    };

    fetchData();

    return () => {
      setState(defaultState);
    };
  }, []);
  return (
    <ParameterContext.Provider
      value={{ fetchedParams, fetchingParams, paramError, parameters }}
    >
      {props.children}
    </ParameterContext.Provider>
  );
}
ParameterProvider.propTypes = {
  children: PropTypes.node,
};
