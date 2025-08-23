import React, { useRef, useState, useEffect } from "react";
import "./SpeechLesson.css";
import { useNavigate } from "react-router-dom";
import AnimationBoxTemplate from "./AnimationBox";
import { Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// === List of words for the practice flow ===
const practiceWords = ["banana", "apple", "orange", "grape"];

function TakeVoice() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Step/word flow state
  const [step, setStep] = useState(0); // 0 = "start", 1...N = words, N+1 = "finish"
  const [currentWord, setCurrentWord] = useState(practiceWords[0]);

  // Audio recording & transcription states
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioRecordingTime, setAudioRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [confidence, setConfidence] = useState(null);

  const audioMediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const audioTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Greeting helper
  function spellOutWord(word) {
    return word.toUpperCase().split('').join('-');
  }
  const createGreeting = (word) => {
    const spelled = spellOutWord(word);
    const greetings = [
      `The first word is ${word}! Can you try to pronounce it for me please? That's: ${spelled}.`,
      `Hello! Ready to learn how to say ${word}? Let's spell it together: ${spelled}.`,
      `Welcome! Today's special word is ${word}! It goes like this: ${spelled}.`,
      `Hi! Let's have fun pronouncing ${word} together! Let's spell it: ${spelled}.`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Run greeting and setup on step change
  useEffect(() => {
    if (step > 0 && step <= practiceWords.length) {
      setCurrentWord(practiceWords[step - 1]);
      const greeting = createGreeting(practiceWords[step - 1]);
      speakText(greeting);
    }

    // Set up speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result:', event.results); // Debug log
        
        if (event.results && event.results.length > 0) {
            const result = event.results[0];
            
            if (result && result.length > 0) {
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;
            
            setTranscript(transcript);
            setConfidence(confidence ? Math.round(confidence * 100) : 0);
            setIsTranscribing(false);
            validateSpeech(transcript, confidence ? Math.round(confidence * 100) : 0);
            } else {
            console.error('No speech alternatives found');
            setTranscript('No speech detected. Please try again.');
            setIsTranscribing(false);
            }
        } else {
            console.error('No speech results found');
            setTranscript('No speech detected. Please try again.');
            setIsTranscribing(false);
        }
        };
      recognitionRef.current.onerror = (event) => {
        setIsTranscribing(false);
        setTranscript('Transcription failed. Please try again.');
      };
      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
      };
    }

    return () => {
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
    // eslint-disable-next-line
  }, [step]);

  // Only greet at the very beginning (before any step)
  useEffect(() => {
    if (step === 0) {
  speakText(t('sl_welcome_intro'));
    }
    // eslint-disable-next-line
  }, [step]);

  const startTranscription = () => {
    if (recognitionRef.current && !isTranscribing) {
      setIsTranscribing(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const speak = () => {
        const utterance = new window.SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const kindergartenVoice = voices.find(voice =>
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('susan') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('female') ||
          (voice.gender && voice.gender.toLowerCase() === 'female')
        );
        if (kindergartenVoice) {
          utterance.voice = kindergartenVoice;
        }
        utterance.rate = 1.1;
        utterance.pitch = 1.9;
        utterance.volume = 0.9;
        if (text.includes('Good job') || text.includes('correctly')) {
          utterance.pitch = 1.2;
          utterance.rate = 1.2;
        }
        window.speechSynthesis.speak(utterance);
      };
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
      } else {
        speak();
      }
    }
  };

  const validateSpeech = (text, confidence) => {
    const keywords = [currentWord];
    const textLower = text.toLowerCase();
    const containsKeyword = keywords.some(keyword => textLower.includes(keyword));
    if (containsKeyword && confidence >= 70){
  speakText(t('sl_good_job'));
    } else {
  speakText(t('sl_try_again'));
    }
    return;
  };

  // Upload logic (unchanged)
  const uploadAudio = async () => {
    if (!audioBlob) return;
    const formData = new FormData();
    formData.append("lesson_name", "Lesson 1: Speech Syllabus B");
    formData.append("due_date", "2025-08-25T23:59:00");
    formData.append("uploaded_file", audioBlob, "audio.wav");
    try {
      await fetch("http://localhost:8000/api/assignments/", {
        method: "POST",
        body: formData,
      });
  alert(t('sl_audio_upload_success'));
    } catch (err) {
  alert(t('sl_upload_fail'));
    }
  };

  // Button label and logic
  let buttonLabel = t('sl_start');
  if (step > 0 && step < practiceWords.length) buttonLabel = t('sl_next');
  else if (step === practiceWords.length) buttonLabel = t('sl_finish');

  const handleStepButton = () => {
    // If not started, begin with first word
    if (step < practiceWords.length) {
      setStep(step + 1);
      setTranscript('');
      setConfidence(null);
    } else {
      // Finished all words
  speakText(t('sl_congrats_done'));
      // Optionally upload, or go to next page:
      // navigate("/done");
    }
  };

  const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="takevideo-page">
      {/* Header */}
  <p className="assignment-label">{t('sl_assignment_details')}</p>
  <h3 className="assignment-title">{t('sl_lesson1_speechB')}</h3>

      <AnimationBoxTemplate />

      <div className="max-w-2xl mx-auto p-6 flex flex-col bg-white rounded-lg shadow-lg items-center justify-center">
        <div className="flex flex-col items-center space-y-4 justify-center">
          {step === 0 && (
            <div className="container-text">
              <p className="assignment-label">{t('sl_welcome_block')}</p>
            </div>
          )}
          {step > 0 && step <= practiceWords.length && (
            <div className="w-full flex flex-col items-center justify-center">
              <p className="text-center">
                {/* <strong>Practice word {step} of {practiceWords.length}:</strong> <span style={{fontWeight: "bold", color: "#1976d2"}}>{currentWord}</span> */}
                <span style={{
                fontWeight: "bold", 
                color: "#ff7300ff", 
                fontSize: "36px", 
                padding: "16px"
                }}>
                {currentWord.charAt(0).toUpperCase() + currentWord.slice(1)}
                </span>              
                </p>
              <p className="assignment-title">{transcript && <>{t('sl_you_said')} <strong>{transcript}</strong></>}</p>
            </div>
          )}
          <div className="center-container">
            {supportsSpeechRecognition && step > 0 && step <= practiceWords.length && (
              <button
                onClick={startTranscription}
                disabled={isTranscribing}
                className={`icon-btn enhanced-mic-btn ${isTranscribing ? 'transcribing' : 'ready'}`}
              >
                <Mic className="w-10 h-10" style={{ color: 'white' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-buttons">
  <button onClick={() => navigate("/AsgUpVideo")} className="cancel-btn">{t('sl_cancel')}</button>
        <button
          onClick={handleStepButton}
          className="start-btn"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default TakeVoice;