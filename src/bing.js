const cheerio = require('cheerio');
const BingPage = async (browser) => {
  const baseURL = 'https://bing.ioliu.cn';
  const page = await browser.newPage();

  await page.goto(baseURL);
  const html = await page.evaluate(() => document.body.innerHTML);

  const $ = cheerio.load(html);
  const imgUrl = $('.container > .item > .card  > img').attr('src');

  return imgUrl;
};

module.exports = { BingPage };
