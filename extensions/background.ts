chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'foundPrivacyLink' && message.url) {
      fetch('http://localhost:3000/api/Crawl_Pasrse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: message.url }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('AI Processed Result:', data.aiResult);
          // 결과를 Content Script나 팝업으로 전달 가능
        })
        .catch((error) => console.error('Error:', error));
    }
  });
  