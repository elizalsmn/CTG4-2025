import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import './PerformanceCard.css';

export default function PerformanceCard() {
  return (
    <div className="performance-card">
      <div className="performance-header">
        <h2 className="performance-title">Performance</h2>
        <ChevronRight size={20} className="performance-chevron" />
      </div>

      <div className="performance-bars-container">
        <div className="performance-speaking-bar"></div>
        <div className="performance-writing-bar"></div>
      </div>

      <div className="performance-metrics-container">
        <div className="performance-metric-row">
          <div className="performance-metric-left">
            <div className="performance-color-indicator performance-speaking-indicator"></div>
            <span className="performance-percentage">78.5%</span>
            <div className="performance-change-container">
              <TrendingUp size={14} color="#10b981" />
              <span className="performance-positive-change">+2.8%</span>
            </div>
          </div>
          <div className="performance-metric-right">
            <p className="performance-metric-label">Speaking</p>
            <p className="performance-metric-value">10 Lessons</p>
          </div>
        </div>

        <div className="performance-metric-row">
          <div className="performance-metric-left">
            <div className="performance-color-indicator performance-writing-indicator"></div>
            <span className="performance-percentage">65.2%</span>
            <div className="performance-change-container">
              <TrendingDown size={14} color="#ef4444" />
              <span className="performance-negative-change">-1.5%</span>
            </div>
          </div>
          <div className="performance-metric-right">
            <p className="performance-metric-label">Writing</p>
            <p className="performance-metric-value">15 Submission</p>
          </div>
        </div>
      </div>
    </div>
  );
}