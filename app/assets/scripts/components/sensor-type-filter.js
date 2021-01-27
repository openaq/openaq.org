import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
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
  padding-bottom: 0.5rem;
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

const gradeOptions = ['Low-Cost_Sensor', 'Reference_Grade'];
const mobilityOptions = ['Mobile', 'Stationary'];
const entityOptions = ['Community', 'Research', 'Government'];
const LCS = gradeOptions[0];

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
            onClick={() => {
              setSelected(v === selected ? null : v);
            }}
          >
            {v.replace(/_/g,' ')}
          </button>
        ))}
      </SectionButtons>
      {props.children}
    </SectionWrapper>
  );
}

Section.propTypes = {
  title: T.string,
  options: T.array,
  selected: T.string,
  setSelected: T.function,
  children: T.node,
};

function SensorTypeFilter(props) {
  const {
    onApplyClick,
    manufacturers,
    grade,
    manufacturer,
    entity,
    mobility,
  } = props;

  const [selectedGrade, setSelectedGrade] = useState(grade);
  const [selectedManufacturer, setSelectedManufacturer] = useState(
    manufacturer
  );
  const [selectedMobility, setSelectedMobility] = useState(mobility);
  const [selectedEntity, setSelectedEntity] = useState(entity);
  useEffect(() => {
    if (selectedGrade !== 'Low-Cost Sensor') {
      setSelectedManufacturer(null);
    }
  }, [selectedGrade]);
  return (
    <Wrapper data-cy="filter-source-type">
      <Section
        data-cy="filter-menu-item"
        options={gradeOptions}
        selected={selectedGrade}
        setSelected={setSelectedGrade}
        title="Grade"
      >
        {selectedGrade === LCS && (
          <select
            className="form__control form__control--medium select--base-bounded"
            id="manufacturer__name"
            onChange={e => setSelectedManufacturer(e.target.value)}
            defaultValue={'default'}
          >
            <option value={'default'} disabled>
              {'Select manufacturer'}
            </option>
            {manufacturers.map(m => (
              <option value={m.replace(/ /g, '_')} key={m}>
                {m}
              </option>
            ))}
          </select>
        )}
      </Section>

      <Section
        data-cy="filter-source-type"
        options={mobilityOptions}
        selected={selectedMobility}
        setSelected={setSelectedMobility}
        title="Mobility"
      />
      <Section
        data-cy="filter-source-type"
        options={entityOptions}
        selected={selectedEntity}
        setSelected={setSelectedEntity}
        title="Selected Entity"
      />

      <button
        type="button"
        disabled={
          !(
            selectedGrade ||
            selectedManufacturer ||
            selectedMobility ||
            selectedEntity
          )
        }
        className={c('button', {
          'button--base': !(
            selectedGrade &&
            selectedMobility &&
            selectedEntity
          ),
          'button--primary':
            selectedGrade ||
            selectedManufacturer ||
            selectedMobility ||
            selectedEntity,
        })}
        onClick={() =>
          onApplyClick(
            selectedGrade,
            selectedManufacturer,
            selectedMobility,
            selectedEntity
          )
        }
      >
        Apply
      </button>
    </Wrapper>
  );
}

SensorTypeFilter.propTypes = {
  onApplyClick: T.func,
  manufacturers: T.array,
  grade: T.string,
  manufacturer: T.string,
  entity: T.string,
  mobility: T.string,
};
export default SensorTypeFilter;
