import { useState, useRef, useEffect } from "react";
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

function buildSuggestions(form, pct) {
  const suggestions = [];

  if (form.Contract === "Month-to-month") {
    suggestions.push({
      priority: "High Priority",
      priorityColor: "#e94560",
      priorityBg: "rgba(233,69,96,0.12)",
      borderColor: "rgba(233,69,96,0.25)",
      icon: "📋",
      title: "Offer a One Year Contract",
      desc: "Month-to-month customers churn 3x more. A discounted annual plan can significantly improve retention.",
    });
  }

  if (form.OnlineSecurity === "No") {
    suggestions.push({
      priority: "High Priority",
      priorityColor: "#e94560",
      priorityBg: "rgba(233,69,96,0.12)",
      borderColor: "rgba(233,69,96,0.25)",
      icon: "🛡️",
      title: "Add Online Security Service",
      desc: "Customers without online security show 85% higher churn risk. Offer a free trial to increase stickiness.",
    });
  }

  if (form.TechSupport === "No") {
    suggestions.push({
      priority: "Medium Priority",
      priorityColor: "#fdcb6e",
      priorityBg: "rgba(253,203,110,0.12)",
      borderColor: "rgba(253,203,110,0.25)",
      icon: "🎧",
      title: "Enable Tech Support",
      desc: "Tech support reduces friction and improves satisfaction. Consider bundling it with the current plan.",
    });
  }

  if (form.InternetService === "Fiber optic") {
    suggestions.push({
      priority: "Medium Priority",
      priorityColor: "#fdcb6e",
      priorityBg: "rgba(253,203,110,0.12)",
      borderColor: "rgba(253,203,110,0.25)",
      icon: "💰",
      title: "Review Fiber Optic Pricing",
      desc: "Fiber optic customers have higher monthly charges and increased churn risk. Consider a loyalty discount.",
    });
  }

  if (form.PaymentMethod === "Electronic check" || form.PaymentMethod === "Mailed check") {
    suggestions.push({
      priority: "Low Priority",
      priorityColor: "#00b894",
      priorityBg: "rgba(0,184,148,0.12)",
      borderColor: "rgba(0,184,148,0.25)",
      icon: "💳",
      title: "Switch to Auto-Payment",
      desc: "Customers on automatic payment (bank transfer or credit card) have lower churn rates. Encourage auto-pay enrollment.",
    });
  }

  if (form.Dependents === "No") {
    suggestions.push({
      priority: "Low Priority",
      priorityColor: "#00b894",
      priorityBg: "rgba(0,184,148,0.12)",
      borderColor: "rgba(0,184,148,0.25)",
      icon: "👨‍👩‍👧",
      title: "Offer a Family Plan",
      desc: "Customers without dependents are more likely to churn. A family or bundle plan may increase long-term loyalty.",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      priority: "Low Priority",
      priorityColor: "#00b894",
      priorityBg: "rgba(0,184,148,0.12)",
      borderColor: "rgba(0,184,148,0.25)",
      icon: "✅",
      title: "Customer Profile Looks Stable",
      desc: "This customer has a low churn risk profile. Maintain current service quality and check in periodically.",
    });
  }

  return suggestions;
}

function ResultPanel({ probability }) {
  const [barW, setBarW] = useState(0);
  const raw = parseFloat(probability);
  const pct = Math.min(100, Math.max(0, raw <= 1 ? Math.round(raw * 100) : Math.round(raw)));
  const color   = pct >= 70 ? "#e94560" : pct >= 45 ? "#fdcb6e" : "#00b894";
  const label   = pct >= 70 ? "High Risk" : pct >= 45 ? "Medium Risk" : "Low Risk";
  const icon    = pct >= 50 ? "⚠️" : "✅";
  const verdict = pct >= 50 ? "Likely to Churn" : "Likely to Stay";

  useEffect(() => {
    const t = setTimeout(() => setBarW(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1.4rem", padding:"0.5rem 0", width:"100%" }}>
      <div style={{ background:`${color}20`, border:`2px solid ${color}`, borderRadius:14, padding:"1.1rem 2rem", textAlign:"center", width:"100%" }}>
        <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
        <div style={{ fontSize:20, fontWeight:700, color, marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>{verdict}</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:58, fontWeight:800, color, lineHeight:1 }}>{pct}%</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.32)", marginTop:6, letterSpacing:"0.07em", textTransform:"uppercase" }}>Churn Probability</div>
      </div>
      <div style={{ width:"100%" }}>
        <div style={{ height:10, background:"rgba(255,255,255,0.07)", borderRadius:6, overflow:"hidden", position:"relative" }}>
          <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:"rgba(255,255,255,0.3)", zIndex:2 }}/>
          <div style={{ height:"100%", borderRadius:6, width:`${barW}%`, background:"linear-gradient(90deg,#00b894,#fdcb6e 50%,#e94560)", backgroundSize:"300px 100%", boxShadow:`0 0 10px ${color}99`, transition:"width 1.1s cubic-bezier(0.22,1,0.36,1)" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:10, color:"rgba(255,255,255,0.25)" }}>
          <span>0% Stay</span>
          <span style={{ color:"rgba(255,255,255,0.35)" }}>50% threshold</span>
          <span>100% Churn</span>
        </div>
      </div>
    </div>
  );
}

