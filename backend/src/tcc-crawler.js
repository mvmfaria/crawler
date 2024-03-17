const puppeteer = require('puppeteer');

(async () => {

  browser = await puppeteer.launch();
  page = await browser.newPage();

  /*-----------------------------------------------------------------------------*/
  async function fetchImgs(link)
  {
    return await link.$$('img');
  }

  async function getParent(node)
  {
    return await node.evaluateHandle(x => x.parentNode);
  }

  async function getChilds(parent)
  {
    return await parent.evaluateHandle(x => Array.from(x.children));
  }

  async function extractTextFromElement(elementHandle) {
    return await elementHandle.evaluate(x => {return x.textContent;});
  }
  /*-----------------------------------------------------------------------------*/


  await page.goto('https://en.wikipedia.org/wiki/Affenpinscher');

  /*main logic: -----------------------------------------------------------------*/
  images = await fetchImgs(page);

  for (img of images)
  {
    //check if img.alt contains something useful.
    alt = await img.evaluate(x => x.alt);

    //check if node.textContent (nodeText) contains something useful.
    node = await getParent(img);
    nodeText = await extractTextFromElement(node);

    //check if parent.textContent (parentText) contains something useful. 
    parent = await getParent(node);
    parentText = await extractTextFromElement(parent);

    siblings = await getChilds(parent)
    for (sibling of siblings)
    {
      //check if sibling.textContent contains something useful.
      siblingText = await extractTextFromElement(sibling);
    }

    //check if grandpa.textContent contains something useful.
    grandpa = await getParent(parent);
    grandpaText = await extractTextFromElement(grandpa);

    uncles = await getChilds(grandpa);
    for (uncle of uncles)
    {
      //check if uncle.textContent contains something useful.
      uncleText = await extractTextFromElement(uncle);
    }
  }
  /*-----------------------------------------------------------------------------*/

  await browser.close();

})();
