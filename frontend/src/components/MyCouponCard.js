import React from "react";
import "./MyCouponCard.css";

const MyCouponCard = ({ coupon, onUse }) => {
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
            Use
          </button>
          <p className="valid-date"> Exp: {coupon.valid}</p>
        </div>
      </div>
    </div>
  );
};

export default MyCouponCard;