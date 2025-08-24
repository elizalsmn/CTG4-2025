import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCheckCircle, FaGift } from "react-icons/fa";
import "./Milestone.css";
import Back from "./Back";
import CouponDetail from "./CouponDetail";

function Milestone() {
  const location = useLocation();
  const currentPoints = location.state?.points || 0;

  // 🎯 Coupons act as milestones (points = unlock threshold)
  const coupons = [
    {
      id: 1,
      value: "$5",
      title: "Kaibo",
      points: 20, // unlocks at 20 points
      desc: "Get $10 off at your next Grocery buy",
      conditions: ["Valid at all Kaibo stores.", "No cash value."],
      valid: "01 March 2025"
    },
    {
      id: 2,
      value: "$5",
      title: "Wellcome",
      points: 40,
      desc: "Save on your next grocery trip",
      conditions: ["Valid at all Wellcome stores.", "No cash value."],
      valid: "10 April 2025"
    },
    {
      id: 3,
      value: "$5",
      title: "Park N Shop",
      points: 60,
      desc: "Get extra groceries for free",
      conditions: ["Valid only at Park N Shop.", "No cash value."],
      valid: "15 May 2025"
    },
    {
      id: 4,
      value: "$10",
      title: "DS Groceries",
      points: 80,
      desc: "Get extra groceries for free",
      conditions: ["Valid only at Park N Shop.", "No cash value."],
      valid: "15 May 2025"
    },
    {
      id: 5,
      value: "$10",
      title: "Bestmart 360",
      points: 100,
      desc: "Get extra groceries for free",
      conditions: ["Valid only at Park N Shop.", "No cash value."],
      valid: "15 May 2025"
    }
  ];

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  return (
    <div className="milestone-container">
      {/* Header */}

      <div className="milestone-header">
        <Back to="/leaderboard" top="8px"/>
        <h1>Milestone Progress</h1>
      </div>

      {/* User points */}
      <div className="milestone-footer">
        <p>
          You have <b>{currentPoints}</b> points
        </p>
      </div>

      {/* Track */}
      <div className="milestone-track">
        {coupons.map((coupon, index) => {
          const achieved = currentPoints >= coupon.points;
          const isNext =
            currentPoints < coupon.points &&
            (index === 0 || currentPoints >= coupons[index - 1].points);

          return (
            <div key={coupon.id} className="milestone-step">
              {/* Circle with points */}
              <div
                className={`milestone-circle ${achieved ? "achieved" : ""} ${
                  isNext ? "next" : ""
                }`}
              >
                {achieved ? (
                  <FaCheckCircle className="milestone-check" />
                ) : (
                  <span className="milestone-points">{coupon.points}</span>
                )}
              </div>

              {/* Reward card (coupon info) */}
              <div
                className={`milestone-reward ${achieved ? "unlocked" : ""} ${
                  isNext ? "highlight" : ""
                }`}
                onClick={() => {
                    if (achieved) {
                        setSelectedCoupon({ ...coupon, mode: "redeem" });
                    } else if (isNext) {
                        setSelectedCoupon({ ...coupon, mode: "preview" });
                    }
                    }}
              >
                <div className="reward-icon">
                  <FaGift />
                </div>
                <div className="reward-content">
                  <p className="reward-title">{coupon.title}</p>
                  <span className="reward-value">{coupon.value}</span>

                  {achieved && (
                    <span className="reward-status unlocked-badge">
                      Unlocked
                    </span>
                  )}
                  {isNext && !achieved && (
                    <span className="reward-status next-badge">Next Reward</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon detail modal */}
      {selectedCoupon && (
        <CouponDetail
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      )}
    </div>
  );
}

export default Milestone;