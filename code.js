async function run() {
  let file = document.getElementById("file").files[0];
  let fileURL = await fileToDataURL(file);
  let key = window.prompt("What is your API key?");
  document.getElementById("preview").src = fileURL.url;
  document.getElementById("output").textContent = "Processing...";
  let url = `https://generativelanguage.googleapis.com/v1beta/interactions`;
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      model: "gemini-3.1-flash-lite",
      input: [{
        type: "text",
        text: `
          How could I improve the attached data visualisation?
          Give me the three most important improvements.
          Use one paragraph for each improvement, with two sentences per paragraph.
          In the first sentence, give the improvement in bold.
          In the second sentence, give the reason.
        `,
      },{
        type: "document",
        mime_type: fileURL.mimeType,
        data: fileURL.data,
      }],
    })
  });
  let data = await response.json();
  let text = data.steps[1].content[0].text;
  let converter = new showdown.Converter();
  document.getElementById("output").innerHTML = converter.makeHtml(text);
}
function fileToDataURL(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = () => {
      let url = reader.result;
      let mimeType = url.split(";")[0].split(":")[1].trim();
      let data = url.split(",")[1];
      resolve({url, mimeType, data});
    };
    reader.readAsDataURL(file);
  })
};