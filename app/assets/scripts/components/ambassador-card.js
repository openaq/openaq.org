import React, { useState } from 'react';
import PropTypes from 'prop-types';
import YoutubeEmbed from '../components/youtube-player';

export default function AmbassadorCardDetails({ youtubeEmbedId, linkedIn }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="ambassador-card-wrapper">
      {linkedIn ? (
        <div>
          <p>
            <a href={linkedIn}>LinkedIn</a>
          </p>
        </div>
      ) : (
        <div></div>
      )}
      {youtubeEmbedId ? (
        <div>
          {expanded ? (
            <div>
              <div
                className="ambassador-card-show-less"
                onClick={() => {
                  setExpanded(false);
                }}
              >
                <p>
                  <a>Close video</a>
                </p>
              </div>
              <YoutubeEmbed embedId={youtubeEmbedId}></YoutubeEmbed>
            </div>
          ) : (
            <div
              onClick={() => {
                setExpanded(true);
              }}
            >
              <p>
                <a>Feature video</a>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

AmbassadorCardDetails.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  youtubeEmbedId: PropTypes.string,
  linkedIn: PropTypes.string,
  children: PropTypes.string.isRequired,
};
