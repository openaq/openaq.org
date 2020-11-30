import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import c from 'classnames';

const Tab = styled.a`
  width: min-content;
  margin: 0;
  line-height: 3rem;
  text-transform: uppercase;
`;
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
`;

function TabbedSelector(props) {
  const { tabs, activeTab, onTabSelect } = props;

  return (
    <Wrapper>
      {tabs.map(t => (
        <Tab
          key={t.id}
          className={c('global-menu__link', {
            'global-menu__link--active': activeTab.id === t.id,
          })}
          onClick={() => onTabSelect(t)}
        >
          {t.name}
        </Tab>
      ))}
    </Wrapper>
  );
}

TabbedSelector.propTypes = {
  tabs: T.arrayOf(
    T.shape({
      id: T.string.isRequired,
      name: T.string.isRequired,
    })
  ),
  activeTab: T.shape({
    id: T.string.isRequired,
    name: T.string.isRequired,
  }),
  onTabSelect: T.func,
};

export default TabbedSelector;
