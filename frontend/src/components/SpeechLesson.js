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

  // Attempt tracking
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctWords, setCorrectWords] = useState(new Set());

    // Calculate score
  const score = Math.round((correctWords.size / practiceWords.length) * 100);
  const isFinished = step > practiceWords.length;

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
    return word.toUpperCase().split('').join('--');
  }
  const createGreeting = (word) => {
    const spelled = spellOutWord(word);
    const greetings = [
        `Guess what? The word for today is ${word}! Can you say it with me? Let's spell it out: ${spelled}.`,
        `Ready for a challenge? Try pronouncing ${word}! Here's how we spell it: ${spelled}.`,
        `Ooh, this is a fun one: ${word}! Want to try saying it? It's spelled like this: ${spelled}.`,
        `Let's dive into a new word: ${word}. Can you pronounce it? Here's the spelling: ${spelled}.`,
        `Here comes a cool word: ${word}. Say it out loud! The letters are: ${spelled}.`,
        `Time to practice! The word is ${word}. Can you give it a try? Spelled: ${spelled}.`,
        `Spotlight on: ${word}! Let's hear your best pronunciation. It's spelled: ${spelled}.`,
        `I have a word for you: ${word}. Want to repeat after me? Here's how it's spelled: ${spelled}.`,
        `Let's make learning fun! Today's word is ${word}--spelled: ${spelled}. Can you say it?`,
        `Challenge time! Can you pronounce ${word}? The letters are: ${spelled}.`
        ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Run greeting and setup on step change
  useEffect(() => {
    if (step > 0 && step <= practiceWords.length) {
      setCurrentWord(practiceWords[step - 1]);
      // Reset attempt tracking for new word
      setAttempts(0);
      setIsCorrect(false);
      
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
    
    // Increment attempts
    setAttempts(prev => prev + 1);
    
    if (containsKeyword && confidence >= 70) {
      setIsCorrect(true);
      setCorrectWords(prev => new Set([...prev, currentWord]));
      speakText(t('sl_good_job'));
    } else {
      speakText(t('sl_try_again'));
    }
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

  // Button logic: can proceed if correct OR after 2 attempts
  const canProceed = isCorrect || attempts >= 2;

  // Button label and logic
  let buttonLabel = t('sl_start');
  if (step > 0 && step < practiceWords.length) buttonLabel = t('sl_next');
  else if (step === practiceWords.length) buttonLabel = t('sl_finish');

  const handleStepButton = () => {
    if (step < practiceWords.length) {
      setStep(step + 1);
      setCurrentWord(practiceWords[step])
      setTranscript('');
      setConfidence(null);
    } else {
      speakText(t('sl_congrats_done'));
      console.log('Correct words:', Array.from(correctWords));
      navigate("/doneSpeech", {
      state: {
        score: score,
        totalQuestions: practiceWords.length,
        correctAnswers: correctWords.size,
      }
    });
    }
  };

  const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // Disable mic if already correct
  const micDisabled = isCorrect || isTranscribing;

  return (
    <div className="takevideo-page">
      {/* Header */}
      <p className="assignment-label">{t('sl_assignment_details')}</p>
      <h3 className="assignment-title">{t('sl_lesson1_speechB')}</h3>

      <AnimationBoxTemplate />

      <div className="max-w-2xl mx-auto p-6 flex flex-col bg-white rounded-lg shadow-lg items-center justify-center">
        <div className="container-text">
          {step === 0 && (
            <div className="container-text">
              <p className="assignment-label">{t('sl_welcome_block')}</p>
            </div>
          )}
          {step > 0 && step <= practiceWords.length && (
            <div className="container-text">
              <p className="word-spell">
         
                {currentWord.charAt(0).toUpperCase() + currentWord.slice(1)}
           
              </p>
              
            <div >
              <p className="text-title">
                {transcript && <>{t('sl_you_said')} <strong>{transcript}</strong></>}
              </p>
            </div>
              {/* Show attempt status */}
              {/* <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                {isCorrect ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Correct!</span>
                ) : (
                  <span></span>
                )}
              </div> */}
            </div>
          )}
          <div className="center-container">
            {supportsSpeechRecognition && step > 0 && step <= practiceWords.length && (
              <button
                onClick={startTranscription}
                disabled={micDisabled}
                className={`icon-btn enhanced-mic-btn ${micDisabled ? 'disabled' : isTranscribing ? 'transcribing' : 'ready'}`}
                style={{ opacity: micDisabled ? 0.5 : 1 }}
              >
                <Mic className="w-10 h-10" style={{ color: 'white' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-buttons">
        <button onClick={() => navigate("/homePage")} className="cancel-btn">{t('sl_cancel')}</button>
        <button
          onClick={handleStepButton}
          disabled={step > 0 && step <= practiceWords.length && !canProceed}
          className="start-btn"
          style={{ 
            opacity: (step > 0 && step <= practiceWords.length && !canProceed) ? 0.5 : 1,
            cursor: (step > 0 && step <= practiceWords.length && !canProceed) ? 'not-allowed' : 'pointer'
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default TakeVoice;