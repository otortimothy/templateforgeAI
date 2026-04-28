const https = require('https');

https.get('https://openrouter.ai/api/v1/models', (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    const json = JSON.parse(data);
    const freeModels = json.data.filter(m => m.pricing.prompt === "0" && m.pricing.completion === "0" && m.id.includes('free'));
    console.log("Free models with ':free' in ID:");
    freeModels.forEach(m => console.log(m.id));
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
