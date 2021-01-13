import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import c from 'classnames';

const Wrapper = styled.div`
  // Emulated gap: https://coryrylan.com/blog/css-gap-space-with-flexbox
  display: flex;
  flex-flow: row wrap;
  margin: -1rem 0 0 -1rem;
  width: calc(100% + 1rem);

  > * {
    margin: 1rem 0 0 1rem;
  }
`;

function TabbedSelector(props) {
  const { tabs, activeTab, onTabSelect } = props;

  return (
    <Wrapper>
      {tabs.map(t => (
        <a
          key={t.id}
          href="#"
          className={c('tabbed-selector__link', {
            'tabbed-selector__link--active': activeTab.id === t.id,
          })}
          onClick={e => {
            e.preventDefault();
            onTabSelect(t);
          }}
        >
          {t.name}
        </a>
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
