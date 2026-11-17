/**
 * Clean Speech Recognition & Transcript Deduplication Engine
 * Fixes Web Speech API repeating chunk accumulation bug
 * (e.g. "Hello Hello how Hello how are..." -> "Hello, how are you?")
 */

export function cleanRepeatedPhrases(rawText: string): string {
  if (!rawText) return "";

  // 1. Normalize spaces
  const clean = rawText.replace(/\s+/g, " ").trim();
  const words = clean.split(" ");
  if (words.length <= 1) return clean;

  const deduped: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const cur = words[i];
    const prev = deduped[deduped.length - 1];

    // Skip immediate repeated duplicate word (e.g. "Hello Hello" -> "Hello")
    if (prev && cur.toLowerCase() === prev.toLowerCase()) {
      continue;
    }

    // Skip immediate 2-word duplicate phrases (e.g. "how are how are" -> "how are")
    if (
      deduped.length >= 2 &&
      i + 1 < words.length &&
      words[i].toLowerCase() === deduped[deduped.length - 2].toLowerCase() &&
      words[i + 1].toLowerCase() === deduped[deduped.length - 1].toLowerCase()
    ) {
      i++; // Skip the 2-word repetition
      continue;
    }

    deduped.push(cur);
  }

  // Capitalize first letter
  const result = deduped.join(" ");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export interface VoiceRecognitionSession {
  stop: () => void;
  isSupported: boolean;
}

export function startSpeechRecognition({
  onResult,
  onError,
  onEnd,
  lang = "en-US",
}: {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (err: any) => void;
  onEnd?: () => void;
  lang?: string;
}): VoiceRecognitionSession {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { stop: () => {}, isSupported: false };
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    let finalAccumulated = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalAccumulated += (finalAccumulated ? " " : "") + text.trim();
        } else {
          interim += (interim ? " " : "") + text.trim();
        }
      }

      const combined = (finalAccumulated + (interim ? " " + interim : "")).trim();
      const cleaned = cleanRepeatedPhrases(combined);
      onResult(cleaned, event.results[event.results.length - 1]?.isFinal || false);
    };

    recognition.onerror = (event: any) => {
      onError?.(event);
    };

    recognition.onend = () => {
      onEnd?.();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {}
      },
      isSupported: true,
    };
  } catch (err) {
    onError?.(err);
    return { stop: () => {}, isSupported: false };
  }
}

/**
 * Text-to-Speech (TTS) Voice Synthesis for Mentor Voice Dialing
 * Intelligently detects language (Hindi, Hinglish, English) and selects appropriate natural voices
 */
export function speakMentorReply(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  preferredGender: "female" | "male" = "female"
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return () => {};
  }

  window.speechSynthesis.cancel(); // Stop any pending speech

  const cleanText = text
    .replace(/```[\s\S]*?```/g, "Code block omitted.") // skip long code blocks
    .replace(/[*_#`~]/g, "")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500));
  utterance.rate = 1.02;
  utterance.pitch = preferredGender === "female" ? 1.05 : 0.95;

  const isHindi = /[\u0900-\u097F]/.test(cleanText) || /\b(kaise|kya|kyun|haan|nahi|namaste|bhai|theek|sunte|karo|batao|shukriya)\b/i.test(cleanText);

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (isHindi) {
      utterance.lang = "hi-IN";
      const hindiVoice = voices.find(
        (v) => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi") || v.lang.includes("IN")
      );
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      utterance.lang = "en-US";
      // Pick natural matching voice
      const candidate = voices.find(
        (v) =>
          (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Neural")) &&
          v.lang.startsWith("en")
      ) || voices.find((v) => v.lang.startsWith("en"));
      if (candidate) utterance.voice = candidate;
    }
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);

  return () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  };
}
