const cheerio = require('cheerio');
const { checkIsRun } = require('./utils');
const MDHBlog = async (browser, blogsMap, parseData) => {
  const baseURL = 'https://www.yuque.com';
  const page = await browser.newPage();
  await page.goto('https://www.yuque.com/mdh/weekly');
  const bodyHandle = await page.$('body');
  const html = await page.evaluate((body) => body.innerHTML, bodyHandle);
  const $ = cheerio.load(html);
  const top1 = $('#catalog-0 > .name > a');
  const href = top1.attr('href');
  const title = top1.attr('title');
  await page.goto(`${baseURL}${href}`);
  await page.waitForSelector('.main-wrapper', { visible: true });
  const html2 = await page.evaluateHandle(() => {
    return document.body;
  });
  const resultHandle = await page.evaluateHandle(
    (body) => body.innerHTML,
    html2
  );
  const detail = await resultHandle.jsonValue();
  const $2 = cheerio.load(detail);
  const content = $2('ne-h2');
  let list = [];
  content.each((_index, ele) => {
    const next = ele.next;
    const curNode = cheerio.load(ele);
    const nextNode = cheerio.load(next);
    list.push({
      title: curNode.text(),
      link: nextNode.text(),
    });
  });
  list = list.slice(0, -2);
  await bodyHandle.dispose();

  if (checkIsRun(parseData, 'mdh', title)) {
    blogsMap.push({
      title: title,
      list: list,
    });
    parseData.mdn = {
      title: title,
      date: new Date().toDateString(),
    };
  }
};

module.exports = { MDHBlog };
