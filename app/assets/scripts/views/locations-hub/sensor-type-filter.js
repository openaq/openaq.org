import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'Styled-Components';
import c from 'classnames';

const Wrapper = styled.div`
  width: 20rem;
  display: grid;
  grid-gap: 1rem;
`;

const SectionWrapper = styled.div`
  border-bottom: 1px solid #ababab;
  display: grid;
  grid-gap: 0.5rem;
`;
const SectionTitle = styled.p`
  margin: 0;
`;
const SectionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  > button {
    border-radius: 0;
  }
  > button:first-child {
    border-radius: 2px 0 0 2px;
  }
  > button:last-child {
    border-radius: 0 2px 2px 0;
  }
`;

function Section(props) {
  const { title, options, selected, setSelected } = props;
  return (
    <SectionWrapper>
      <SectionTitle>{title}</SectionTitle>
      <SectionButtons>
        {options.map(v => (
          <button
            key={v}
            type="button"
            className={c('button', {
              'button--primary': v === selected,
              'button--base-bounded': v !== selected,
            })}
            onClick={e => {
              setSelected(v === selected ? null : v);
            }}
          >
            {v}
          </button>
        ))}
      </SectionButtons>
      {props.children}
    </SectionWrapper>
  );
}

Section.propTypes = {};

function SensorTypeFilter(props) {
  const { onApplyClick, manufacturers } = props;

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedMobility, setSelectedMobility] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  return (
    <Wrapper data-cy="filter-source-type">
      <Section
        data-cy="filter-menu-item"
        options={['Low-Cost Sensor', 'Reference']}
        selected={selectedGrade}
        setSelected={setSelectedGrade}
        title="Grade"
      >
        <select className="form__control form__control--medium select--base-bounded">
          {manufacturers.map(m => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
      </Section>

      <Section
        data-cy="filter-source-type"
        options={['Mobile', 'Stationary']}
        selected={selectedMobility}
        setSelected={setSelectedMobility}
        title="Mobility"
      />
      <Section
        data-cy="filter-source-type"
        options={['Community', 'Research', 'Government']}
        selected={selectedEntity}
        setSelected={setSelectedEntity}
        title="Selected Entity"
      />

      <button
        type="button"
        className={c('button', {
          'button--base': !(
            selectedGrade &&
            selectedMobility &&
            selectedEntity
          ),
          'button--primary':
            selectedGrade || selectedMobility || selectedEntity,
        })}
        onClick={() =>
          onApplyClick(selectedGrade, selectedMobility, selectedEntity)
        }
      >
        Apply
      </button>
    </Wrapper>
  );
}

SensorTypeFilter.propTypes = {
  onApplyClick: T.func,
};
export default SensorTypeFilter;
