const { getParent, getChilds, extractTextFromElement } = require('../crawling-tools/extract');

const { checkIfAreSimilar } = require('../text-similarity/checker');

async function buildsSctrucutureBasedOnTree(images)
{
    labeledData = []
    
    for (img of images)
    {
        src = await img.evaluate(x => x.src);

        width = await img.evaluate(x => x.naturalWidth);

        height = await img.evaluate(x => x.naturalHeight);
        
        if (width > 100 && height > 100 && ['.jpg', '.jpeg', '.png'].some(ext => src.endsWith(ext)) && src !== "")
        {
            alt = await img.evaluate(x => x.alt);

            let similarText = checkIfAreSimilar(alt);
            if (similarText) {
                labeledData.push({ url: src, breed: similarText });
                continue;
            }

            node = await getParent(img);
            nodeText = await extractTextFromElement(node);

            similarText = checkIfAreSimilar(nodeText);
            if (similarText) {
                labeledData.push({ url: src, breed: similarText });
                continue;
            }

            parent = await getParent(node);
            parentText = await extractTextFromElement(parent);

            similarText = checkIfAreSimilar(parentText);
            if (similarText) {
                labeledData.push({ url: src, breed: similarText });
                continue;
            }

            siblings = await getChilds(parent);

            const foundSome = false;
            for (sibling of siblings)
            {
                siblingText = await extractTextFromElement(sibling);
                
                similarText = checkIfAreSimilar(siblingText);
                if (similarText) {
                    labeledData.push({ url: src, breed: similarText });
                    foundSome = true;
                    continue;
                }
            }

            if (foundSome) continue;

            grandpa = await getParent(parent);
            grandpaText = await extractTextFromElement(grandpa);

            similarText = checkIfAreSimilar(grandpaText);
            if (similarText) {
                labeledData.push({ url: src, breed: similarText });
                continue;
            }

            uncles = await getChilds(grandpa);

            for (uncle of uncles)
            {
                uncleText = await extractTextFromElement(uncle);

                similarText = checkIfAreSimilar(uncleText);
                if (similarText) {
                    labeledData.push({ url: src, breed: similarText });
                    continue;
                }
                
                cousins = await getChilds(uncle);

                for (cousin of cousins)
                {
                    cousinText = await extractTextFromElement(cousin);
                    similarText = checkIfAreSimilar(cousinText);
                    if (similarText) {
                        labeledData.push({ url: src, breed: similarText });
                        continue;
                    }
                }
            }
        }
        else
        {
            continue;
        }
    }

    return labeledData;
}

module.exports = {
    buildsSctrucutureBasedOnTree
};
