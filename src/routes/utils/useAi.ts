import axios from 'axios';

/**
 * Flask 서버에 AI 요약 요청
 * @param privacyText - 개인정보처리방침 텍스트
 * @returns 요약된 텍스트
 */
export async function generateContentWithGemini(privacyText: string): Promise<string | null> {
    try {
        const response = await axios.post('http://Priveasy_AI:5001/summarize', { privacyText });
        //main.py에 post method 지정


        if (response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Flask AI Summarization Error:", error);
        return null;
    }
}
