import React from 'react';
import PropTypes from 'prop-types';

export default function OptionCard({ toggleAllLocations, isAllLocations }) {
  return (
    <div className="map__legend" style={{ top: `2rem`, height: `4rem` }}>
      <form
        onChange={e => toggleAllLocations(e.target.value === 'isAllLocations')}
      >
        <input
          type="radio"
          id="isAllLocations"
          name="selectLocations"
          checked={isAllLocations}
          value="isAllLocations"
        />
        <label htmlFor="isAllLocations">All locations selected</label>
        <input
          type="radio"
          id="isNodeSelection"
          name="selectLocations"
          checked={!isAllLocations}
          value="isNodeSelection"
        />
        <label htmlFor="isNodeSelection">Select locations</label>
      </form>
    </div>
  );
}

OptionCard.propTypes = {
  isAllLocations: PropTypes.bool.isRequired,
  toggleAllLocations: PropTypes.func.isRequired,
};
