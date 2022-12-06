(() => {
  function copyURL() {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);
    const buttonText = document.querySelector('.js-copy-button__text');
    buttonText.innerText = 'Copied!';
    setTimeout(() => (buttonText.innerText = 'Copy link'), 1000);
  }
  const copyButton = document.querySelector('.js-copy-button');
  copyButton.addEventListener('click', copyURL);
})();
