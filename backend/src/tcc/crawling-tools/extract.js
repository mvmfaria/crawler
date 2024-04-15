async function fetchImgs(page)
{
    return await page.$$('img');
}

async function fetchUrls(page) 
{
    const urls = await page.$$eval('a', as => as.map(a => 
    {
        try 
        {
            const url = new URL(a.href);
            url.hash = '';
            return url.toString();
        } 
        catch (error) 
        {
            console.warn(`AVISO: URL inválida ${a.href}: ${error.message}`);
            return null;
        }
    }));

    const urlsValidas = urls.filter(url => url !== null);

    return [...new Set(urlsValidas)];
}

async function getParent(node) 
{
    const handle = await node.evaluateHandle(x => x.parentElement);
    const element = handle.asElement();
    const innerHTML = await extractInnerHTMLFromElement(element);

    return {element, innerHTML};
}

async function getChilds(node) 
{
    const handles = await node.evaluateHandle(x => Array.from(x.children));
    const properties = await handles.getProperties();
    const elements = Array.from(properties.values()).map(prop => prop.asElement());

    const childs = [];
    for (const element of elements)
    {
        const innerHTML = await extractInnerHTMLFromElement(element);
        if (innerHTML != "")
        {
            childs.push({element, innerHTML});
        }
    }
    return childs;
}

async function getNeighbors(node)
{
    const parent = await getParent(node);
    const children = await getChilds(node);
    return [parent].concat(children);
}

async function extractTextFromElement(element) 
{
    return await element.evaluate(x => x.textContent.replace(/\s+/g, ' ').trim())
}

async function extractInnerHTMLFromElement(element)
{
    return await element.evaluate(x => x.innerHTML);
}

module.exports = {
    fetchImgs,
    fetchUrls,
    getParent,
    getChilds,
    getNeighbors,
    extractTextFromElement,
    extractInnerHTMLFromElement
};