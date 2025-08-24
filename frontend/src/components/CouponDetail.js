import React, { useState } from "react";
import "./CouponDetail.css";
import confetti from "canvas-confetti";
import { useTranslation } from 'react-i18next';
import qrImg from '../assets/qr.png';

const CouponDetail = ({ coupon, onClose, mode = "redeem" }) => {
  const [redeemed, setRedeemed] = useState(false);
  const { t } = useTranslation();

  if (!coupon) return null;

  const handleRedeem = () => {
  setRedeemed(true);

  // create a canvas if not already
  let myCanvas = document.getElementById("confetti-canvas");
  if (!myCanvas) {
    myCanvas = document.createElement("canvas");
    myCanvas.id = "confetti-canvas";
    myCanvas.style.position = "fixed";
    myCanvas.style.top = "0";
    myCanvas.style.left = "0";
    myCanvas.style.width = "100%";
    myCanvas.style.height = "100%";
    myCanvas.style.pointerEvents = "none";
    myCanvas.style.zIndex = "100000"; // 👈 higher than overlay
    document.body.appendChild(myCanvas);
  }

  const myConfetti = confetti.create(myCanvas, { resize: true });
  myConfetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
};

  return (
    <div className="coupon-detail">
       {/* <Confetti width={window.innerWidth} height={window.innerHeight} /> */}
      <div className="coupon-detail-card">
        <h2>{coupon.value}</h2>
        <h4>{coupon.title}</h4>
        {coupon.desc && <p className="desc">{coupon.desc}</p>}

        {coupon.conditions && (
          <ul>
            {coupon.conditions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        )}

        <div className="coupon-actions">
            {/* Redeem Mode */}
            {mode === "redeem" && !redeemed && (
              <button className="redeem-btn" onClick={handleRedeem}>
                {t('coupon_redeem_btn')}
              </button>
            )}

            {mode === "redeem" && redeemed && (
              <div className="qr-placeholder">
                <img className="qr-img" src={qrImg} alt="QR Code" />
              </div>
            )}

            {/* Use Mode → always show QR */}
            {mode === "use" && (
              <div className="qr-placeholder">
                <img className="qr-img" src={qrImg} alt="QR Code" />
              </div>
            )}

            {/* Preview Mode → just show details, no redeem button */}
            {mode === "preview" && (
              <div className="preview-note">
                <p>{t('coupon_preview_note', 'This reward will unlock soon!')}</p>
              </div>
            )}
            
        </div>
    <p className="valid">{t('coupon_valid_until', { date: coupon.valid })}</p>
      </div>

      <button className="close-btn-milestone" onClick={onClose}>✕</button>
    </div>
  );
};

export default CouponDetail;