import React from 'react';
import { PropTypes as T } from 'prop-types';

import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import ParameterSelector from './parameter-selector';
import MeasurementsChart from './measurements-chart';

export default function ValuesBreakdown({
  measurements,
  parameters,
  activeParam,
  onFilterSelect,
}) {
  const { fetched, fetching, error } = measurements;

  if (!fetched && !fetching) {
    return null;
  }

  let intro = null;
  let content = null;

  if (fetching) {
    intro = <LoadingMessage />;
  } else if (error) {
    intro = <p>We couldn't get any data.</p>;
    content = (
      <InfoMessage>
        <p>Please try again later.</p>
        <p>
          If you think there's a problem, please{' '}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            contact us.
          </a>
        </p>
      </InfoMessage>
    );
  } else {
    intro = (
      <ParameterSelector
        parameters={parameters}
        activeParam={activeParam}
        onFilterSelect={onFilterSelect}
      />
    );
    content = (
      <MeasurementsChart
        measurements={measurements}
        activeParam={activeParam}
      />
    );
  }

  return (
    <section className="fold">
      <div className="inner">
        <header className="fold__header">
          <h1 className="fold__title">Values breakdown</h1>
          <div className="fold__introduction">{intro}</div>
        </header>
        <div className="fold__body">{content}</div>
      </div>
    </section>
  );
}

ValuesBreakdown.propTypes = {
  parameters: T.array,

  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),

  activeParam: T.object,
  onFilterSelect: T.func,
};
