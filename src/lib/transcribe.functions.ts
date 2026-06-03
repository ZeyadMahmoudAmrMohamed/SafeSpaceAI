import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TranscribeInput = z.object({
  audioBase64: z.string().min(1).max(10_000_000),
  mimeType: z.string().min(1).max(100),
});

function extensionForMime(mimeType: string) {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("mpeg")) return "mp3";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}

function decodeBase64(base64: string) {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator(TranscribeInput)
  .handler(async ({ data }) => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing.");
    }

    const bytes = decodeBase64(data.audioBase64);

    const file = new Blob([bytes], {
      type: data.mimeType,
    });

    const formData = new FormData();

    formData.append(
      "file",
      file,
      `audio.${extensionForMime(data.mimeType)}`
    );

    formData.append("model", "whisper-large-v3");

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const result = await response.json();

    return {
      text: (result.text ?? "").trim(),
    };
  });