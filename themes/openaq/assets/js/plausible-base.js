(async () => {
    const headerDonate = document.querySelector('.js-header-donate-btn');
    headerDonate.addEventListener('click', () => plausible('onClickHeaderDonate'));
    const headerDocsLink = document.querySelector('.js-header-docs-link');
    headerDocsLink.addEventListener('click', () => plausible('onClickHeaderDocsLink'));
})();