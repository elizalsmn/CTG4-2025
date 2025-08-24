import React from "react";
import "./CouponCard.css";
import { useTranslation } from 'react-i18next';

const CouponCard = ({ coupon, onSelect }) => {
  const { t } = useTranslation();
  return (
    <div className="coupon-card" onClick={() => onSelect(coupon)}>
      <div className="coupon-content">
        <div className="coupon-left">
          <h3>{coupon.value}</h3>
          <p className="coupon-title">{coupon.title}</p>
        </div>

        <div className="coupon-divider"></div>

        <div className="coupon-right">
          <p className="redeem-text">{t('coupon_redeem_for')}</p>
          <p className="redeem-text"> {t('coupon_points_suffix', { points: coupon.points })}</p>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;