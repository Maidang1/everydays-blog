const cheerio = require('cheerio');

const webDevBlog = async (browser, parseData) => {
  const baseURL = 'https://web.dev';
  const page = await browser.newPage();
  await page.goto(baseURL + '/blog');
  await page.waitForSelector('.card', { visible: true });
  const html = await page.evaluate(() => {
    return document.body.innerHTML;
  });

  const $ = cheerio.load(html);

  const href = $('.card > a').attr('href');
  const title = $('.card > .card__content > .card__heading > a').first().text();
  let shouldSave = false;
  if (parseData.webdev) {
    const links = parseData.v8.map((item) => item.link);
    shouldSave = links.includes(href);
  } else {
    shouldSave = true;
    parseData.webdev = [];
  }
  shouldSave &&
    parseData.webdev.push({
      title,
      link: `${baseURL}${href}`,
    });
};

module.exports = { webDevBlog };
