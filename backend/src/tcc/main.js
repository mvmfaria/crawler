const puppeteer = require('puppeteer');
const { fetchImgs } = require('./crawling-tools/extract');
const { buildsSctrucutureBasedOnTree } = require('./tree-structure/builder');
const { writeJsonFile } = require('./utils/json/writer');
const { returnLabeledDataBasedOnTextSimilarities } = require('./text-similarity/checker');

(async () => {

    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();

    await page.goto('https://en.wikipedia.org/wiki/Affenpinscher');

    images = await fetchImgs(page);

    data = await buildsSctrucutureBasedOnTree(images);

    /*evectually will come from "breeds.json" */
    breeds = ["affenpinscher", "beagle", "golden_retriever", "pug", "poodle"];

    download = await returnLabeledDataBasedOnTextSimilarities(data, breeds);

    json = JSON.stringify(download, null, "   ");

    writeJsonFile('./tcc/results/download.json', json)

    await browser.close();

})();
