(async () => {
    const headerDonate = document.querySelector('.js-header-donate-btn');
    headerDonate.addEventListener('click', () => plausible('onClickHeaderDonate'));
    const headerDocsLink = document.querySelector('.js-header-docs-link');
    headerDocsLink.addEventListener('click', () => plausible('onClickHeaderDocsLink'));
    // footer section
    const footerXLink = document.querySelector('.js-footer-x-link');
    footerXLink.addEventListener('click', () => plausible('onClickFooterXLink'));
    const footerGithubLink = document.querySelector('.js-footer-github-link');
    footerGithubLink.addEventListener('click', () => plausible('onClickFooterGithubLink'));
    const footerSlackLink = document.querySelector('.js-footer-slack-link');
    footerSlackLink.addEventListener('click', () => plausible('onClickFooterSlackLink'));
    const footerLinkedInLink = document.querySelector('.js-footer-linkedIn-link');
    footerLinkedInLink.addEventListener('click', () => plausible('onClickFooterLinkedInLink'));
    const footerMediumLink = document.querySelector('.js-footer-medium-link');
    footerMediumLink.addEventListener('click', () => plausible('onClickFooterMediumLink'));
    const footerYoutubeLink = document.querySelector('.js-footer-youtube-link');
    footerYoutubeLink.addEventListener('click', () => plausible('onClickFooterYoutubeLink'));
    const footerFacebookLink = document.querySelector('.js-footer-fb-link');
    footerFacebookLink.addEventListener('click', () => plausible('onClickFooterFacebookLink'));
    const footerSubscribe = document.querySelector('.js-footer-subscribe');
    footerSubscribe.addEventListener('click', () => plausible('onClickFooterSubscribe'));
})();