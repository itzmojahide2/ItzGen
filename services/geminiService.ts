import { GoogleGenAI, Modality } from '@google/genai';
import { fileToBase64, fileToMimeType } from '../utils/fileUtils';
import { SwitchMode } from '../types';

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export type ImageQuality = 'Standard' | '720p' | '1080p' | '2K' | '4K';

export const generateImage = async (
  prompt: string,
  style: string,
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4',
  quality: ImageQuality,
  referenceImage?: File | null
): Promise<string> => {
  const ai = getAi();
  
  const qualityPrompts: Record<ImageQuality, string> = {
      'Standard': '',
      '720p': ', HD quality, 720p',
      '1080p': ', Full HD, 1080p, high quality',
      '2K': ', 2K resolution, highly detailed',
      '4K': ', 4K resolution, ultra-high definition, photorealistic, extremely detailed',
  };

  if (referenceImage) {
    const base64Image = await fileToBase64(referenceImage);
    const mimeType = fileToMimeType(referenceImage);

    let referencePrompt = `Using the provided image as a reference, generate a new image based on the following instructions: "${prompt}". The final image must have an aspect ratio of ${aspectRatio}.`;
    referencePrompt += ` The desired style is ${style}${qualityPrompts[quality]}.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType: mimeType } },
                { text: referencePrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error('Image generation with reference failed.');

  } else {
    const fullPrompt = `${prompt}, ${style} style${qualityPrompts[quality]}`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error('Image generation failed.');
  }
};

export const editImageWithSwitch = async (
    image1: File,
    image2: File,
    prompt: string,
    mode: SwitchMode,
    quality: ImageQuality
): Promise<string> => {
    const ai = getAi();
    
    const base64Image1 = await fileToBase64(image1);
    const mimeType1 = fileToMimeType(image1);
    const base64Image2 = await fileToBase64(image2);
    const mimeType2 = fileToMimeType(image2);

    const qualityPrompts: Record<ImageQuality, string> = {
        'Standard': '',
        '720p': ', HD quality, 720p',
        '1080p': ', Full HD, 1080p, high quality',
        '2K': ', 2K resolution, highly detailed',
        '4K': ', 4K resolution, ultra-high definition, photorealistic, extremely detailed',
    };
    
    let fullPrompt = `Base image is the first one, user image is the second. `;
    switch (mode) {
        case SwitchMode.Face:
            fullPrompt += `Perform a face switch. Take the face from the user image and apply it to the character in the base image. Maintain the style and background of the base image.`;
            break;
        case SwitchMode.Background:
            fullPrompt += `Keep the main subject from the base image and replace its background with the background from the user image.`;
            break;
        case SwitchMode.Merge:
            fullPrompt += `Creatively merge the base image and the user image. Blend their styles, subjects, and backgrounds into a cohesive new image.`;
            break;
        case SwitchMode.Style:
            fullPrompt += `Apply the artistic style from the user image to the base image. The content of the base image should remain, but rendered in the new style.`;
            break;
        case SwitchMode.Thumbnail:
            fullPrompt += `Analyze the second image for its thumbnail design elements (e.g., bold colors, high contrast, eye-catching composition). Recreate the first base image, applying the captured thumbnail style to make it a compelling and clickable thumbnail.`;
            break;
        case SwitchMode.All:
            fullPrompt += `Perform a comprehensive 'all switch'. Intelligently merge every aspect of the base image (first) and the user image (second). Combine their subjects, backgrounds, color palettes, textures, and overall artistic concepts into a single, coherent, and novel image.`;
            break;
    }
    if (prompt) {
        fullPrompt += ` Additional instructions: ${prompt}`;
    }

    fullPrompt += qualityPrompts[quality];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64Image1, mimeType: mimeType1 } },
                { inlineData: { data: base64Image2, mimeType: mimeType2 } },
                { text: fullPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error('Image editing failed.');
}