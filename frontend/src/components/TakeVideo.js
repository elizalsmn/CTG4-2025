import React, { useRef, useState, useEffect } from "react";
import "./TakeVideo.css";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaCircle,
  FaPause,     
  FaPlay,     
  FaStop,     
} from "react-icons/fa";
import AnimationBoxTemplate from "./AnimationBox";

function TakeVideo() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    startStream();
    return () => stopStream();
  }, []);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setMicOn((prev) => !prev);
  };

  const toggleCam = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setCamOn((prev) => !prev);
  };

  const [recordState, setRecordState] = useState("idle"); 
  // "idle" | "recording" | "paused" | "stopped"

  const startRecording = () => {
    if (!stream) return;
    const recorder = new MediaRecorder(stream);
    let chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoFile(blob);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;

    setRecordState("recording");
    setSeconds(0);

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
  }
  clearInterval(timerRef.current);
  setRecordState("stopped");  
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordState === "recording") {
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setRecordState("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordState === "paused") {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      setRecordState("recording");
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("lesson_name", "Lesson 1: Speech Syllabus B");
    formData.append("due_date", "2025-08-25T23:59:00");
    formData.append("uploaded_file", videoFile, "video.webm");

    try {
      await fetch("http://localhost:8000/api/assignments/", {
        method: "POST",
        body: formData,
      });
      alert("Video uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="takevideo-page">
      {/* Header */}
      <p className="assignment-label">Assignment Details</p>
      <h3 className="assignment-title">Lesson 1: Speech Syllabus B</h3>


      <AnimationBoxTemplate />

      {/* Camera Check */}
      <p className="camera-check-text">Turn on your camera and microphone!</p>

      {/* Camera */}
      <div className="video-box">
        <video ref={videoRef} autoPlay playsInline muted />
        <p className="video-placeholder">Video Recording</p>
      </div>

      {/* Controls */}
      <div className="controls">
      <button onClick={toggleMic} className="icon-btn">
        {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </button>
      <button onClick={toggleCam} className="icon-btn">
        {camOn ? <FaVideo /> : <FaVideoSlash />}
      </button>

      {/* {recordState === "idle" && (
        <button onClick={startRecording} className="icon-btn">
          <FaCircle />
        </button>
      )}

      {recordState === "recording" && (
        <button onClick={pauseRecording} className="icon-btn">
          <FaPause />
        </button>
      )} */}

      {recordState === "paused" && (
        <button onClick={resumeRecording} className="icon-btn">
          <FaPlay />
        </button>
      )}

      {(recordState === "recording" || recordState === "paused") && (
        <button onClick={stopRecording} className="icon-btn">
          <FaStop />
        </button>
      )}
    </div>

    {(recordState === "recording" || recordState === "paused" || recordState === "stopped") && (
      <div className="timer-box">
        <input
          type="range"
          min="0"
          max="600"
          value={seconds}
          readOnly
        />
        <p>{seconds} sec</p>
      </div>
    )}
      

      {/* Footer */}
      <div className="footer-buttons">
        <button className="cancel-btn">Cancel</button>
        <button className="start-btn">Start</button>
      </div>
    </div>
  );
}

export default TakeVideo;