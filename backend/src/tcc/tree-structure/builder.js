const { getParent, getChilds, extractTextFromElement } = require('../crawling-tools/extract');

async function buildsSctrucutureBasedOnTree(images)
{
    data = []
    
    for (img of images)
    {
        src = await img.evaluate(x => x.src);

        width = await img.evaluate(x => x.naturalWidth);

        height = await img.evaluate(x => x.naturalHeight);
        
        /*can I keep this validation right here?*/
        if (width > 100 && height > 100 && ['.jpg', '.jpeg', '.png'].some(ext => src.endsWith(ext)) && src !== "")
        {
            alt = await img.evaluate(x => x.alt);

            node = await getParent(img);
            nodeText = await extractTextFromElement(node);

            parent = await getParent(node);
            parentText = await extractTextFromElement(parent);

            siblings = await getChilds(parent);
            siblingsTextList = [];

            for (sibling of siblings)
            {
                siblingText = await extractTextFromElement(sibling);
                siblingsTextList.push({"sibling.textContent": siblingText});
            }

            grandpa = await getParent(parent);
            grandpaText = await extractTextFromElement(grandpa);

            uncles = await getChilds(grandpa);
            unclesTextList = [];

            for (uncle of uncles)
            {
                uncleText = await extractTextFromElement(uncle);
                
                cousins = await getChilds(uncle);
                cousinsTextList = [];

                for (cousin of cousins)
                {
                    cousinText = await extractTextFromElement(cousin);
                    cousinsTextList.push({"cousin.textContent": cousinText});
                }
                
                unclesTextList.push({"uncle.textContent" : uncleText, "cousins": cousinsTextList});
                
            }

            data.push({"img.src": src, "img.alt": alt, "node.textContent": nodeText, "parent.textContent": parentText, siblings: siblingsTextList, "grandpa.textContent": grandpaText, uncles: unclesTextList});
        }
        else
        {
            continue;
        }
    }

    return data;
}

module.exports = {
    buildsSctrucutureBasedOnTree
};
