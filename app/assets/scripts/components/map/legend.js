import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'openaq-design-system';
import c from 'classnames';
import styled from 'styled-components';

import { generateLegendStops } from '../../utils/colors';

const Wrapper = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 20;
  max-width: 24rem;
  overflow: hidden;

  box-shadow: 0 0 32px 2px rgba(35, 47, 59, 0.04),
    0 16px 48px -16px rgba(35, 47, 59, 0.12);
  background-color: rgba(35, 47, 59, 0.04);

  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media only screen and (min-width: 768px) {
    bottom: 2rem;
    left: 2rem;
  }
`;

const Container = styled.div`
  padding: 1.5rem;
  background: #fff;
`;

const Definition = styled.dl`
  margin: 0;
  & > dd {
    margin: 0;
  }
  display: grid;
  grid-template-columns: 15px auto;
  gap: 0.75rem;
  align-items: center;
  text-transform: uppercase;
`;

const Square = styled.div`
  width: 15px;
  height: 15px;
  background-color: #198cff;
`;

const Circle = styled(Square)`
  border-radius: 50%;
`;

export default function Legend({
  parameters,
  activeParameter,
  onParamSelection,
}) {
  function onFilterSelect(parameter, e) {
    e.preventDefault();
    onParamSelection(parameter);
  }
  let drop = (
    <Dropdown
      triggerElement="button"
      triggerClassName="button button--primary-unbounded drop__toggle--caret"
      triggerTitle="Show/hide parameter options"
      triggerText={activeParameter.displayName}
    >
      <ul
        role="menu"
        className="drop__menu drop__menu--select"
        style={{ overflowY: `scroll`, maxHeight: `15rem` }}
      >
        {parameters.map(param => (
          <li key={`${param.parameterId || param.id}`}>
            <a
              className={c('drop__menu-item', {
                'drop__menu-item--active': activeParameter.id === param.id,
              })}
              href="#"
              title={`Show values for ${param.displayName}`}
              data-hook="dropdown:close"
              onClick={e => onFilterSelect(param.parameterId || param.id, e)}
            >
              <span>{param.displayName}</span>
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  );

  const scaleStops = generateLegendStops(
    activeParameter.parameterId || activeParameter.id
  );
  const colorWidth = 100 / scaleStops.length;

  return (
    <Wrapper>
      <Container>
        <Definition>
          <dt>
            <Circle />
          </dt>
          <dd>Reference grade sensor</dd>

          <dt>
            <Square />
          </dt>
          <dd>Low Cost Sensor</dd>
        </Definition>
      </Container>
      <Container>
        <p>
          Showing the most recent* values for{' '}
          {parameters.length > 1 ? drop : activeParameter.displayName}
        </p>
        <ul className="color-scale">
          {scaleStops.map(o => (
            <li
              key={o.label}
              style={{ backgroundColor: o.color, width: `${colorWidth}%` }}
              className="color-scale__item"
            >
              <span className="color-scale__value">{o.label}</span>
            </li>
          ))}
        </ul>
        <p>* Locations not updated in the last week are shown in grey.</p>
        <small className="disclaimer">
          <a href="https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85">
            Data Disclaimer and More Information
          </a>
        </small>
      </Container>
    </Wrapper>
  );
}

Legend.propTypes = {
  parameters: PropTypes.array.isRequired,
  activeParameter: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    name: PropTypes.string,
    id: PropTypes.number,
    parameterId: PropTypes.number.isRequired,
  }).isRequired,
  onParamSelection: PropTypes.func,
};
