const cheerio = require('cheerio');
const { checkIsRun } = require('./utils')

const theoDoBlog = async (browser, blogsMap, parseData) => {

  const baseURL = 'https://blog.theodo.com'
  const page = await browser.newPage();
  await page.goto(baseURL)
  const html = await page.evaluate(() => {
    return document.body.innerHTML
  })
  const $ = cheerio.load(html);
  const tabList = $('nav > a')
  const linkList = []
  tabList.each((_index, ele) => {
    linkList.push(ele.attribs['href'])
  })
  const list = []

  for (let i = 0; i < linkList.length; i++) {
    await page.goto(baseURL + linkList[i]);
    const html = await page.evaluate(() => {
      return document.body.innerHTML
    });
    const $ = cheerio.load(html);

    const h2 = $("main > div > div > a > h2").first();
    const link = $("main > div > div > a").first();
    const title = h2.text();
    const href = link.attr('href')
    list.push({
      title,
      link: baseURL + href
    })
  }

  let listTitle = list.map((i) => i.title)

  if (!parseData.theodo || new Date().toDateString() === parseData.theodo.date) {
    blogsMap.push({
      title: 'theodo blog',
      list
    })
  } else {
    const title = parseData.theodo.title.map(item => item.title)
    blogsMap.push({
      title: "theodo blog",
      list: list.filter((i) => !title.includes(i))
    })
  }
  parseData.theodo = {
    title: listTitle,
    date: new Date().toDateString(),
  }

}
module.exports = { theoDoBlog }