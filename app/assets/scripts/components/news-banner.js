import React, { useState } from 'react';

import SmartLink from './smart-link';

export default function NewsBanner() {
  const [isVisible, setVisibility] = useState(true);

  return isVisible ? (
    <div className="news-banner">
      <div className="inner">
        <p className="news-banner__msg">
          <span className="msg-status">New</span>
          <span>We have low cost sensor data! 🙌</span>
        </p>
        <div className="news-banner__actions">
          <SmartLink
            className="button button--capsule button--primary"
            to="/locations"
            title="View the locations page with data"
          >
            Explore data
          </SmartLink>
          <SmartLink
            to="https://openaq.medium.com/"
            title="Read our blog on Medium"
            className="button button--capsule button--white-bounded"
          >
            Read blog post
          </SmartLink>
        </div>

        <button
          className="news-banner__close"
          title="Hide news banner"
          onClick={() => setVisibility(false)}
        >
          <span>Close</span>
        </button>
      </div>
    </div>
  ) : null;
}
