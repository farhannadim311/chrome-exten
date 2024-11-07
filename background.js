chrome.tabs.onUpdated.addListener((tabID, tab) => {
  // Check if the URL exists and contains "youtube.com/watch"
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    // Split the URL at "?" to get query parameters
    const queryParameters = tab.url.split("?")[1];
    // Parse the query parameters
    const urlParameters = new URLSearchParams(queryParameters);
    console.log(urlParameters)
    // Send a message to the content script in the current tab
    chrome.tabs.sendMessage(tabID, {
      type: "NEW", // Message type indicating a new YouTube video
      videoID: urlParameters.get("v"), // Extract the video ID from URL parameters
    });
  }
});
