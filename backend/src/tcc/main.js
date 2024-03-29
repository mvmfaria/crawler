const puppeteer = require('puppeteer');
const { fetchImgs, fetchUrls } = require('./crawling-tools/extract');
const { buildsSctrucutureBasedOnTree } = require('./tree-structure/builder');
const { writeJsonFile } = require('./utils/writer');
const { returnLabeledDataBasedOnTextSimilarities } = require('./text-similarity/checker');
const { executeDownloader } = require('./utils/orchestrator');

(async () => {

    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();

    await page.goto('https://en.wikipedia.org/wiki/List_of_dog_breeds');

    images = await fetchImgs(page);

    data = await buildsSctrucutureBasedOnTree(images);

    /*evectually will come from "breeds.json" */
    breeds = ["affenpinscher", "beagle", "golden_retriever", "pug", "poodle"];

    download = await returnLabeledDataBasedOnTextSimilarities(data, breeds);

    dataJson = JSON.stringify(data, null, "   ");

    writeJsonFile('./backend/src/tcc/results/data.json', dataJson)

    downloadJson = JSON.stringify(download, null, "   ");

    writeJsonFile('./backend/src/tcc/results/download.json', downloadJson)

    executeDownloader('python ./backend/src/tcc/utils/downloader.py');

    await browser.close();

})();
