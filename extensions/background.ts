
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "foundPrivacyLink" && message.url) {
      fetch('http://localhost:3000/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: message.url }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Processed Data:', data);
        })
        .catch((error) => console.error('Error:', error));
    }
  });
  