//Global variables.
let result = "";

// const fetchResults = async () => {
//   const response = await fetch('http://localhost:3333/results')
//   const results = await response.json()
//   return results;
// };

//Execute crawler.
document.getElementById('link-button').addEventListener('click', async () => {
  const url = document.getElementById('link-input').value;
  document.getElementById("loading-text").innerHTML = "Em alguns instantes já será possível fazer o download do arquivo."

  document.getElementById('download-button').disabled = true;

  const response = await fetch('http://localhost:3333/results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  result = await response.json();
  document.getElementById('download-button').disabled = false;
  document.getElementById("loading-text").innerHTML = "Extração concluída!"
});

//Download a json file with content provide by crawler.
document.getElementById('download-button').addEventListener('click', () => {

  console.log("O arquivo já pode ser baixado.")
  
  const jsonData = JSON.stringify(result, null, " ");

  const blob = new Blob([jsonData], { type: 'application/json' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'resultado.json';
  a.click();

  URL.revokeObjectURL(url);
})