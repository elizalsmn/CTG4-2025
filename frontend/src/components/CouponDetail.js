import React, { useState } from "react";
import "./CouponDetail.css";
import confetti from "canvas-confetti";
import { useTranslation } from 'react-i18next';

const CouponDetail = ({ coupon, onClose, mode = "redeem" }) => {
  const [redeemed, setRedeemed] = useState(false);
  const { t } = useTranslation();

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
                {t('coupon_redeem_btn')}
                </button>
            )}

            {mode === "redeem" && redeemed && (
                <div className="qr-placeholder">{t('coupon_qr_placeholder')}</div>
            )}

            {/* Use Mode → always show QR */}
      {mode === "use" && <div className="qr-placeholder">{t('coupon_qr_placeholder')}</div>}
        </div>
    <p className="valid">{t('coupon_valid_until', { date: coupon.valid })}</p>
      </div>

      <button className="close-btn" onClick={onClose}>✕</button>
    </div>
  );
};

export default CouponDetail;