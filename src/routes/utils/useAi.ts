import { exec } from 'child_process';
import path from 'path';

/**
 * Python 스크립트를 호출하여 AI 요약 생성
 * @param prompt - 요약할 텍스트
 * @returns 요약된 텍스트 또는 null
 */
export async function generateContentWithGemini(prompt: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.resolve(__dirname, '../../scripts/gemini');

        exec(`python3 ${pythonScriptPath} "${prompt}"`, (error, stdout, stderr) => {
            if (error) {
                console.error("Python Script Error:", error);
                return reject(null);
            }
            if (stderr) {
                console.error("Python Script Stderr:", stderr);
                return reject(null);
            }

            resolve(stdout.trim());
        });
    });
}
