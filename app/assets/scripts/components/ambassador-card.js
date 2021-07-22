import React, { useState } from 'react';
import PropTypes from 'prop-types';
import YoutubeEmbed from '../components/youtube-player';

export default function AmbassadorCardDetails({ youtubeEmbedId }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="ambassador-card-wrapper">
      {expanded ? (
        <div>
          {youtubeEmbedId ? (
            <YoutubeEmbed embedId={youtubeEmbedId}></YoutubeEmbed>
          ) : (
            <div></div>
          )}
          <div
            className="ambassador-card-show-less"
            onClick={() => {
              setExpanded(false);
            }}
          >
            <h4>Show less</h4>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setExpanded(true);
          }}
        >
          <h4>View feature video</h4>
        </div>
      )}
    </div>
  );
}

AmbassadorCardDetails.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  youtubeEmbedId: PropTypes.string,
  children: PropTypes.string.isRequired,
};
