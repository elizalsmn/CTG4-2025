import React, { useState } from "react";
import "./CouponDetail.css";
import confetti from "canvas-confetti";

const CouponDetail = ({ coupon, onClose, mode = "redeem" }) => {
  const [redeemed, setRedeemed] = useState(false);

  if (!coupon) return null;

  const handleRedeem = () => {
    setRedeemed(true);

    // 🎉 confetti effect
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="coupon-detail">
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
                Redeem
                </button>
            )}

            {mode === "redeem" && redeemed && (
                <div className="qr-placeholder">[QR]</div>
            )}

            {/* Use Mode → always show QR */}
            {mode === "use" && <div className="qr-placeholder">[QR]</div>}
        </div>

        <p className="valid">Valid until {coupon.valid}</p>
      </div>

      <button className="close-btn" onClick={onClose}>✕</button>
    </div>
  );
};

export default CouponDetail;