function RetentionSuggestions({ form, pct }) {
  const suggestions = buildSuggestions(form, pct);
  return (
    <div style={S.chartCard}>
      <div style={S.cardTitle}>Retention Suggestions</div>
      <div style={S.cardDesc}>Actions to reduce churn risk for this customer</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {suggestions.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px", borderRadius:10, background:s.priorityBg, border:`1px solid ${s.borderColor}` }}>
            <div style={{ width:36, height:36, borderRadius:8, background:`${s.priorityBg}`, border:`1px solid ${s.borderColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
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
  );
}

export default function Predict({ setPredictionData }) {
  const [form, setForm] = useState({
    InternetService: "DSL",
    OnlineSecurity: "No",
    TechSupport: "No",
    Dependents: "No",
    Contract: "Month-to-month",
    PaymentMethod: "Electronic check",
    tenure: "",
    MonthlyCharges: "",
    TotalCharges: "",
  });
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [revealed, setRevealed] = useState(false);
  const chartsRef               = useRef(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  
  const handleSubmit = async () => {
    setError(""); setResult(null); setRevealed(false); setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);

      
      const rawProb = data.probability ?? data.churn_probability ?? 0.5;
      const pct = Math.min(100, Math.max(0, rawProb <= 1 ? Math.round(rawProb * 100) : Math.round(rawProb)));
      setPredictionData({ form, pct, rawProb });

      setTimeout(() => {
        setRevealed(true);
        setTimeout(() => chartsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
      }, 80);
    } catch {
      setError("Could not reach the API. Make sure Django is running on port 8000.");
    } finally { setLoading(false); }
  };
          

  const rawProb   = result ? (result.probability ?? result.churn_probability ?? 0.5) : null;
  const pct       = rawProb !== null ? Math.min(100, Math.max(0, rawProb <= 1 ? Math.round(rawProb * 100) : Math.round(rawProb))) : null;
  const rColor    = pct !== null ? (pct >= 70 ? "#e94560" : pct >= 45 ? "#fdcb6e" : "#00b894") : "#5da0fa";
  const radarData = rawProb !== null ? buildRadar(form) : [];

  return (
    <div style={S.page}>
      <style>{css}</style>

      <div style={S.header}>
        <h2 style={S.h2}>Predict Customer Churn</h2>
        <p style={S.sub}>Fill in the customer profile to get an instant AI-powered prediction.</p>
      </div>

      {/* TOP ROW: form + result */}
      <div style={S.topRow}>
        <div style={S.formCard}>
          <div style={S.formGrid}>
            <div style={S.formCol}>
              <div style={S.sectionLabel}>🌐 Service Details</div>
              <Field label="Internet Service">
                <Sel value={form.InternetService} onChange={(v) => set("InternetService", v)}
                  options={["DSL","Fiber optic","No"]} />
              </Field>
              <Field label="Online Security">
                <Sel value={form.OnlineSecurity} onChange={(v) => set("OnlineSecurity", v)}
                  options={["Yes","No","No internet service"]} />
              </Field>
              <Field label="Tech Support">
                <Sel value={form.TechSupport} onChange={(v) => set("TechSupport", v)}
                  options={["Yes","No","No internet service"]} />
              </Field>
              <Field label="Dependents">
                <Sel value={form.Dependents} onChange={(v) => set("Dependents", v)}
                  options={["Yes","No"]} />
              </Field>
            </div>
            <div style={S.colDivider} />
            <div style={S.formCol}>
              <div style={S.sectionLabel}>💳 Account & Charges</div>
              <Field label="Contract">
                <Sel value={form.Contract} onChange={(v) => set("Contract", v)}
                  options={["Month-to-month","One year","Two year"]} />
              </Field>
              <Field label="Payment Method">
                <Sel value={form.PaymentMethod} onChange={(v) => set("PaymentMethod", v)}
                  options={["Bank transfer (automatic)","Credit card (automatic)","Electronic check","Mailed check"]} />
              </Field>
              <Field label="Tenure (months)">
                <input className="inp" style={S.input} type="number" min={0} max={72}
                  placeholder="e.g. 12" value={form.tenure} onChange={(e) => set("tenure", e.target.value)} />
              </Field>
              <Field label="Monthly Charges ($)">
                <input className="inp" style={S.input} type="number"
                  placeholder="e.g. 65.50" value={form.MonthlyCharges} onChange={(e) => set("MonthlyCharges", e.target.value)} />
              </Field>
              <Field label="Total Charges ($)">
                <input className="inp" style={S.input} type="number"
                  placeholder="e.g. 820.00" value={form.TotalCharges} onChange={(e) => set("TotalCharges", e.target.value)} />
              </Field>
            </div>
          </div>
          {error && <div style={S.error}>{error}</div>}
          <button className="submit-btn" style={S.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner"/> : "Predict Churn →"}
          </button>
        </div>

        <div style={{
          ...S.resultCard,
          borderColor: pct !== null ? `${rColor}55` : "rgba(255,255,255,0.07)",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(16px)",
          transition:"opacity 0.65s ease, transform 0.65s ease, border-color 0.4s",
          pointerEvents: revealed ? "auto" : "none",
        }}>
          {rawProb !== null ? (
            <ResultPanel probability={rawProb} />
          ) : (
            <div style={S.placeholder}>
              <div style={{ fontSize:40 }}>🎯</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", textAlign:"center" }}>
                Result will appear here after prediction
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHARTS + SUGGESTIONS (appear after prediction) */}
      {pct !== null && revealed && (
        <div ref={chartsRef} style={{ display:"flex", flexDirection:"column", gap:"1.25rem", animation:"fadeUp 0.7s ease forwards" }}>

          {/* STAT BOXES */}
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

          {/* RADAR + PIE */}
          <div style={S.chartRow}>
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

          {/* RETENTION SUGGESTIONS — full width */}
          <RetentionSuggestions form={form} pct={pct} />

        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:"0.8rem" }}>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:5 }}>{label}</div>
      {children}
    </div>
  );
}

function Sel({ value, onChange, options }) {
  return (
    <select className="dark-sel" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

const S = {
  page:        { maxWidth:1200, margin:"0 auto", padding:"2.5rem 1.5rem 4rem", display:"flex", flexDirection:"column", gap:"1.5rem" },
  header:      { textAlign:"center" },
  h2:          { fontSize:26, fontWeight:700, color:"#fff", marginBottom:8 },
  sub:         { color:"rgba(255,255,255,0.4)", fontSize:14 },
  topRow:      { display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:"1.5rem", alignItems:"start" },
  formCard:    { background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1rem" },
  formGrid:    { display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:"0" },
  formCol:     { display:"flex", flexDirection:"column" },
  colDivider:  { width:1, background:"rgba(255,255,255,0.07)", margin:"0 1.25rem" },
  sectionLabel:{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12, paddingBottom:8, borderBottom:"1px solid rgba(255,255,255,0.06)" },
  resultCard:  { background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"1.75rem", minHeight:340, display:"flex", alignItems:"center", justifyContent:"center" },
  chartRow:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" },
  chartCard:   { background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"1.25rem" },
  cardTitle:   { fontSize:14, fontWeight:600, color:"#fff", marginBottom:4 },
  cardDesc:    { fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:"0.75rem" },
  input:       { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 12px", color:"#fff", fontSize:13, fontFamily:"inherit", outline:"none" },
  btn:         { width:"100%", background:"#e94560", color:"#fff", border:"none", borderRadius:10, padding:"0.85rem", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8 },
  error:       { background:"rgba(233,69,96,0.1)", border:"1px solid rgba(233,69,96,0.3)", color:"#e94560", borderRadius:8, padding:"0.65rem 1rem", fontSize:13 },
  placeholder: { display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem", opacity:0.35 },
  statCard:    { background:"#1a1a2e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"1.5rem", textAlign:"center" },
  statLabel:   { fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 },
  statValue:   { fontSize:42, fontWeight:800, lineHeight:1, marginBottom:8 },
  statDesc:    { fontSize:12, color:"rgba(255,255,255,0.25)" },
};

const css = `
  .dark-sel {
    width:100%; background:#0f1b35;
    border:1px solid rgba(255,255,255,0.12); border-radius:8px;
    padding:8px 12px; color:#fff; font-size:13px; font-family:inherit;
    outline:none; cursor:pointer; appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a8a8b3' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 12px center;
  }
  .dark-sel option { background:#0f1b35; color:#fff; }
  .dark-sel:hover  { border-color:rgba(255,255,255,0.25); }
  .dark-sel:focus  { border-color:rgba(93,160,250,0.6); box-shadow:0 0 0 3px rgba(93,160,250,0.1); }
  .inp:focus { border-color:rgba(93,160,250,0.6) !important; box-shadow:0 0 0 3px rgba(93,160,250,0.1); }
  .inp:hover { border-color:rgba(255,255,255,0.2) !important; }
  .submit-btn:hover { background:#c73652 !important; transform:translateY(-2px) !important; box-shadow:0 8px 24px rgba(233,69,96,0.35) !important; transition:all 0.2s !important; }
  .submit-btn:active { transform:translateY(0) !important; }
  .submit-btn:disabled { opacity:0.6; cursor:not-allowed !important; }
  @keyframes spin { to{transform:rotate(360deg);} }
  .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
`;