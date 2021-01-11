import React from 'react';
import T from 'prop-types';
import styled from 'Styled-Components';

const Wrapper = styled.div`
  width: 20rem;
`;

const Section = styled.div`
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

function SensorTypeFilter(props) {
  const { onApplyClick } = props;
  return (
    <Wrapper>
      <Section>
        <SectionTitle></SectionTitle>
        <SectionButtons>
          {['Low Cost Sensor', 'Reference-Grade'].map(v => (
            <button type="button" className="button--primary button">
              {v}
            </button>
          ))}
        </SectionButtons>
      </Section>

      <button
        type="button"
        className="button--primary button"
        onClick={onApplyClick}
      >
        Apply
      </button>
    </Wrapper>
  );
}

SensorTypeFilter.propTypes = {};
export default SensorTypeFilter;
