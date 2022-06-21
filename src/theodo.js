const cheerio = require('cheerio');
const { checkIsRun } = require('./utils');

const theoDoBlog = async (browser, parseData) => {
  const baseURL = 'https://blog.theodo.com';
  const page = await browser.newPage();
  await page.goto(baseURL);
  const html = await page.evaluate(() => {
    return document.body.innerHTML;
  });
  const $ = cheerio.load(html);
  const tabList = $('nav > a');
  const linkList = [];
  tabList.each((_index, ele) => {
    linkList.push(ele.attribs['href']);
  });
  const list = [];

  for (let i = 0; i < linkList.length; i++) {
    await page.goto(baseURL + linkList[i]);
    const html = await page.evaluate(() => {
      return document.body.innerHTML;
    });
    const $ = cheerio.load(html);

    const h2 = $('main > div > div > a > h2').first();
    const link = $('main > div > div > a').first();
    const title = h2.text();
    const href = link.attr('href');
    list.push({
      title,
      link: baseURL + href,
    });
  }

  let shouldSavedLinks = [];

  if (parseData.theodo) {
    const savedLinks = parseData.theodo.map((item) => item.link);
    shouldSavedLinks = list.filter((item) => !savedLinks.includes(item.link));
  } else {
    parseData.theodo = [];
    shouldSavedLinks = list;
  }
  parseData.theodo.push(...shouldSavedLinks);
};
module.exports = { theoDoBlog };
