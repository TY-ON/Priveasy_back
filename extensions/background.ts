chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 1. 메시지가 "foundPrivacyLink" 액션이고 URL이 있을 경우 처리
    if (message.action === 'foundPrivacyLink' && message.url) {
      console.log(`Processing URL: ${message.url}`);
  
      // 2. Next.js API 호출
      fetch('http://localhost:3000/api/Crawl_Parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: message.url }), // 전달받은 URL을 API로 전송
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // JSON 응답 처리
        })
        .then((data) => {
          console.log('AI Processed Result:', data.aiResult);
  
          // 3. 결과를 Content Script 또는 팝업 UI로 전달
          if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              action: 'displayAIResult',
              result: data.aiResult,
            });
          }
  
          // 4. 결과를 chrome.storage에 저장 (팝업 UI에서 활용 가능)
          chrome.storage.local.set({ aiResult: data.aiResult }, () => {
            console.log('Result saved to chrome.storage');
          });
        })
        .catch((error) => {
          console.error('Error during API call:', error);
  
          // 에러 메시지를 Content Script 또는 팝업 UI로 전달
          if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              action: 'displayError',
              error: 'Failed to process the privacy policy.',
            });
          }
        });
    } else {
      console.warn('Invalid message received:', message);
    }
  });
  