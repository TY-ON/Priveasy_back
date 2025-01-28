(() => {
    // 정규식: "개인정보처리방침"과 유사한 텍스트를 찾기 위한 패턴
    const privacyPolicyRegex = /개인.*정보.*처리.*방침/;
  
    /**
     * 푸터 영역에서 "개인정보처리방침" 링크를 검색
     * @returns {string | null} 찾은 링크의 href (없으면 null)
     */
    function findLinkInFooter(): string | null {
      const footer = document.querySelector("footer"); // <footer> 태그 선택
      if (!footer) return null; // 푸터가 없으면 null 반환
  
      const links = footer.querySelectorAll<HTMLAnchorElement>("a[href]"); // href 속성이 있는 링크만 선택
      for (const link of links) {
        if (privacyPolicyRegex.test(link.textContent || "")) {
          return link.href; // 찾은 링크 반환
        }
      }
      return null; // 푸터 내에서 링크를 찾지 못한 경우
    }
  
    /**
     * 전체 페이지에서 "개인정보처리방침" 링크를 검색
     * @returns {string | null} 찾은 링크의 href (없으면 null)
     */
    function findLinkInPage(): string | null {
      const links = document.querySelectorAll<HTMLAnchorElement>("a[href]"); // href 속성이 있는 링크만 선택
      for (const link of links) {
        if (privacyPolicyRegex.test(link.textContent || "")) {
          return link.href; // 찾은 링크 반환
        }
      }
      return null; // 페이지에서 링크를 찾지 못한 경우
    }
  
    // 링크 검색 실행
    const privacyLink = findLinkInFooter() || findLinkInPage(); // 푸터 → 전체 페이지 순서로 검색
  
    // 링크를 찾았을 경우 Background Script로 메시지 전달
    if (privacyLink) {
      chrome.runtime.sendMessage({ action: "foundPrivacyLink", url: privacyLink });
    } else {
      console.log("Privacy policy link not found on this page.");
    }
  })();
  