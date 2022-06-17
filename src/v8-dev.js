const cheerio = require('cheerio');
const { checkIsRun } = require('./utils');

const V8Blog = async (browser, blogsMap, parseData) => {
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
  if (checkIsRun(parseData, 'v8', title)) {
    blogsMap.push({
      title: 'V8 blog',
      list: [
        {
          title,
          link: `${baseURL}${href}`,
        },
      ],
    });
    parseData.v8 = {
      title,
      date: new Date().toDateString(),
    };
  }
};

module.exports = { V8Blog };
