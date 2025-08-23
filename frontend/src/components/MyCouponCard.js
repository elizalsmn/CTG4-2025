import React from "react";
import "./MyCouponCard.css";
import { useTranslation } from 'react-i18next';

const MyCouponCard = ({ coupon, onUse }) => {
  const { t } = useTranslation();
  return (
    <div className="my-coupon-card">
      <div className="coupon-content">
        <div className="coupon-left">
          <h3>{coupon.value}</h3>
          <p className="coupon-title">{coupon.title}</p>
        </div>

        <div className="coupon-divider"></div>

        <div className="coupon-right">
          <button className="use-btn" onClick={() => onUse(coupon, "use")}>
            {t('coupon_use')}
          </button>
          <p className="valid-date"> {t('coupon_exp')} {coupon.valid}</p>
        </div>
      </div>
    </div>
  );
};

export default MyCouponCard;