async function perform() {
  let input1 = document.getElementById("input1").value;
  let input2 = document.getElementById("input2").value;
  let input3 = document.getElementById("input3").files[0];
  let output = await process(input1, input2, input3);
  document.getElementById("output").innerText = output;
}
async function process(x, y, z) {
  let output = await callGemini();
  return output;
}
async function callGemini() {
  const apiKey = "AQ.Ab8RN6I8wyO4DxrWWxEjLWk1sa0FvZiv4M8S5BfFawWq7wqZvw";
  const url = "https://googleapis.com";
  const requestBody = {
    contents: [
      {
        parts: [
          {text: "Explain quantum computing in one sentence."}
        ]
      }
    ]
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "mode": "no-cors",
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    const outputText = data.candidates[0].content.parts[0].text;
    return outputText;
  }
  catch (error) {
    return error;
  }
}
/*
  gemini-2.5-flash
  
*/