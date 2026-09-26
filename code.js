async function perform() {
  // Get the inputs
  let input = document.getElementById("file").files[0];
  // Run the process
  document.getElementById("output").textContent = "Processing...";
  let output = await process(input);
  // Handle the output
  let converter = new showdown.Converter();
  let html = converter.makeHtml(output);
  document.getElementById("output").innerHTML = html;
}
async function process(file) {
  let url = `https://generativelanguage.googleapis.com/v1beta/interactions`;
  let model = "gemini-3.1-flash-lite";
  let key = document.getElementById("key").value;
  //let model = "gemini-3.8-flash-lite-tts";
  //let model = "gemini-3.7-flash";
  let body = {
    model: model,
    input: [{
      type: "text",
      text: "Provide two multiple choice questions about the content of the attached file. Each question should have three answer options. Each answer option should be on a new line. Include the answer, and a brief explanation.",
    },{
      type: "document",
      mime_type: "application/pdf",
      data: await fileToBase64(file),
    }],
    //system_instruction: "",
    generation_config: {
      temperature: 1.5,
      thinking_level: "minimal",
      //thinking_summaries: "auto",
    },
    /*
    tools: [{
      type: "google_search"
    }]
    */
  };
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify(body)
    });
    let data = await response.json();
    return data.steps[1].content[0].text;
  }
  catch (error) {
    return error;
  }
}
async function fileToBase64(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
  })
};