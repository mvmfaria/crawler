async function fetchImgs(link)
{
    return await link.$$('img');
}

async function fetchUrls(page) 
{
    return await page.$$eval('a', as => as.map(a => a.href));
}


async function getParent(node) 
{
    const handle = await node.evaluateHandle(x => x.parentElement);
    return handle.asElement();
}

async function getChilds(parent) 
{
    const handle = await parent.evaluateHandle(x => Array.from(x.children));
    const elements = await handle.getProperties();
    return Array.from(elements.values()).map(prop => prop.asElement());
}

async function extractTextFromElement(element) 
{
    return await element.evaluate(x => x.textContent.replace(/\s+/g, ' ').trim())
}

module.exports = {
    fetchImgs,
    fetchUrls,
    getParent,
    getChilds,
    extractTextFromElement
};