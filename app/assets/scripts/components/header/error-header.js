import React from 'react';
import HeaderMessage from './header-message';

export default function ErrorHeader() {
  return (
    <HeaderMessage>
      <h1>Uh oh, something went wrong.</h1>
      <div className="prose prose--responsive">
        <p>
          There was a problem getting the data. If you continue to have
          problems, please let us know.
        </p>
        <p>
          <a href="mailto:info@openaq.org" title="Send us an email">
            Send us an Email
          </a>
        </p>
      </div>
    </HeaderMessage>
  );
}
