import React from 'react';
import PropTypes from 'prop-types';

export default function OptionCard({ toggleAllLocations, isAllLocations }) {
  return (
    <div
      className="map__legend"
      style={{ top: `2rem`, bottom: `unset`, maxWidth: `12rem` }}
    >
      <form
        onChange={e => toggleAllLocations(e.target.value === 'isAllLocations')}
      >
        <div style={{ display: `block`, paddingBottom: `.5rem` }}>
          <input
            type="radio"
            id="isAllLocations"
            name="selectLocations"
            checked={isAllLocations}
            value="isAllLocations"
            style={{ marginRight: `.5rem` }}
          />
          <label htmlFor="isAllLocations">All locations selected</label>
        </div>
        <div style={{ display: `block` }}>
          <input
            type="radio"
            id="isNodeSelection"
            name="selectLocations"
            checked={!isAllLocations}
            value="isNodeSelection"
            style={{ marginRight: `.5rem` }}
          />
          <label htmlFor="isNodeSelection">Select locations</label>
        </div>
      </form>
    </div>
  );
}

OptionCard.propTypes = {
  isAllLocations: PropTypes.bool.isRequired,
  toggleAllLocations: PropTypes.func.isRequired,
};
