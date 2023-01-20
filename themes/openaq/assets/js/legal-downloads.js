(() => {
  const baseUrl = 'https://documents.openaq.org';
  const financialDownloadBtn = document.querySelector(
    '.js-download-financial-btn'
  );
  const financialSelect = document.querySelector('.js-financial-select');
  financialDownloadBtn.addEventListener('click', () => {
    location.href = `${baseUrl}${financialSelect.value}`;
  });
  const incorporationDownloadBtn = document.querySelector(
    '.js-download-incorporation-btn'
  );
  const incorporationSelect = document.querySelector(
    '.js-incorporation-select'
  );
  incorporationDownloadBtn.addEventListener('click', () => {
    location.href = `${baseUrl}${incorporationSelect.value}`;
  });
  const policyDownloadBtn = document.querySelector(
    '.js-download-policy-btn'
  );
  const policySelect = document.querySelector(
    '.js-policy-select'
  );
  policyDownloadBtn.addEventListener('click', () => {
    location.href = `${baseUrl}${policySelect.value}`;
  });
})();
