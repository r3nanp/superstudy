import { openai } from "@ai-sdk/openai";
import {
  type Experimental_SpeechResult,
  experimental_generateSpeech as generateSpeech,
} from "ai";

export type SpeechResult = Experimental_SpeechResult;

export const generateAudioFromText = async (text: string) => {
  try {
    const speechModel = openai.speech("gpt-4o-mini-tts");

    const { audio, providerMetadata } = await generateSpeech({
      text,
      model: speechModel,
      voice: "alloy",
      outputFormat: "mp3",
    });

    console.dir(providerMetadata, { depth: null });

    return {
      audio,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
};
