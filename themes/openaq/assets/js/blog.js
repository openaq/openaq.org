(async () => {
    const list = document.querySelector('.items');
    const res = await fetch('https://medium.openaq.org/').catch(() =>  {
        const errorHtml = `
        <span class="type-header-1">
            Failed to fetch blog items. Visit OpenAQ on <a href="https://openaq.medium.com/">Medium
        </span>`;
        list.insertAdjacentHTML('beforeend', errorHtml);
        return;
    });
    const feed = await res.text();
    const data = new window.DOMParser().parseFromString(feed, "text/xml");
    const items = data.querySelectorAll("item");
    for (const item of items) {
        const title = item.querySelector("title").innerHTML.match(/\<\!\[CDATA\[(.*)\]{2}\>/)
        const publicationDate = new Date(item.querySelector("pubDate").innerHTML)
        const content = item.getElementsByTagName('content:encoded')
        const link = item.getElementsByTagName('link').innerHTML
        const html = `<a href="${link}" target="_blank" rel="noreferrer noopener"><article class="blog-item">
        <span class="blog-date type-header-3">${publicationDate.toLocaleDateString('en-us', { month:"long", day:"numeric"})}</span>
        <div class="blog-content">
        <div><h5 class="type-subtitle-1 text-sky-120">${title[1]}</h5></div>
        <div><p class="type-body-2">${content[0].innerHTML.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 200)}...</p>
        </div>
        </div>
        </article></a>`
        list.insertAdjacentHTML('beforeend',html);
    }
})();