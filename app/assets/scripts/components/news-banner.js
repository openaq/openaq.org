import React, { useState } from 'react';

import SmartLink from './smart-link';

export default function NewsBanner() {
  const [isVisible, setVisibility] = useState(true);

  return isVisible ? (
    <div className="news-banner">
      <div className="inner">
        <span className="news-banner__pill">New</span>
        <p className="news-banner__msg">
          We have low cost sensor data! 🙌{' '}
          <SmartLink to="/locations" title="View the locations page with data">
            Explore the data
          </SmartLink>{' '}
          or{' '}
          <SmartLink
            to="https://openaq.medium.com/"
            title="Read our blog on Medium"
          >
            read our blog post
          </SmartLink>{' '}
          to learn more.
        </p>

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
