




import sys
import google.generativeai as genai

# Google API 설정
GOOGLE_API_KEY = "AIzaSyCTa7RhI97kS3Cf2mVk5tzlXKyvsxss8l0"  # 🔹 Google Cloud에서 발급한 API 키 입력
genai.configure(api_key=GOOGLE_API_KEY)

def generate_content_with_gemini(prompt):
    """
    Google Gemini API를 사용하여 프롬프트 기반의 AI 응답을 생성하는 함수.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')

        # AI 모델에게 요청
        response = model.generate_content(prompt)

        # 응답 반환
        return response.text.strip()
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    # 🔹 TypeScript에서 실행된 경우 (sys.argv[1]을 통해 자동 입력)
    if len(sys.argv) > 1:
        prompt = sys.argv[1]
        result = generate_content_with_gemini(prompt)
        print(result)  # TypeScript가 결과를 읽을 수 있도록 출력
        sys.exit(0)

    # 🔹 직접 실행할 경우 (기존 input() 유지)
    print("Google Gemini 콘텐츠 생성 서비스")
    print("종료하려면 'exit'를 입력하세요.")
    
    while True:
        # 사용자 입력 받기
        prompt = input("\n질문 입력: ").strip()
        
        if prompt.lower() == 'exit':
            print("서비스를 종료합니다.")
            break
        
        # Gemini API로 콘텐츠 생성
        content = generate_content_with_gemini(prompt)
        
        if content:
            print(f"생성된 콘텐츠: {content}")
        else:
            print("콘텐츠 생성에 실패했습니다.")
