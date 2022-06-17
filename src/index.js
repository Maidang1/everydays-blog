const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { MDHBlog } = require('./mdh');

const blogsMap = [];
const parseData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../records/record.json'), 'utf8')
);
async function main() {
  const browser = await puppeteer.launch();
  await MDHBlog(browser, blogsMap, parseData);
  generateBlogs(blogsMap);

  await browser.close();
}

main();

function generateBlogs(blogs) {
  const outputDir = path.join(__dirname, '../blogs');
  console.log({ outputDir });
  const fileName = new Date().toDateString();
  let mdStr = '';
  blogs.forEach((blog) => {
    mdStr =
      `# ${blog.title} \n` +
      `${blog.list.map((item) => `- [${item.title}](${item.link})`).join('\n')}
      `;
  });
  fs.writeFileSync(`${outputDir}/${fileName}.md`, mdStr);
  // 重新记录records
  fs.writeFileSync(
    path.join(__dirname, '../records/record.json'),
    JSON.stringify(parseData)
  );
}