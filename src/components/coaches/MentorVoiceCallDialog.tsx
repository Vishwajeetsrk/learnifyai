import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import type { MentorRole } from "./mentorData";
import { CuteMentorFace } from "./CuteMentorFace";
import { startSpeechRecognition, speakMentorReply, type VoiceRecognitionSession } from "./speechUtils";
import { careerCoachChat } from "@/lib/career-coach.functions";
import { useServerFn } from "@tanstack/react-start";

interface MentorVoiceCallDialogProps {
  mentor: MentorRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEndCallWithTranscript?: (userText: string, mentorText: string) => void;
}

export function MentorVoiceCallDialog({
  mentor,
  open,
  onOpenChange,
  onEndCallWithTranscript,
}: MentorVoiceCallDialogProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [mentorSpokenText, setMentorSpokenText] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const recognitionSessionRef = useRef<VoiceRecognitionSession | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stopTtsRef = useRef<(() => void) | null>(null);

  const askAi = useServerFn(careerCoachChat);

  // Call Timer
  useEffect(() => {
    if (open) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [open]);

  // Handle Speech Recognition for Voice Dialing
  useEffect(() => {
    if (!open) {
      recognitionSessionRef.current?.stop();
      stopTtsRef.current?.();
      return;
    }

    if (isMuted) {
      recognitionSessionRef.current?.stop();
      return;
    }

    // Start clean speech recognition session
    recognitionSessionRef.current = startSpeechRecognition({
      onResult: (transcript, isFinal) => {
        setLiveTranscript(transcript);

        // When user pauses or finishes a complete sentence:
        if (isFinal && transcript.trim().length > 3 && !isAiThinking && !isAiSpeaking) {
          handleAiVoiceResponse(transcript);
        }
      },
      onError: (err) => {
        console.warn("Voice session input error:", err);
      },
    });

    return () => {
      recognitionSessionRef.current?.stop();
    };
  }, [open, isMuted, isAiThinking, isAiSpeaking]);

  const handleAiVoiceResponse = async (queryText: string) => {
    setIsAiThinking(true);
    try {
      const res = await askAi({
        data: {
          message: queryText,
          mentorId: mentor.id,
          systemPrompt: `You are ${mentor.name}, in a live voice call with the learner. Answer directly, conversationally, concisely (2-3 sentences), warmly, and clearly as spoken dialogue. Do not use markdown code blocks or bullet lists.`,
        },
      });

      const reply = res.content || `I hear you. Let's tackle that together.`;
      setMentorSpokenText(reply);
      setIsAiThinking(false);

      if (!isSpeakerMuted) {
        stopTtsRef.current = speakMentorReply(
          reply,
          () => setIsAiSpeaking(true),
          () => setIsAiSpeaking(false)
        );
      }
    } catch {
      setIsAiThinking(false);
      setMentorSpokenText("I had a brief glitch on the audio line. Could you repeat that?");
    }
  };

  const handleEndCall = () => {
    recognitionSessionRef.current?.stop();
    stopTtsRef.current?.();
    if (liveTranscript || mentorSpokenText) {
      onEndCallWithTranscript?.(liveTranscript, mentorSpokenText);
    }
    onOpenChange(false);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleEndCall()}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-white shadow-2xl">
        {/* Call Ambient Backdrop */}
        <div className="relative p-8 flex flex-col items-center justify-between min-h-[460px] overflow-hidden">
          {/* Subtle Ambient Radial Light */}
          <div
            className="absolute -top-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: mentor.accentHex }}
          />

          {/* Top Status Bar */}
          <div className="relative z-10 w-full flex items-center justify-between text-xs text-slate-300">
            <Badge variant="outline" className="text-[10px] bg-white/10 text-white border-white/20 font-mono">
              ● Voice Dialing HD
            </Badge>
            <div className="font-mono font-bold text-emerald-400">
              {formatSeconds(callDuration)}
            </div>
          </div>

          {/* Center Cute Animated Mentor Face with Audio Rings */}
          <div className="relative z-10 my-6 flex flex-col items-center text-center">
            {/* Audio Pulsing Waves */}
            <div className="relative flex items-center justify-center">
              {isAiSpeaking && (
                <div
                  className="absolute w-36 h-36 rounded-full animate-ping opacity-25 pointer-events-none"
                  style={{ backgroundColor: mentor.accentHex }}
                />
              )}
              {isAiThinking && (
                <div
                  className="absolute w-32 h-32 rounded-full border-2 border-dashed border-amber-400 animate-spin pointer-events-none"
                />
              )}

              <CuteMentorFace
                mentor={mentor}
                size="xl"
                isInteractive
                isSpeaking={isAiSpeaking}
                expression={isAiThinking ? "thinking" : isAiSpeaking ? "talking" : "happy"}
              />
            </div>

            <h3 className="text-xl font-bold mt-4 text-white">{mentor.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{mentor.title}</p>
            <p className="text-[11px] font-mono mt-1 text-emerald-400">
              {isAiSpeaking ? "Speaking..." : isAiThinking ? "Formulating guidance..." : isMuted ? "Mic Muted" : "Listening..."}
            </p>
          </div>

          {/* Live Deduplicated Transcript Display Box */}
          <div className="relative z-10 w-full max-h-32 overflow-y-auto p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
            {liveTranscript ? (
              <div className="text-slate-200">
                <span className="font-bold text-indigo-400">You: </span>
                <span>{liveTranscript}</span>
              </div>
            ) : (
              <div className="text-slate-500 italic text-[11px] text-center">
                Speak into your microphone. Transcription is active and deduplicated.
              </div>
            )}

            {mentorSpokenText && (
              <div className="text-slate-200 pt-1 border-t border-white/10">
                <span className="font-bold text-emerald-400">{mentor.name}: </span>
                <span>{mentorSpokenText}</span>
              </div>
            )}
          </div>

          {/* Bottom Call Action Buttons */}
          <div className="relative z-10 flex items-center gap-4 mt-6">
            {/* Mute Mic */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              type="button"
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95"
              title="End Voice Call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            {/* Speaker Toggle */}
            <button
              type="button"
              onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isSpeakerMuted
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}
              title={isSpeakerMuted ? "Unmute Speaker" : "Mute Speaker"}
            >
              {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MentorVoiceCallDialog;
