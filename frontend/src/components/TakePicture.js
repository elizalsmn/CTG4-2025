import React, { useEffect, useRef, useState } from 'react';
import './TakePicture.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Back from './Back';
import UserMenu from './UserMenu';

// Simple placeholder styling: follow existing AsgInfo palette (#ffe1d6 etc.).

function TakePicture() {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const streamRef = useRef(null);
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [photos, setPhotos] = useState([]); // { id, dataUrl, ts }
	const [isCapturing, setIsCapturing] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		startCamera();
		return () => stopCamera();
	}, []);

	const startCamera = async () => {
		try {
			setError(null);
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
			setIsCapturing(true);
		} catch (e) {
			setError(e.message || 'Camera error');
		}
	};

	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach(tr => tr.stop());
			streamRef.current = null;
		}
		setIsCapturing(false);
	};

	const takePhoto = () => {
		if (!videoRef.current || !canvasRef.current) return;
		const video = videoRef.current;
		const canvas = canvasRef.current;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
		setPhotos(p => [{ id: Date.now(), dataUrl, ts: new Date().toISOString() }, ...p]);
	};

	const deletePhoto = (id) => setPhotos(p => p.filter(ph => ph.id !== id));

	const submitPhotos = async () => {
    if (!photos.length) return;
    try {
		//1. uodate leaderboard points
        await fetch('http://localhost:8000/app/update_leaderboard/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: "1", points: "3" })
        });

        // 2. send FormData
        const formData = new FormData();
        photos.forEach((ph, idx) => {
            const blob = dataURLToBlob(ph.dataUrl);
            formData.append('files', blob, `photo_${idx + 1}.jpg`);
        });
        await fetch('http://localhost:8000/app/accept_picture/', { method: 'POST', body: formData });

        alert('Photos uploaded');
    } catch (e) {
        alert('Upload failed');
    }
};

	const dataURLToBlob = (dataUrl) => {
		const [meta, b64] = dataUrl.split(',');
		const mime = meta.match(/:(.*?);/)[1];
		const bin = atob(b64);
		const len = bin.length;
		const u8 = new Uint8Array(len);
		for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
		return new Blob([u8], { type: mime });
	};

	return (
		<div className="takepicture-page">
			<Back to="/AsgUp" />
			<p className="assignment-label">{t('asg_details')}</p>
			<h3 className="assignment-title">{t('asg_lesson1_writingA')}</h3>

			<div className="camera-area">
				{error && <div className="error-box">{error}</div>}
				<video ref={videoRef} autoPlay playsInline muted className="camera-video" />
				<canvas ref={canvasRef} style={{ display: 'none' }} />
				<div className="camera-controls">
					{isCapturing ? (
						<button className="capture-btn" onClick={takePhoto}>{photos.length ? 'Capture More' : 'Capture'}</button>
					) : (
						<button className="capture-btn" onClick={startCamera}>Start Camera</button>
					)}
					{isCapturing && (
						<button className="stop-btn" onClick={stopCamera}>Stop</button>
					)}
				</div>
			</div>

			{photos.length > 0 && (
				<div className="photos-section">
					<h4 className="photos-title">Captured Photos ({photos.length})</h4>
					<div className="photos-grid">
						{photos.map(ph => (
							<div className="photo-wrapper" key={ph.id}>
								<img src={ph.dataUrl} alt="captured" />
								<button className="delete-photo" onClick={() => deletePhoto(ph.id)}>×</button>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="footer submit-footer">
				<button className="cancel-btn" onClick={() => navigate('/LessonsLibrary')}>{t('asg_cancel')}</button>
				<button className="upload-btn" disabled={!photos.length} onClick={submitPhotos}>{t('asg_upload')}</button>
			</div>
			<UserMenu />
		</div>
	);
}

export default TakePicture;
