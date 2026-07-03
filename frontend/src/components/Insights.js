import { useState } from "react";
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Legend, Tooltip,
} from "recharts";

const PIE_DATA   = [{ name: "Stay", value: 73.4 }, { name: "Churn", value: 26.6 }];
const PIE_COLORS = ["#00b894", "#e94560"];

const TT = {
  contentStyle: { background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontSize:12 },
  cursor: { fill:"rgba(255,255,255,0.04)" },
};

function buildRadar(form) {
  const secRisk      = form.OnlineSecurity === "Yes" ? 20 : form.OnlineSecurity === "No internet service" ? 10 : 85;
  const contractR    = form.Contract === "Month-to-month" ? 90 : form.Contract === "One year" ? 45 : 10;
  const tenureR      = Math.max(5, 95 - (parseFloat(form.tenure)||0) * 1.3);
  const suppRisk     = form.TechSupport === "Yes" ? 20 : form.TechSupport === "No internet service" ? 10 : 80;
  const chargeR      = Math.min(95, ((parseFloat(form.MonthlyCharges)||50)/119)*100);
  const depRisk      = form.Dependents === "Yes" ? 25 : 60;
  const internetR    = form.InternetService === "Fiber optic" ? 85 : form.InternetService === "DSL" ? 45 : 10;
  const totalChargeR = Math.min(95, ((parseFloat(form.TotalCharges)||0)/8685)*100);
  const paymentR     = form.PaymentMethod === "Mailed check" ? 70 : form.PaymentMethod === "Electronic check" ? 60 : 30;
  return [
    { metric:"Security",     value: Math.round(secRisk)      },
    { metric:"Contract",     value: Math.round(contractR)    },
    { metric:"Tenure",       value: Math.round(tenureR)      },
    { metric:"Support",      value: Math.round(suppRisk)     },
    { metric:"Charges",      value: Math.round(chargeR)      },
    { metric:"Dependent",    value: Math.round(depRisk)      },
    { metric:"Internet",     value: Math.round(internetR)    },
    { metric:"TotalCharges", value: Math.round(totalChargeR) },
    { metric:"Payment",      value: Math.round(paymentR)     },
  ];
}

function buildSuggestions(form) {
  const suggestions = [];
  if (form.Contract === "Month-to-month") {
    suggestions.push({ priority:"High Priority", priorityColor:"#e94560", priorityBg:"rgba(233,69,96,0.12)", borderColor:"rgba(233,69,96,0.25)", icon:"📋", title:"Offer a One Year Contract", desc:"Month-to-month customers churn 3x more. A discounted annual plan can significantly improve retention." });
  }
  if (form.OnlineSecurity === "No") {
    suggestions.push({ priority:"High Priority", priorityColor:"#e94560", priorityBg:"rgba(233,69,96,0.12)", borderColor:"rgba(233,69,96,0.25)", icon:"🛡️", title:"Add Online Security Service", desc:"Customers without online security show 85% higher churn risk. Offer a free trial to increase stickiness." });
  }
  if (form.TechSupport === "No") {
    suggestions.push({ priority:"Medium Priority", priorityColor:"#fdcb6e", priorityBg:"rgba(253,203,110,0.12)", borderColor:"rgba(253,203,110,0.25)", icon:"🎧", title:"Enable Tech Support", desc:"Tech support reduces friction and improves satisfaction. Consider bundling it with the current plan." });
  }
  if (form.InternetService === "Fiber optic") {
    suggestions.push({ priority:"Medium Priority", priorityColor:"#fdcb6e", priorityBg:"rgba(253,203,110,0.12)", borderColor:"rgba(253,203,110,0.25)", icon:"💰", title:"Review Fiber Optic Pricing", desc:"Fiber optic customers have higher monthly charges and increased churn risk. Consider a loyalty discount." });
  }
  if (form.PaymentMethod === "Electronic check" || form.PaymentMethod === "Mailed check") {
    suggestions.push({ priority:"Low Priority", priorityColor:"#00b894", priorityBg:"rgba(0,184,148,0.12)", borderColor:"rgba(0,184,148,0.25)", icon:"💳", title:"Switch to Auto-Payment", desc:"Customers on automatic payment have lower churn rates. Encourage auto-pay enrollment." });
  }
  if (form.Dependents === "No") {
    suggestions.push({ priority:"Low Priority", priorityColor:"#00b894", priorityBg:"rgba(0,184,148,0.12)", borderColor:"rgba(0,184,148,0.25)", icon:"👨‍👩‍👧", title:"Offer a Family Plan", desc:"Customers without dependents are more likely to churn. A family or bundle plan may increase long-term loyalty." });
  }
  if (suggestions.length === 0) {
    suggestions.push({ priority:"Low Priority", priorityColor:"#00b894", priorityBg:"rgba(0,184,148,0.12)", borderColor:"rgba(0,184,148,0.25)", icon:"✅", title:"Customer Profile Looks Stable", desc:"This customer has a low churn risk profile. Maintain current service quality and check in periodically." });
  }
  return suggestions;
}

