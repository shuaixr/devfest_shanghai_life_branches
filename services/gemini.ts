import { GoogleGenAI } from "@google/genai";
import { Era, EraConfig } from '../types';
import { ERA_CONFIGS, MOCK_IMAGES } from '../constants';

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (apiKey && apiKey !== 'demo') {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  // Generate image using specified Gemini model
  async generateImage(prompt: string, imageBase64: string, era: Era, model: string = 'gemini-2.5-flash-image'): Promise<string> {
    if (!this.ai || this.apiKey === 'demo') {
      await new Promise(r => setTimeout(r, 2000)); // Fake delay
      return MOCK_IMAGES[era] || "https://picsum.photos/400/500";
    }

    try {
      // Strip the header if present (e.g., "data:image/jpeg;base64,")
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

      const response = await this.ai.models.generateContent({
        model: model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            },
            { text: prompt }
          ]
        },
        config: {
           // Optional: specific configs for image models if needed
        }
      });

      // Iterate to find image
      const candidates = response.candidates;
      if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
           if (part.inlineData && part.inlineData.data) {
             return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
           }
        }
      }
      throw new Error("No image generated");
    } catch (error: any) {
      console.error("Gemini Image Gen Error:", error);
      throw new Error(error.message || "Image generation failed");
    }
  }

  // Generate caption using gemini-2.5-flash
  async generateCaption(eraConfig: EraConfig): Promise<string> {
    if (!this.ai || this.apiKey === 'demo') {
      await new Promise(r => setTimeout(r, 500));
      const mocks: Record<string, string> = {
        '1890': "洋船入港，这大清的天下，终究是变了。",
        '1930': "繁花落尽，唯有这杯酒与旧梦同在。",
        '1990': "遍地是机会，只要敢拼，这外滩就是我的。",
        '2025': "在这座不夜城，每一个梦想都值得被看见。",
        '2050': "肉体只是载体，数据才是永恒的灵魂。",
        '2100': "星河浩瀚，上海已是旧日传说，前方是无尽深空。"
      };
      return mocks[eraConfig.year] || "上海，无限可能。";
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: eraConfig.captionPrompt,
        config: {
          maxOutputTokens: 50,
          temperature: 0.7,
        }
      });
      return response.text?.trim() || "上海人生分支 - 身份生成完毕";
    } catch (error) {
      console.error("Caption Gen Error:", error);
      return "上海人生分支 - 身份生成完毕";
    }
  }
}