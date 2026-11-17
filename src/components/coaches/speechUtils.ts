/**
 * Clean Speech Recognition, Multi-Language Voice Engine & Acoustic Bass Synthesizer
 * Fixes repeating chunks, detects spoken languages, and synthesizes acoustic bass feedback.
 */

// Shared AudioContext for acoustic bass feedback
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a warm, tactile acoustic bass pulse for message arrivals, speaking cues, or thinking states.
 * Uses pure Web Audio API - zero external assets or network requests.
 */
export function playBassPulse(type: "message" | "speaking" | "haptic" = "message") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(280, ctx.currentTime);

    const now = ctx.currentTime;

    if (type === "message") {
      // Warm resonant bass thud
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.16);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } else if (type === "speaking") {
      // Soft gentle vocal onset pulse
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } else {
      // Subtle tactile click/tap
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (err) {
    // Non-critical audio error, degrade silently
  }
}

/**
 * Clean Web Speech API repeated accumulated tokens
 * (e.g. "Hello Hello how how are" -> "Hello, how are")
 */
export function cleanRepeatedPhrases(rawText: string): string {
  if (!rawText) return "";

  const clean = rawText.replace(/\s+/g, " ").trim();
  const words = clean.split(" ");
  if (words.length <= 1) return clean;

  const deduped: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const cur = words[i];
    const prev = deduped[deduped.length - 1];

    if (prev && cur.toLowerCase() === prev.toLowerCase()) {
      continue;
    }

    if (
      deduped.length >= 2 &&
      i + 1 < words.length &&
      words[i].toLowerCase() === deduped[deduped.length - 2].toLowerCase() &&
      words[i + 1].toLowerCase() === deduped[deduped.length - 1].toLowerCase()
    ) {
      i++;
      continue;
    }

    deduped.push(cur);
  }

  const result = deduped.join(" ");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Intelligent Language Detector
 * Identifies if text is Hindi/Hinglish, Spanish, French, German, Japanese, Tamil, Telugu, etc.
 */
export function detectLanguage(text: string): { langCode: string; langName: string; isNonEnglish: boolean } {
  if (!text) return { langCode: "en-US", langName: "English", isNonEnglish: false };

  // Devanagari script (Hindi, Marathi, Sanskrit)
  if (/[\u0900-\u097F]/.test(text)) {
    return { langCode: "hi-IN", langName: "Hindi", isNonEnglish: true };
  }

  // Hinglish common marker words
  const hinglishPatterns = /\b(kaise|kya|kyun|haan|nahi|namaste|bhai|theek|sunte|karo|batao|shukriya|boliye|mujhe|aap|accha|samjha|karenge|sikhao)\b/i;
  if (hinglishPatterns.test(text)) {
    return { langCode: "hi-IN", langName: "Hinglish", isNonEnglish: true };
  }

  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return { langCode: "ta-IN", langName: "Tamil", isNonEnglish: true };
  }

  // Telugu script
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return { langCode: "te-IN", langName: "Telugu", isNonEnglish: true };
  }

  // Japanese (Hiragana/Katakana/Kanji)
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) {
    return { langCode: "ja-JP", langName: "Japanese", isNonEnglish: true };
  }

  // Spanish markers
  if (/[¿¡]|\b(hola|cómo|estás|gracias|por favor|buenos días|amigo|quiero)\b/i.test(text)) {
    return { langCode: "es-ES", langName: "Spanish", isNonEnglish: true };
  }

  // French markers
  if (/\b(bonjour|merci|comment|s'il vous plaît|salut|pourquoi|oui)\b/i.test(text)) {
    return { langCode: "fr-FR", langName: "French", isNonEnglish: true };
  }

  // German markers
  if (/\b(hallo|guten|danke|bitte|wie geht's|warum|tschuess)\b/i.test(text)) {
    return { langCode: "de-DE", langName: "German", isNonEnglish: true };
  }

  return { langCode: "en-US", langName: "English", isNonEnglish: false };
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
 * Intelligently matches the user's spoken language and voice characteristics
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

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/```[\s\S]*?```/g, "Code block omitted.")
    .replace(/[*_#`~]/g, "")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500));
  utterance.rate = 1.02;
  utterance.pitch = preferredGender === "female" ? 1.05 : 0.95;

  const detected = detectLanguage(cleanText);
  utterance.lang = detected.langCode;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    // Attempt exact language code match first
    const langPrefix = detected.langCode.split("-")[0];
    const matchingVoice =
      voices.find((v) => v.lang === detected.langCode) ||
      voices.find((v) => v.lang.startsWith(langPrefix)) ||
      voices.find(
        (v) =>
          (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Neural")) &&
          v.lang.startsWith("en")
      ) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
  }

  utterance.onstart = () => {
    playBassPulse("speaking");
    onStart?.();
  };
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);

  return () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  };
}
