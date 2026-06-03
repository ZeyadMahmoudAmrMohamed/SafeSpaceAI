import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { transcribeAudio } from "@/lib/transcribe.functions";

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read audio recording."));
    reader.onloadend = () => {
      const value = String(reader.result ?? "");
      resolve(value.includes(",") ? value.split(",")[1] : value);
    };
    reader.readAsDataURL(blob);
  });
}

function getBestMimeType() {
  const options = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/wav",
  ];
  return options.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function getErrorName(error: unknown) {
  return error instanceof DOMException ? error.name : "";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "";
}

/**
 * Server-backed speech-to-text. This avoids the browser SpeechRecognition
 * service, which can fail with unrecoverable "network" errors on some devices.
 */
export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const transcribe = useServerFn(transcribeAudio);

  useEffect(() => {
    setSupported(!!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined");
  }, []);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      try {
        recorderRef.current?.stop();
      } catch {
        // Recorder may already be stopped during unmount.
      }
      cleanup();
    };
  }, [cleanup]);

  const finishRecording = useCallback(async () => {
    setListening(false);
    setTranscribing(true);
    try {
      const mimeType = recorderRef.current?.mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      chunksRef.current = [];

      if (blob.size < 800) {
        setError("I couldn't hear enough audio. Please try speaking a little longer.");
        return;
      }

      const audioBase64 = await blobToBase64(blob);
      const result = await transcribe({ data: { audioBase64, mimeType } });
      if (result.text) setTranscript(result.text);
      else setError("I couldn't detect speech in that recording. Please try again.");
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Voice input could not be transcribed. Please try again.");
    } finally {
      setTranscribing(false);
      cleanup();
    }
  }, [cleanup, transcribe]);

  const start = useCallback(async () => {
    if (!supported) {
      setError("Voice input isn't supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }

    setError(null);
    setTranscript("");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getBestMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      streamRef.current = stream;
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = finishRecording;
      recorder.start();
      setListening(true);
    } catch (err: unknown) {
      cleanup();
      const errorName = getErrorName(err);
      if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
        setError(
          "Microphone access blocked. Allow microphone in your browser settings and try again.",
        );
      } else if (errorName === "NotFoundError") {
        setError("No microphone detected.");
      } else {
        setError(getErrorMessage(err) || "Could not start voice input. Try again.");
      }
      setListening(false);
    }
  }, [cleanup, finishRecording, supported]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    } else {
      setListening(false);
      cleanup();
    }
  }, [cleanup]);

  return { listening, transcribing, transcript, supported, error, start, stop };
}
