import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div style={S.page}>
      <style>{css}</style>

      {/* Animated background network nodes */}
      <div style={S.bg}>
        <div className="node n1" />
        <div className="node n2" />
        <div className="node n3" />
        <div className="node n4" />
        <div className="node n5" />
        <div className="node n6" />
        <svg style={S.lines} viewBox="0 0 1440 900" preserveAspectRatio="none">
          <line x1="200" y1="150" x2="600" y2="400" stroke="rgba(233,69,96,0.12)" strokeWidth="1"/>
          <line x1="600" y1="400" x2="1100" y2="200" stroke="rgba(233,69,96,0.12)" strokeWidth="1"/>
          <line x1="1100" y1="200" x2="900" y2="600" stroke="rgba(93,160,250,0.10)" strokeWidth="1"/>
          <line x1="200" y1="150" x2="900" y2="600" stroke="rgba(93,160,250,0.08)" strokeWidth="1"/>
          <line x1="600" y1="400" x2="900" y2="600" stroke="rgba(233,69,96,0.10)" strokeWidth="1"/>
          <line x1="100" y1="700" x2="600" y2="400" stroke="rgba(93,160,250,0.08)" strokeWidth="1"/>
          <line x1="1300" y1="750" x2="1100" y2="200" stroke="rgba(233,69,96,0.08)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Hero content */}
      <div style={{ ...S.hero, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease' }}>

        {/* Badge */}
        <div style={S.badge}>
          <span style={S.badgeDot} />
          Machine Learning · Gradient Boosting · REST API
        </div>

        {/* Title */}
        <h1 style={S.title}>
          <span style={S.titleLine1}>Customer</span>
          <br />
          <span style={S.titleLine2}>Churn Prediction</span>
        </h1>

        {/* Subtitle */}
        <p style={S.subtitle}>
          Predict whether a telecom customer will churn using AI.<br />
          Get instant risk scores, retention suggestions, and insights.
        </p>

        {/* CTA Button */}
        <Link to="/predict" className="cta-btn" style={S.btn}>
          Start Predicting →
        </Link>

      </div>
    </div>
  );
}

const S = {
  page: {
    backgroundColor: '#0d1b2a',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Georgia', serif",
  },
  bg: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  lines: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 40px',
    position: 'relative',
    zIndex: 2,
    maxWidth: 700,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(233,69,96,0.1)',
    border: '1px solid rgba(233,69,96,0.3)',
    borderRadius: 30,
    padding: '6px 16px',
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#e94560',
    boxShadow: '0 0 8px #e94560',
    display: 'inline-block',
  },
  title: {
    margin: '0 0 24px',
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
  },
  titleLine1: {
    fontSize: 72,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
    display: 'block',
  },
  titleLine2: {
    fontSize: 72,
    fontWeight: 700,
    color: '#ffffff',
    display: 'block',
    background: 'linear-gradient(135deg, #fff 30%, #e94560)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 17,
    lineHeight: 1.7,
    marginBottom: 40,
    fontFamily: "'Arial', sans-serif",
    fontWeight: 300,
  },
  btn: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #e94560, #c73652)',
    color: '#fff',
    padding: '16px 48px',
    borderRadius: 50,
    textDecoration: 'none',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'Arial', sans-serif",
    letterSpacing: '0.04em',
    boxShadow: '0 8px 32px rgba(233,69,96,0.4)',
  },
};

const css = `
  body { margin: 0; }

  .node {
    position: absolute;
    border-radius: 50%;
    animation: float 8s ease-in-out infinite;
  }
  .n1 { width:10px; height:10px; top:17%; left:14%; animation-duration:9s;  background:radial-gradient(circle,rgba(233,69,96,0.8),transparent); }
  .n2 { width:8px;  height:8px;  top:42%; left:41%; animation-duration:7s;  animation-delay:1s;   background:radial-gradient(circle,rgba(233,69,96,0.6),transparent); }
  .n3 { width:12px; height:12px; top:22%; left:76%; animation-duration:11s; animation-delay:2s;   background:radial-gradient(circle,rgba(93,160,250,0.7),transparent); }
  .n4 { width:7px;  height:7px;  top:66%; left:62%; animation-duration:8s;  animation-delay:0.5s; background:radial-gradient(circle,rgba(93,160,250,0.5),transparent); }
  .n5 { width:9px;  height:9px;  top:78%; left:7%;  animation-duration:10s; animation-delay:3s;   background:radial-gradient(circle,rgba(0,184,148,0.6),transparent); }
  .n6 { width:11px; height:11px; top:83%; left:90%; animation-duration:9s;  animation-delay:1.5s; background:radial-gradient(circle,rgba(233,69,96,0.5),transparent); }

  @keyframes float {
    0%,100% { transform: translateY(0px) scale(1); opacity:0.7; }
    33%      { transform: translateY(-18px) scale(1.2); opacity:1; }
    66%      { transform: translateY(10px) scale(0.9); opacity:0.5; }
  }

  .cta-btn:hover {
    transform: translateY(-3px) scale(1.03) !important;
    box-shadow: 0 14px 40px rgba(233,69,96,0.55) !important;
    transition: all 0.25s ease !important;
  }
`;

export default Home;