const { getParent, extractTextFromElement, getNeighbors } = require('../crawling-tools/extract');

const { checkIfAreSimilar } = require('../text-similarity/checker');

const Queue = require("./Queue");

async function buildsSctrucutureBasedOnTree(images, limit) {

    labeledData = []
    
    for (img of images) {

        src = await img.evaluate(x => x.src);

        width = await img.evaluate(x => x.naturalWidth);

        height = await img.evaluate(x => x.naturalHeight);
        
        if (width > 100 && height > 100 && ['.jpg', '.jpeg', '.png'].some(ext => src.endsWith(ext)) && src !== "") {
            alt = await img.evaluate(x => x.alt);

            if (limit == 0) {
                const similarText = checkIfAreSimilar(alt);
                if (similarText) {
                    labeledData.push({ url: src, breed: similarText });
                    continue;
                }
            } else {
                const node = await getParent(img);
                const text = await BFSWithLimit(node, limit);

                if (text) {
                    labeledData.push({ url: src, breed: text });
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

async function BFSWithLimit(initialNode, limit)
{
    const queue = new Queue();
    const visited = [];
    let currentLevel = 0;

    queue.enqueue(initialNode);

    while (!queue.isEmpty())
    {
        if (currentLevel > limit) return null;

        const node = queue.dequeue();

        const text = await extractTextFromElement(node.element);

        const similarText = checkIfAreSimilar(text);
        if (similarText) 
        {
            return similarText;
        }

        visited.push(node.innerHTML);

        const neighbors = await getNeighbors(node.element);

        for (const neighbor of neighbors)
        {
            if (!visited.includes(neighbor.innerHTML))
            {
                queue.enqueue(neighbor);
            }
        }

        currentLevel++;
    }
}

module.exports = {
    buildsSctrucutureBasedOnTree,
};
