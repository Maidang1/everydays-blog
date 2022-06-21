const cheerio = require('cheerio');

const V8Blog = async (browser, parseData) => {
  const baseURL = 'https://v8.dev';
  const page = await browser.newPage();
  await page.goto(baseURL + '/blog');
  await page.waitForSelector('#main', { visible: true });
  const html = await page.evaluate(() => {
    return document.body.innerHTML;
  });
  const $ = cheerio.load(html);
  const content = $('#main > ol > li > a');

  const href = content.attr('href');
  const title = href.replace('/blog/', '');
  let shouldSave = false;

  if (parseData.v8) {
    const links = parseData.v8.map((item) => item.link);
    shouldSave = !links.includes(href);
  } else {
    shouldSave = true;
    parseData.v8 = [];
  }
  shouldSave &&
    parseData.v8.push({
      title,
      link: href,
    });
};

module.exports = { V8Blog };
