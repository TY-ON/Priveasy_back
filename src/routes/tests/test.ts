import { crawlPrivacy } from "../utils/crawl"; // 크롤링 함수 경로 확인 필요

(async () => {
  const testUrl = "https://www.naver.com"; // 테스트할 웹사이트의 URL로 변경

  console.log(`🔍 크롤링 테스트: ${testUrl}`);
  const result = await crawlPrivacy(testUrl);

  if (result !== "failed") {
    console.log("✅ 개인정보처리방침 크롤링 성공!");
    console.log(result); // HTML 일부 출력 (최대 500자)
  } else {
    console.error("❌ 개인정보처리방침 크롤링 실패!");
  }
})();
