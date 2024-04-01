const puppeteer = require('puppeteer');
const { fetchImgs, fetchUrls } = require('./crawling-tools/extract');
const { buildsSctrucutureBasedOnTree } = require('./tree-structure/builder');
const { writeJsonFile } = require('./utils/writer');
const { executeDownloader } = require('./utils/orchestrator');

(async () => {

    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();

    await page.goto('https://www.akc.org/dog-breeds/');
    
    links = await fetchUrls(page);

    download = [];

    let index = 0;

    for (link of links)
    {
        try 
        {
            await page.goto(link);
        } 
        catch
        {
            continue;
        }

        images = await fetchImgs(page, {timeout: 0});

        usefullImages = await buildsSctrucutureBasedOnTree(images);
        
        download = download.concat(usefullImages);

        index++;

        console.log(`progress ${index}/${links.length} | found images: ${images.length} | valid ones: ${usefullImages.length} | link: ${link}`);
    }
    
    file = JSON.stringify(download, null, "   ");
    
    writeJsonFile('./tcc/results/download.json', file)

    executeDownloader('python ./tcc/utils/downloader.py');

    await browser.close();

})();
