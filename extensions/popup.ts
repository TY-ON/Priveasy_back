document.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('result');
  
    chrome.storage.local.get(['aiResult'], (data) => {
      if (data.aiResult) {
        resultContainer!.textContent = data.aiResult;
      } else {
        resultContainer!.textContent = 'No result available.';
      }
    });
  });
  