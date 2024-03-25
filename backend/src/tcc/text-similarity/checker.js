async function returnLabeledDataBasedOnTextSimilarities(data, references) {
  const regex = new RegExp(references.join("|"), "i");
  let labeledData = [];

  for (const element of data) {
    const src = element['img.src'];
    const alt = element['img.alt'];

    let match = alt.match(regex);
    if (match) {
      labeledData.push({ url: src, name: match[0] });
      continue;
    }

    const node = element["node.textContent"];
    match = node.match(regex);
    if (match) {
      labeledData.push({ url: src, name: match[0] });
      continue;
    }

    const parent = element["parent.textContent"];
    match = parent.match(regex);
    if (match) {
      labeledData.push({ url: src, name: match[0] });
      continue;
    }

    const siblings = element["siblings"];
    for (const sibling of siblings) {
      const siblingText = sibling["sibling.textContent"];
      match = siblingText.match(regex);
      if (match) {
        labeledData.push({ url: src, name: match[0] });
        continue;
      }
    }

    const grandpa = element["grandpa.textContent"];
    match = grandpa.match(regex);
    if (match) {
      labeledData.push({ url: src, name: match[0] });
      continue;
    }

    const uncles = element.uncles;
    for (const uncle of uncles) {
      const uncleText = uncle["uncle.textContent"];
      match = uncleText.match(regex);
      if (match) {
        labeledData.push({ url: src, name: match[0] });
        continue;
      }

      const cousins = uncle.cousins;
      for (const cousin of cousins) {
        const cousinText = cousin["cousin.textContent"];
        match = cousinText.match(regex);
        if (match) {
          labeledData.push({ url: src, name: match[0] });
          continue;
        }
      }
    }
  }

  return labeledData;
}

module.exports = {
  returnLabeledDataBasedOnTextSimilarities,
};