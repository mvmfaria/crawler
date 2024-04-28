const puppeteer = require('puppeteer');
const { fetchImgs, fetchUrls, extractAllTextContentFromAPage } = require('./crawling-tools/extract');
const { LabelsImagesBasedOnGraphs } = require('./tree-structure/builder');
const { writeJsonFile } = require('./utils/writer');
const { executeDownloader } = require('./utils/orchestrator');
const { checkTextLanguage } = require('./text-similarity/checker');

(async () => {

    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();

    await page.goto('https://en.wikipedia.org/wiki/List_of_dog_breeds');

    links = await fetchUrls(page);

    console.log("amount of pages found: " + links.length);

    download = [];

    let index = 0;

    for (link of links) {

        try {
            await page.goto(link);
        } catch {
            continue;
        }

        pageContent = await extractAllTextContentFromAPage(page);

        if (!checkTextLanguage(pageContent, 'eng')) continue;

        if (!pageContent.includes('dog')) continue;

        images = await fetchImgs(page, { timeout: 0 });

        labeledImages = await LabelsImagesBasedOnGraphs(images, 5, link);

        download = download.concat(labeledImages);

        index++;

        console.log(`progress ${index}/${links.length} | found images: ${images.length} | valid ones: ${labeledImages.length} | link: ${link}`);
    }

    file = JSON.stringify(download, null, "   ");

    writeJsonFile('./tcc/results/download.json', file)

    // executeDownloader('python ./tcc/utils/downloader.py');

    await browser.close();

})();
