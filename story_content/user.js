window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  // --- CONFIGURATION ---

// NEW (your powerful multilingual AI Assistant via railway!)
const API_URL = "https://web-production-e0145d.up.railway.app/ask";

// --- CORE FUNCTION ---
try {
  const player = GetPlayer();
  const userQuestion = player.GetVar("userQuestion");
  
  console.log("User question:", userQuestion);
  
  if (!userQuestion || userQuestion.trim() === "") {
    player.SetVar("aiResponse", "Please type a question in the box above.");
    return;
  }

  // Show loading state immediately
  console.log("Showing loading layer...");
  
  const dataToSend = { question: userQuestion };
  console.log("Sending question to AI:", JSON.stringify(dataToSend));

  // Set a timeout for the fetch request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  fetch(API_URL, {
    method: 'POST',
    headers: {
       'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'any'
    },
    body: JSON.stringify(dataToSend),
    signal: controller.signal
  })
  .then(response => {
    clearTimeout(timeoutId);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Received data from AI:", data);
    
    // Check if we got a valid response
    if (!data || typeof data.answer === 'undefined') {
      throw new Error('Invalid response format from server');
    }
    
    // --- SUCCESS! ---
    console.log("AI Answer:", data.answer);
    
    // 1. Put the answer into the variable
    player.SetVar("aiResponse", data.answer);
    
    // 2. Clear the original question field
    player.SetVar("userQuestion", "");
    
    // 3. Hide loading layer
    console.log("Hiding loading layer...");
    try {
      // Try to hide the loading layer
      player.SetVar("loadingVisible", false); // Use a variable instead of direct layer control
    } catch (layerError) {
      console.warn("Could not hide loading layer:", layerError);
    }
    
    // 4. Set reset trigger to update UI
    player.SetVar("resetTrigger", Math.random());
    
    console.log("Success flow completed");
  })
  .catch(error => {
    clearTimeout(timeoutId);
    console.error("Fetch Error:", error);
    
    let errorMessage = "Sorry, a communication error occurred. Please try again.";
    
    // Provide more specific error messages
    if (error.name === 'AbortError') {
      errorMessage = "Request timed out. Please check your connection and try again.";
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = "Could not connect to the AI service. Please check if the service is running.";
    } else if (error.message.includes('status:')) {
      errorMessage = "The AI service returned an error. Please try again.";
    }
    
    // Set error message
    player.SetVar("aiResponse", errorMessage);
    
    // Hide loading layer on error
    try {
      player.SetVar("loadingVisible", false);
    } catch (layerError) {
      console.warn("Could not hide loading layer on error:", layerError);
    }
    
    // Set reset trigger to update UI
    player.SetVar("resetTrigger", Math.random());
    
    console.log("Error flow completed");
  });

} catch (e) {
  console.error("JavaScript Error:", e);
  
  // Attempt a graceful failure message
  try {
    const player = GetPlayer();
    player.SetVar("aiResponse", "A critical error occurred in the course script. Error: " + e.message);
    player.SetVar("loadingVisible", false);
    player.SetVar("resetTrigger", Math.random());
  } catch (playerError) {
    console.error("Could not set error message:", playerError);
  }
}

}

};
