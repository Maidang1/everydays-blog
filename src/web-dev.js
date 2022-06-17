const cheerio = require('cheerio');
const { checkIsRun } = require('./utils');

const webDevBlog = async (browser, blogsMap, parseData) => {
  const baseURL = "https://web.dev"
  const page = await browser.newPage();
  await page.goto(baseURL + "/blog");
  await page.waitForSelector('.card', { visible: true });
  const html = await page.evaluate(() => {

    return document.body.innerHTML
  })

  const $ = cheerio.load(html)

  const href = $(".card > a").attr('href')
  const title = $(".card > .card__content > .card__heading > a").first().text()
  console.log({ href, title })
  if (checkIsRun(parseData, 'webdev', title)) {
    blogsMap.push({
      title: "web dev blog",
      list: [
        {
          title,
          link: `${baseURL}${href}`
        }
      ]
    });
    parseData.webdev = {
      title,
      date: new Date().toDateString(),
    };
  }

}

module.exports = { webDevBlog }