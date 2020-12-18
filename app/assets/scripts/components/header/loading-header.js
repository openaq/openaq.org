import React from 'react';

import HeaderMessage from './header-message';

export default function LoadingHeader() {
  return (
    <HeaderMessage>
      <h1>Take a deep breath.</h1>
      <div className="prose prose--responsive">
        <p>Location data is loading...</p>
      </div>
    </HeaderMessage>
  );
}
