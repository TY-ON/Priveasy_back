chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'privacyPolicyDetected') {
      console.log('Detected Privacy Policy Link:', message.policyLink);
      console.log('From Page:', message.url);
  
      // 필요 시 서버로 전송
      fetch('http://localhost:3000/api/findPolicy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: message.url,
          policyLink: message.policyLink,
        }),
      })
        .then(response => response.json())
        .then(data => console.log('Server Response:', data))
        .catch(error => console.error('Error:', error));
    }
  
    sendResponse({ status: 'received' });
    return true; // 비동기 응답을 위한 true 반환
  });
  