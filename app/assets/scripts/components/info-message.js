import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function InfoMessage({ standardMessage, children }) {
  return (
    <div className="info-msg">
      <div className="info-msg__contents">
        {standardMessage && (
          <>
            <h2>Uhoh, something went wrong.</h2>
            <p>
              There was a problem getting the data. If you continue to have
              problems, please let us know.
            </p>
            <a href="mailto:info@openaq.org" title="Send us an email">
              Send us an Email
            </a>
          </>
        )}
        {children}
      </div>
    </div>
  );
}

InfoMessage.propTypes = {
  standardMessage: T.bool,
  children: T.array,
};
