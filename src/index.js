const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { MDHBlog } = require('./mdh');
const { V8Blog } = require('./v8-dev');
const { webDevBlog } = require('./web-dev');
const { theoDoBlog } = require('./theodo');

const parseData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../records/record.json'), 'utf8')
);
async function main() {
  const browser = await puppeteer.launch();
  console.log({ parseData });
  await Promise.all([
    MDHBlog(browser, parseData),
    V8Blog(browser, parseData),
    webDevBlog(browser, parseData),
    theoDoBlog(browser, parseData),
  ]);

  generateBlogs(parseData);

  await browser.close();
}

main();

function generateBlogs(blogs) {
  const outputFile = path.join(__dirname, '../README.md');
  const header = fs.readFileSync(
    path.join(__dirname, './template.md'),
    'utf-8'
  );
  let mdStr = '';
  mdStr += header;
  Object.keys(blogs).forEach((key) => {
    const list = parseData[key];
    mdStr += `# ${key}` + '\n';
    list.forEach((blog) => {
      mdStr += `- [${blog.title}](${blog.link})` + '\n';
    });
  });

  fs.writeFileSync(outputFile, mdStr);
  // 重新记录records
  fs.writeFileSync(
    path.join(__dirname, '../records/record.json'),
    JSON.stringify(parseData)
  );
}
