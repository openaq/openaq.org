import React from 'react';
import InfoMessage from './info-message';

export default function ErrorMessage() {
  return (
    <div>
      <p>We couldn&apos;t get any data.</p>
      <InfoMessage>
        <p>Please try again later.</p>
        <p>
          If you think there&apos;s a problem, please{' '}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            contact us.
          </a>
        </p>
      </InfoMessage>
    </div>
  );
}
