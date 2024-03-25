const puppeteer = require('puppeteer');
const { fetchImgs } = require('./crawling-tools/extract');
const { buildsSctrucutureBasedOnTree } = require('./tree-structure/builder');
const { writeJsonFile } = require('./utils/writer');
const { returnLabeledDataBasedOnTextSimilarities } = require('./text-similarity/checker');
const { executeDownloader } = require('./utils/orchestrator');

(async () => {

    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();

    await page.goto('https://www.akc.org/dog-breeds/beagle/');

    images = await fetchImgs(page);

    data = await buildsSctrucutureBasedOnTree(images);

    /*evectually will come from "breeds.json" */
    breeds = ["affenpinscher", "beagle", "golden_retriever", "pug", "poodle"];

    download = await returnLabeledDataBasedOnTextSimilarities(data, breeds);

    dataJson = JSON.stringify(data, null, "   ");

    writeJsonFile('./tcc/results/data.json', dataJson)

    downloadJson = JSON.stringify(download, null, "   ");

    writeJsonFile('./tcc/results/download.json', downloadJson)

    executeDownloader('python ./tcc/utils/downloader.py');

    await browser.close();

})();