export default function Insights({ predictionData }) {
  // ✅ Use real prediction data if available, otherwise show empty state
  if (!predictionData) {
    return (
      <div style={{ ...S.page, alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
        <div style={{ textAlign:"center", opacity:0.4 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🎯</div>
          <div style={{ fontSize:18, fontWeight:600, color:"#fff", marginBottom:8 }}>No Prediction Yet</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)" }}>Go to the Predict page and run a prediction first.</div>
        </div>
      </div>
    );
  }

  const { form, pct } = predictionData;
  const rColor = pct >= 70 ? "#e94560" : pct >= 45 ? "#fdcb6e" : "#00b894";
  const label  = pct >= 70 ? "High Risk" : pct >= 45 ? "Medium Risk" : "Low Risk";
  const radarData   = buildRadar(form);
  const suggestions = buildSuggestions(form);

  return (
    <div style={S.page}>
      <style>{css}</style>

      {/* Header */}
      <div style={S.header}>
        <h2 style={S.h2}>📊 Prediction Insights</h2>
        <p style={S.sub}>Results from the latest customer churn prediction</p>
      </div>

      {/* Risk Result Card */}
      <div style={{ ...S.resultCard, borderColor:`${rColor}55` }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1.4rem", width:"100%" }}>
          <div style={{ background:`${rColor}20`, border:`2px solid ${rColor}`, borderRadius:14, padding:"1.1rem 2rem", textAlign:"center", width:"100%", maxWidth:340 }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{pct >= 50 ? "⚠️" : "✅"}</div>
            <div style={{ fontSize:20, fontWeight:700, color:rColor, marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>{pct >= 50 ? "Likely to Churn" : "Likely to Stay"}</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:58, fontWeight:800, color:rColor, lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.32)", marginTop:6, letterSpacing:"0.07em", textTransform:"uppercase" }}>Churn Probability</div>
          </div>
          <div style={{ width:"100%", maxWidth:400 }}>
            <div style={{ height:10, background:"rgba(255,255,255,0.07)", borderRadius:6, overflow:"hidden", position:"relative" }}>
              <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:"rgba(255,255,255,0.3)", zIndex:2 }}/>
              <div style={{ height:"100%", borderRadius:6, width:`${pct}%`, background:"linear-gradient(90deg,#00b894,#fdcb6e 50%,#e94560)", backgroundSize:"300px 100%", boxShadow:`0 0 10px ${rColor}99` }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:10, color:"rgba(255,255,255,0.25)" }}>
              <span>0% Stay</span><span>50% threshold</span><span>100% Churn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Boxes */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1.25rem" }}>
        <div style={S.statCard}>
          <div style={S.statLabel}>AUC Score</div>
          <div style={{ ...S.statValue, color:"#5da0fa" }}>0.755</div>
          <div style={S.statDesc}>Model discrimination ability</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>Decision Threshold</div>
          <div style={{ ...S.statValue, color:"#fdcb6e" }}>0.50</div>
          <div style={S.statDesc}>Churn classification cutoff</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>Churn Recall</div>
          <div style={{ ...S.statValue, color:"#00b894" }}>0.80</div>
          <div style={S.statDesc}>Actual churners detected</div>
        </div>
      </div>

      {/* Radar + Pie */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
        <div style={S.chartCard}>
          <div style={S.cardTitle}>Customer Risk Radar</div>
          <div style={S.cardDesc}>Risk profile built from this customer's inputs</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={90}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill:"rgba(255,255,255,0.5)", fontSize:11 }} />
              <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill:"rgba(255,255,255,0.2)", fontSize:9 }} />
              <Radar name="Risk" dataKey="value" stroke={rColor} fill={rColor} fillOpacity={0.25}
                animationBegin={200} animationDuration={1200} />
              <Tooltip {...TT} formatter={(v) => [`${v}/100`,"Risk score"]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.chartCard}>
          <div style={S.cardTitle}>Overall Churn Distribution</div>
          <div style={S.cardDesc}>Dataset baseline — 7,032 customers</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={65} outerRadius={95}
                dataKey="value" paddingAngle={4} animationBegin={300} animationDuration={1000}>
                {PIE_DATA.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip {...TT} formatter={(v) => [`${v}%`,"Share"]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize:12, color:"rgba(255,255,255,0.5)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Retention Suggestions */}
      <div style={S.chartCard}>
        <div style={S.cardTitle}>Retention Suggestions</div>
        <div style={S.cardDesc}>Actions to reduce churn risk for this customer</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px", borderRadius:10, background:s.priorityBg, border:`1px solid ${s.borderColor}` }}>
              <div style={{ width:36, height:36, borderRadius:8, background:s.priorityBg, border:`1px solid ${s.borderColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                {s.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"inline-block", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, marginBottom:5, letterSpacing:"0.05em", background:s.priorityBg, color:s.priorityColor, border:`1px solid ${s.borderColor}` }}>
                  {s.priority}
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:3 }}>{s.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const S = {
  page:      { maxWidth:1100, margin:"0 auto", padding:"2.5rem 1.5rem 4rem", display:"flex", flexDirection:"column", gap:"1.5rem" },
  header:    { textAlign:"center" },
  h2:        { fontSize:26, fontWeight:700, color:"#fff", marginBottom:8 },
  sub:       { color:"rgba(255,255,255,0.4)", fontSize:14 },
  resultCard:{ background:"#1a1a2e", border:"2px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"2rem", display:"flex", alignItems:"center", justifyContent:"center" },
  chartCard: { background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"1.25rem" },
  cardTitle: { fontSize:14, fontWeight:600, color:"#fff", marginBottom:4 },
  cardDesc:  { fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:"0.75rem" },
  statCard:  { background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"1.5rem", textAlign:"center" },
  statLabel: { fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 },
  statValue: { fontSize:42, fontWeight:800, lineHeight:1, marginBottom:8 },
  statDesc:  { fontSize:12, color:"rgba(255,255,255,0.25)" },
};

const css = `
  @media (max-width:720px) {
    div[style*="1fr 1fr 1fr"], div[style*="1fr 1fr"] { grid-template-columns:1fr !important; }
  }
`;