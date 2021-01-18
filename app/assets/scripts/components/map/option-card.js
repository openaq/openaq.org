import React from 'react';
import PropTypes from 'prop-types';

export default function OptionCard({
  toggleLocationSelection,
  isDisplayingSelectionTools,
}) {
  return (
    <div
      className="map__legend"
      style={{ top: `2rem`, bottom: `unset`, maxWidth: `16rem` }}
    >
      <form className="form" onChange={() => toggleLocationSelection()}>
        <fieldset className="form__fieldset">
          <div className="form__group">
            <label className="form__option form__option--inline form__option--custom-radio">
              <input
                type="radio"
                id="isFullProject"
                name="selectLocations"
                className="form__option form__option--custom-radio"
                checked={!isDisplayingSelectionTools}
                value={'isFullProject'}
              />
              <span className="form__option__text">All locations selected</span>
              <span className="form__option__ui"></span>
            </label>
            <label className="form__option form__option--custom-radio">
              <input
                type="radio"
                id="isNodeSelection"
                name="selectLocations"
                checked={isDisplayingSelectionTools}
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
  isDisplayingSelectionTools: PropTypes.bool.isRequired,
  toggleLocationSelection: PropTypes.func.isRequired,
};
