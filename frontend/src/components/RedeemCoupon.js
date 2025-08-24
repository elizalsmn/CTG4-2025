import React, { useState } from "react";
import "./RedeemCoupon.css";
import { useTranslation } from "react-i18next";
import CouponCard from "./CouponCard";
import MyCouponCard from "./MyCouponCard";
import CouponDetail from "./CouponDetail";
import { useNavigate } from "react-router-dom"; 
import Back from "./Back"
import UserMenu from "./UserMenu";

function RedeemCoupon() {
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const { t } = useTranslation();

  // Available coupons (to redeem with points)
  const availableCoupons = [
    {
      id: 1,
      value: "$10",
      title: "Kaibo",
      points: 500,
      desc: "Get $10 off at your next Grocery buy",
      conditions: [
        "Valid at all Kaibo stores.", "No cash value.",
        "Not valid with other discounts and promotions.",
        "No cash value."
      ],
      valid: "01 March 2025"
    },
    {
      id: 2,
      value: "$10",
      title: "Wellcome",
      points: 500,
      desc: "Save on your next grocery trip",
      conditions: ["Valid at all Wellcome stores.", "No cash value."],
      valid: "10 April 2025"
    },
    {
      id: 3,
      value: "$10",
      title: "Park N Shop",
      points: 500,
      desc: "Get extra groceries for free",
      conditions: ["Valid only at Park N Shop.", "No cash value."],
      valid: "15 May 2025"
    }
  ];

  // My redeemed coupons (already owned)
  const myCoupons = [
    {
      id: 101,
      value: "$5",
      title: "Starbucks",
      valid: "20 March 2025"
    },
    {
      id: 102,
      value: "Buy 1 Get 1",
      title: "Pizza Hut",
      valid: "05 April 2025"
    }
  ];

  const handleUseCoupon = (coupon) => {
    setSelectedCoupon(coupon);
  };

  return (
    <div className="redeem-page">
      {/* Available Coupons */}
      <Back/>
      {/* <h2 className="page-title">
        {t('rc_available_coupons')}
        <p className="page-subtitle">{t('rc_available_to_redeem', { count: availableCoupons.length })}</p>
      </h2>

      <div className="coupons-list">
        {availableCoupons.map((c) => (
          // Available coupons (redeem flow)
        <CouponCard
        key={c.id}
        coupon={c}
        onSelect={(coupon) => setSelectedCoupon({ data: coupon, mode: "redeem" })}
        />
        ))}
      </div> */}

      {/* <div className="points-footer">
        <p>{t('rc_points_you_have', { points: 1500 })}</p>
      </div> */}

      {/* My Coupons */}
      <h2 className="page-title">
        {t('rc_my_coupons')}
        <p className="page-subtitle">{t('rc_available_to_use', { count: myCoupons.length })}</p>
      </h2>

      <div className="coupons-list">
        {myCoupons.map((c) => (
          <MyCouponCard
            key={c.id}
            coupon={c}
            onUse={(coupon) => setSelectedCoupon({ data: coupon, mode: "use" })}
            />
        ))}
      </div>

      {/* Detail View */}
      {selectedCoupon && (
        <CouponDetail
            coupon={selectedCoupon.data}
            mode={selectedCoupon.mode}   // 👈 important
            onClose={() => setSelectedCoupon(null)}
        />
        )}
    <UserMenu/>
    </div>
    
  );
}

export default RedeemCoupon;