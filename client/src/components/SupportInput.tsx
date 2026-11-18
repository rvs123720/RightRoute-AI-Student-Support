import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Shield, Sparkles, Mic, MicOff } from 'lucide-react';

interface SupportInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  initialMessage?: string;
}

const EXAMPLE_PROMPTS = [
  {
    id: 1,
    title: 'Exams & Concentration',
    text: "I'm feeling overwhelmed by exams and I'm struggling to concentrate.",
  },
  {
    id: 2,
    title: 'Tuition & Financial Help',
    text: "I'm worried about paying my tuition fees and I don't know what financial help is available.",
  },
  {
    id: 3,
    title: 'Internships & Careers',
    text: "I'm looking for internships and I need help preparing for placements.",
  },
];

const MAX_CHAR_LIMIT = 1200;

export const SupportInput: React.FC<SupportInputProps> = ({
  onSubmit,
  isLoading,
  initialMessage = '',
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceCompleted, setVoiceCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = message.trim();

    if (!trimmed) {
      setValidationError(
        'Please share a few words about what you are experiencing.'
      );
      return;
    }

    setValidationError(null);
    onSubmit(trimmed);
  };

  const handleSelectExample = (exampleText: string) => {
    setMessage(exampleText);
    setValidationError(null);
  };

  const handleVoiceToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        'Voice input isn’t supported in this browser. You can still type your concern.'
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    setInterimTranscript('');
    setVoiceCompleted(false);
    setVoiceError(null);

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);

      if (final.trim()) {
        setMessage((prev) => {
          const existing = prev.trim();

          if (!existing) {
            return final.trim();
          }

          return `${existing} ${final.trim()}`;
        });

        setVoiceCompleted(true);
        setValidationError(null);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);

      if (event?.error === 'not-allowed') {
        setVoiceError(
          'Microphone permission was denied. Please allow microphone access and try again.'
        );
      } else if (event?.error !== 'aborted') {
        setVoiceError('Voice input failed. Please try again.');
      }

      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Unable to start speech recognition:', error);
      setVoiceError('Unable to start voice recognition.');
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort?.();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8">
      {/* Title & Description */}
      <div className="text-center sm:text-left mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          What’s going on?
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Tell us what you're experiencing in your own words. You don't need to
          use any specific terms.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="student-concern" className="sr-only">
            Describe your concern
          </label>

          <div className="relative">
            <textarea
              id="student-concern"
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHAR_LIMIT) {
                  setMessage(e.target.value);

                  if (validationError) {
                    setValidationError(null);
                  }
                }
              }}
              disabled={isLoading}
              rows={6}
              placeholder="For example: I've been feeling overwhelmed by exams, I'm struggling to keep up with my coursework, and I'm worried about my fees..."
              className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-50 shadow-sm transition-all duration-150 text-sm sm:text-base leading-relaxed resize-none disabled:bg-slate-50 disabled:text-slate-500"
            />

            {/* Voice Input Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleVoiceToggle}
              className={`absolute right-3 top-3 flex items-center px-2 py-1 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 mr-1" />
                  <span className="text-xs">Listening…</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-1" />
                  <span className="text-xs">Speak your concern</span>
                </>
              )}
            </button>
          </div>

          {/* Voice Status */}
          {isRecording && (
            <div className="mt-2 px-1 text-xs text-teal-600">
              Listening... Speak naturally. Click the microphone when you are
              finished.
            </div>
          )}

          {interimTranscript && (
            <div className="mt-2 px-1 text-xs text-slate-500 italic">
              {interimTranscript}
            </div>
          )}

          {voiceError && (
            <div className="mt-2 px-1 text-xs text-red-600">
              {voiceError}
            </div>
          )}

          {voiceCompleted && !isRecording && !voiceError && (
            <div className="mt-2 px-1 text-xs text-emerald-600">
              Voice input added successfully.
            </div>
          )}

          {/* Character counter */}
          <div className="flex items-center justify-between mt-1 px-1 text-xs text-slate-400">
            <span>
              {validationError && (
                <span className="text-red-600 font-medium">
                  {validationError}
                </span>
              )}
            </span>

            <span
              className={
                message.length >= MAX_CHAR_LIMIT - 50
                  ? 'text-amber-600 font-semibold'
                  : 'text-slate-400'
              }
            >
              {message.length} / {MAX_CHAR_LIMIT}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-medium text-sm sm:text-base shadow-sm hover:shadow transition-all duration-150 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <span>
              {isLoading
                ? 'Understanding your concern...'
                : 'Find My Support'}
            </span>

            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 max-w-sm">
            <Shield className="w-4 h-4 text-slate-400 shrink-0" />

            <span>
              Please avoid sharing passwords, payment details, or other
              sensitive personal information.
            </span>
          </div>
        </div>
      </form>

      {/* Try an Example Section */}
      <div className="mt-10 pt-6 border-t border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Try an example scenario</span>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Click an example to test how the navigator triages different student
          concerns:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => handleSelectExample(example.text)}
              className="text-left p-3 rounded-xl bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 transition-all text-xs text-slate-700 shadow-2xs group focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <div className="font-semibold text-slate-900 group-hover:text-teal-900 mb-1 flex items-center justify-between">
                <span>{example.title}</span>
                <span className="text-[10px] text-teal-600 font-normal">
                  Use
                </span>
              </div>

              <p className="line-clamp-2 text-slate-500 group-hover:text-slate-600">
                "{example.text}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};