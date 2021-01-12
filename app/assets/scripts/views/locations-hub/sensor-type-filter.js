import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'Styled-Components';
import c from 'classnames';

const Wrapper = styled.div`
  width: 20rem;
`;

const SectionWrapper = styled.div`
  border-bottom: 1px solid #ababab;
`;
const SectionTitle = styled.p``;
const SectionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  > button {
    border-radius: 0;
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
              'button--primary-ghost': v !== selected,
            })}
            onClick={(e) => {
              setSelected(v === selected ? null : v)
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

Section.propTypes = {
};

function SensorTypeFilter(props) {
  const { onApplyClick } = props;

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedMobility, setSelectedMobility] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  return (
    <Wrapper>
      <Section
        options={['Low Cost Sensor', 'Reference-Grade']}
        selected={selectedGrade}
        setSelected={setSelectedGrade}
        title="Grade"
      >
        <select>
          <option>option</option>
        </select>
      </Section>

      <Section
        options={['Mobile', 'Stationary']}
        selected={selectedMobility}
        setSelected={setSelectedMobility}
        title="Mobility"
      />
      <Section
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
        onClick={() => onApplyClick(selectedGrade, selectedMobility, selectedEntity)}
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
