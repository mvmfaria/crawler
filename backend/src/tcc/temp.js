const puppeteer = require('puppeteer');
const { getParent, getChilds, extractTextFromElement, getNeighbors, extractInnerHTMLFromElement } = require('./crawling-tools/extract');
const { fetchImgs, fetchUrls } = require('./crawling-tools/extract');

(async () => {

  browser = await puppeteer.launch({headless: true});

  page = await browser.newPage();

  await page.goto('https://en.wikipedia.org/wiki/Affenpinscher');

  links = await fetchUrls(page);
  
  console.log(links.length);

  images = await fetchImgs(page);

  image = images[3]; //affenpinscher image.

  src = await image.evaluate(x => x.src);

  console.log(src);
  
  no = await getParent(image);

  console.log(await extractTextFromElement(no));
  console.log(await extractInnerHTMLFromElement(image));
  
  // pai = await getParent(no);
  
  // // console.log(await extractTextFromElement(pai));
  
  // avo = await getParent(pai);
  
  // vizinhos = await getNeighbors(avo);
  // console.log(vizinhos.length);

  // // filhosDoAvo = await getChilds(avo);

  // // for (filho of filhosDoAvo)
  // // {
  // //   console.log(`${await extractTextFromElement(filho)} - ${await extractTextFromElement(pai)}`);
  // // }

  await browser.close();

})();
