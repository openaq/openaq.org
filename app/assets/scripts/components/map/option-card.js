import React from 'react';
import PropTypes from 'prop-types';

export default function OptionCard({ toggleAllLocations, isAllLocations }) {
  return (
    <div
      className="map__legend"
      style={{ top: `2rem`, bottom: `unset`, maxWidth: `16rem` }}
    >
      <form
        className="form"
        onChange={e => toggleAllLocations(e.target.value === 'isAllLocations')}
      >
        <fieldset className="form__fieldset">
          <div className="form__group">
            <label className="form__option form__option--inline form__option--custom-radio">
              <input
                type="radio"
                id="isAllLocations"
                name="selectLocations"
                className="form__option form__option--custom-radio"
                defaultChecked={isAllLocations}
                value="isAllLocations"
              />
              <span className="form__option__text">All locations selected</span>
              <span className="form__option__ui"></span>
            </label>
            <label className="form__option form__option--custom-radio">
              <input
                type="radio"
                id="isNodeSelection"
                name="selectLocations"
                defaultChecked={!isAllLocations}
                value="isNodeSelection"
              />
              <span className="form__option__text">Select locations</span>
              <span className="form__option__ui"></span>
            </label>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

OptionCard.propTypes = {
  isAllLocations: PropTypes.bool.isRequired,
  toggleAllLocations: PropTypes.func.isRequired,
};
