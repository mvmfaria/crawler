const { getParent, extractTextFromElement, getNeighbors } = require('../crawling-tools/extract');

const { checkIfAreSimilar } = require('../text-similarity/checker');

const Queue = require("./Queue");

/**
 * Labels images based on graphs.
 * 
 * @param {Array} images - The array of images to be labeled.
 * @param {number} limit - The limit for the breadth-first search.
 * @param {string} page - The page link.
 * @returns {Array} - The labeled data.
 */
async function LabelsImagesBasedOnGraphs(images, limit, page) {

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
                const result = await BFSWithLimit(node, limit);

                if (result) {
                    labeledData.push({ breed: result.label, url: src, level: result.level, page: page });
                }
            }
        }
        else {
            continue;
        }
    }

    return labeledData;
}

/**
 * Performs a breadth-first search (BFS) on a tree structure with a limit on the number of levels to traverse.
 * 
 * @param {Node} initialNode - The initial node to start the search from.
 * @param {number} limit - The maximum number of levels to traverse.
 * @returns {Promise<Object|null>} - A promise that resolves to an object containing information about the found node, or null if no matching node is found within the specified limit.
 */
async function BFSWithLimit(initialNode, limit) {
    const queue = new Queue();
    const visited = [];
    let currentLevel = 0;

    queue.enqueue(initialNode);

    while (!queue.isEmpty()) {
        if (currentLevel > limit) return null;

        const node = queue.dequeue();

        const text = await extractTextFromElement(node.element);

        const similarText = checkIfAreSimilar(text);
        if (similarText) {
            return { label: similarText, level: currentLevel }
        }

        visited.push(node.innerHTML);

        const neighbors = await getNeighbors(node.element);

        for (const neighbor of neighbors) {
            if (!visited.includes(neighbor.innerHTML)) {
                queue.enqueue(neighbor);
            }
        }

        currentLevel++;
    }
}

module.exports = {
    LabelsImagesBasedOnGraphs,
};
