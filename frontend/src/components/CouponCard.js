import React from "react";
import "./CouponCard.css";

const CouponCard = ({ coupon, onSelect }) => {
  return (
    <div className="coupon-card" onClick={() => onSelect(coupon)}>
      <div className="coupon-content">
        <div className="coupon-left">
          <h3>{coupon.value}</h3>
          <p className="coupon-title">{coupon.title}</p>
        </div>

        <div className="coupon-divider"></div>

        <div className="coupon-right">
          <p className="redeem-text">Redeem for</p>
          <p className="redeem-text"> {coupon.points} points</p>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;