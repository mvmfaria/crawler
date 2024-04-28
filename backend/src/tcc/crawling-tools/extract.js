/**
 * Fetches all the img elements on the page.
 * 
 * @param {Page} page - The page object to fetch the img elements from.
 * @returns {Promise<Array<ElementHandle>>} - A promise that resolves to an array of ElementHandle objects representing the img elements.
 */
async function fetchImgs(page) {
    return await page.$$('img');
}

/**
 * Fetches all the URLs from the anchor elements on the page.
 * 
 * @param {Page} page - The page object to fetch the URLs from.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of URLs.
 */
async function fetchUrls(page) {
    const urls = await page.$$eval('a', as => as.map(a => {
        try {
            const url = new URL(a.href);
            url.hash = '';
            return url.toString();
        } catch (error) {
            console.warn(`AVISO: URL inválida ${a.href}: ${error.message}`);
            return null;
        }
    }));

    const urlsValidas = urls.filter(url => url !== null);

    return [...new Set(urlsValidas)];
}

/**
 * Retrieves the parent element and its inner HTML of a given node.
 * 
 * @param {ElementHandle} node - The node to retrieve the parent element from.
 * @returns {Promise<{element: ElementHandle, innerHTML: string}>} - A promise that resolves to an object containing the parent element and its inner HTML.
 */
async function getParent(node) {
    const handle = await node.evaluateHandle(x => x.parentElement);
    const element = handle.asElement();
    const innerHTML = await extractInnerHTMLFromElement(element);

    return { element, innerHTML };
}

/**
 * Retrieves the child elements and their inner HTML of a given node.
 * 
 * @param {ElementHandle} node - The node to retrieve the child elements from.
 * @returns {Promise<Array<{element: ElementHandle, innerHTML: string}>>} - A promise that resolves to an array of objects containing the child elements and their inner HTML.
 */
async function getChilds(node) {
    const handles = await node.evaluateHandle(x => Array.from(x.children));
    const properties = await handles.getProperties();
    const elements = Array.from(properties.values()).map(prop => prop.asElement());

    const childs = [];
    for (const element of elements) {
        const innerHTML = await extractInnerHTMLFromElement(element);
        if (innerHTML != "") {
            childs.push({ element, innerHTML });
        }
    }
    return childs;
}

/**
 * Retrieves the parent element and child elements (with innerHTML) of a given node.
 * 
 * @param {ElementHandle} node - The node to retrieve the parent element and child elements from.
 * @returns {Promise<Array<{element: ElementHandle, innerHTML: string}>>} - A promise that resolves to an array of objects containing the parent element and child elements with their inner HTML.
 */
async function getNeighbors(node) {
    const parent = await getParent(node);
    const children = await getChilds(node);
    return [parent].concat(children);
}

/**
 * Extracts the innerText content from a given element.
 * 
 * @param {ElementHandle} element - The element to extract the innerText content from.
 * @returns {Promise<string>} - A promise that resolves to the extracted innerText content.
 */
async function extractTextFromElement(element) {
    return await element.evaluate(x => x.innerText.replace(/\s+/g, ' ').trim());
}

/**
 * Extracts the inner HTML from a given element.
 * 
 * @param {ElementHandle} element - The element to extract the innerHTML from.
 * @returns {Promise<string>} - A promise that resolves to the innerHTML.
 */
async function extractInnerHTMLFromElement(element) {
    return await element.evaluate(x => x.innerHTML);
}

/**
 * Extracts all the text content from a page.
 * 
 * @param {Page} page - The page object to extract the text content from.
 * @returns {Promise<string>} - A promise that resolves to the extracted text content.
 */
async function extractAllTextContentFromAPage(page) {
    return await page.evaluate(() => document.body.innerText);
}

module.exports = {
    fetchImgs,
    fetchUrls,
    getParent,
    getChilds,
    getNeighbors,
    extractTextFromElement,
    extractInnerHTMLFromElement,
    extractAllTextContentFromAPage
};