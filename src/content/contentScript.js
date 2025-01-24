(() => {
    console.log('Content Script loaded');
  
    // Footer와 모든 a 태그에서 탐색
    const links = document.querySelectorAll('footer a, a');
    let privacyLink = null;
  
    links.forEach(link => {
      if (
        link.textContent.includes('개인정보처리방침') ||
        link.textContent.toLowerCase().includes('privacy policy')
      ) {
        privacyLink = link.href;
      }
    });
  
    if (privacyLink) {
      console.log('Privacy Policy Link Found:', privacyLink);
  
      // Background Script로 메시지 전송
      chrome.runtime.sendMessage({
        type: 'privacyPolicyDetected',
        url: window.location.href,
        policyLink: privacyLink,
      });
    } else {
      console.log('No Privacy Policy Link Found');
    }
  })();
  