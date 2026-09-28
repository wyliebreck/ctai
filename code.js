async function run() {
  let file = document.getElementById("file").files[0];
  let key = window.prompt("What is your API key?");
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
        text: "
          Provide two multiple choice questions about the content of the attached file.
          Each question should have three answer options.
          Each answer option should be on a new line.
          Include the answer, and a brief explanation.
        ",
      },{
        type: "document",
        mime_type: "application/pdf",
        data: await fileToBase64String(file),
      }],
    })
  });
  let data = await response.json();
  let text = data.steps[1].content[0].text;
  let converter = new showdown.Converter();
  document.getElementById("output").innerHTML = converter.makeHtml(text);
}
function fileToBase64String(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
  })
};
