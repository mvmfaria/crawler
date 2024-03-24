async function returnLabeledDataBasedOnTextSimilarities(data, references)
{
  const regex = new RegExp(references.join("|"), "i");
  
  labeledData  = []

  for (element of data)
  {
    src = element['img.src'];

    alt = element['img.alt'];
    match = alt.match(regex);
    if (match)
    {
      labeledData.push({url: src, name: match[0]});
      continue;
    }

    node = element["node.textContent"]
    match = node.match(regex);
    if (match)
    {
      labeledData.push({url: src, name: match[0]});
      continue;
    }

    parent = element["parent.textContent"]
    match = parent.match(regex);
    if (match)
    {
      labeledData.push({url: src, name: match[0]});
      continue;
    }

    siblings = element["siblings"]
    for (sibling of siblings)
    {
      sibling = sibling["sibling.textContent"]
      match = sibling.match(regex);
      if (match)
      {
        labeledData.push({url: src, name: match[0]});
        continue;
      }
    }
    
    grandpa = element["grandpa.textContent"]
    match = grandpa.match(regex);
    if (match)
    {
      labeledData.push({url: src, name: match[0]});
      continue;
    }

    uncles = element["uncles"]
    for (uncle of uncles)
    {
      uncle = uncle["uncle.textContent"]
      match = uncle.match(regex);
      if (match)
      {
        labeledData.push({url: src, name: match[0]});
        continue;
      }
    }
  }

  return labeledData;
}

module.exports = {
  returnLabeledDataBasedOnTextSimilarities,
};