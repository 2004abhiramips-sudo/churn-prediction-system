# ChurnPredict

**ChurnPredict** is a full-stack machine learning application that predicts telecom customer churn probability in real time and surfaces actionable retention insights through an interactive analytics dashboard.

The backend is powered by a Gradient Boosting classifier trained on the Telco Customer Churn dataset. The frontend is a React.js dashboard with animated risk gauges, radar charts, and a prioritized retention suggestion panel — all connected through a Django REST API.

---

## Demo

> Enter a customer profile → get a churn probability score → see which risk factors are driving it → receive targeted retention recommendations.

| Predict | Risk Radar | Retention Panel |
|---------|------------|-----------------|
| Input form with live validation | 9-axis customer risk radar | Prioritized action cards |
| Animated probability gauge | Color-coded risk zones | High / Medium / Low priority |
| High / Medium / Low risk label | Built from customer inputs | Actionable business steps |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Recharts |
| Backend | Python, Django, Django REST Framework |
| ML Model | Scikit-learn — Gradient Boosting Classifier |
| Data Processing | Pandas, NumPy |
| Class Balancing | SMOTE (imbalanced-learn) |
| Hyperparameter Tuning | GridSearchCV |
| Model Serialization | Pickle |
| Dataset | [Telco Customer Churn — Kaggle](https://www.kaggle.com/datasets/blastchar/telco-customer-churn) |

---

## Model Performance

| Metric | Value |
|--------|-------|
| Accuracy | 74% |
| Precision | 70% |
| Recall | 80% |
| F1-Score | 75% |
| ROC-AUC | 75.5% |

The model prioritizes **Recall** — catching as many at-risk customers as possible matters more than minimizing false positives in a churn context.

### Confusion Matrix

| | Predicted: Stay | Predicted: Churn |
|---|---|---|
| **Actual: Stay** | 763 | 272 |
| **Actual: Churn** | 77 | 297 |

---

## Features

**Prediction**
- Real-time churn probability score (0–100%)
- Risk classification: Low / Medium / High
- Animated gradient probability bar with a 50% decision threshold marker

**Risk Radar Chart**
- 9-axis radar built from the customer's own inputs
- Axes: Security, Contract, Tenure, Support, Charges, Dependents, Internet, TotalCharges, Payment
- Visually highlights which factors are elevating risk

**Retention Suggestions Panel**
- Auto-generated, prioritized action cards based on the customer's profile
- Examples: offer a one-year contract, add online security, switch to auto-payment, review fiber optic pricing
- Color-coded by priority — red (High), yellow (Medium), green (Low)

**Dataset Overview**
- Donut chart showing baseline churn distribution across 7,032 customers (73.4% Stay / 26.6% Churn)

**Model Stats Cards**
- AUC Score: 0.755
- Decision Threshold: 0.50
- Churn Recall: 0.80

---

## Project Structure

```
churnpredictionsystem/
├── backend/
│   ├── api/
│   │   └── views.py          # Prediction endpoint
│   ├── ml/
│   │   ├── churn_model_top10.pkl
│   │   └── threshold.pkl
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   └── components/
    │       ├── Predict.jsx   # Prediction form + charts
    │       └── Insights.jsx  # Analytics dashboard
    ├── public/
    └── package.json
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- pip

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        
pip install -r requirements.txt
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The dashboard will open at `http://localhost:3000`.

---

## API

### `POST /api/predict/`

**Request body (JSON)**

```json
{
  "tenure": 12,
  "Contract": "Month-to-month",
  "MonthlyCharges": 65.50,
  "TotalCharges": 820.00,
  "InternetService": "Fiber optic",
  "OnlineSecurity": "No",
  "TechSupport": "No",
  "PaymentMethod": "Electronic check",
  "Dependents": "No"
}
```

**Response**

```json
{
  "prediction": 1,
  "churn_probability": 0.79,
  "predicted_class": "Churn",
  "risk_category": "High Risk",
  "result_label": "Likely to Churn"
}
```

---

## ML Pipeline

1. **Feature Selection** — Top 10 features: Tenure, Contract, MonthlyCharges, TotalCharges, InternetService, OnlineSecurity, TechSupport, PaymentMethod, Dependents + engineered features
2. **Feature Engineering** — AvgMonthlySpend, ValueScore, LongTermCustomer indicator
3. **Preprocessing** — Label encoding, one-hot encoding, StandardScaler
4. **Class Balancing** — SMOTE (1,495 → 4,130 churn samples)
5. **Training** — 80/20 stratified split, GridSearchCV hyperparameter tuning
6. **Threshold** — 0.50 (evaluated against Recall/Precision tradeoff)

### Risk Classification

| Probability | Risk Category |
|-------------|--------------|
| 0.00 – 0.39 | 🟢 Low Risk |
| 0.40 – 0.69 | 🟡 Medium Risk |
| 0.70 – 1.00 | 🔴 High Risk |

---

## Future Scope

- Real-time customer activity data integration
- CRM platform connectors (Salesforce, HubSpot, Zoho)
- Explainable AI — SHAP / LIME feature attribution
- Advanced models — LightGBM, CatBoost, Deep Learning
- Cloud deployment — AWS / Azure / GCP
- Batch prediction, authentication, and automated reporting

---

## Acknowledgements

- Dataset: [IBM Telco Customer Churn](https://www.kaggle.com/datasets/blastchar/telco-customer-churn) via Kaggle
- Visualization: [Recharts](https://recharts.org)
- ML Framework: [Scikit-learn](https://scikit-learn.org)

---