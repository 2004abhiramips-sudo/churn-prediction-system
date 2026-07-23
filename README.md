# ChurnPredict — Telecom Customer Churn Prediction

An AI-powered web application that predicts whether a telecom customer is likely to churn, built with a **React** frontend, **Django REST Framework** backend, and a **Gradient Boosting** machine learning model trained on the Telco Customer Churn dataset.

---

## Overview

Customer churn is one of the biggest challenges telecom companies face. ChurnPredict allows users to input customer details and instantly receive a churn prediction along with a probability score, helping businesses identify at-risk customers and take proactive retention measures.

---

## Features

- 🔮 **Real-time churn prediction** based on customer demographics, account, and service usage data
- 📊 **Insights dashboard** highlighting key churn-driving factors
- ⚡ **Fast REST API** built with Django REST Framework
- 🎯 **Gradient Boosting model** trained on the top 10 most predictive features for improved accuracy and speed
- 🖥️ **Clean, responsive UI** built with React

---

## Tech Stack

**Frontend**
- React
- CSS

**Backend**
- Django
- Django REST Framework (DRF)

**Machine Learning**
- Python
- scikit-learn (Gradient Boosting Classifier)
- pandas / numpy

**Dataset**
- [Telco Customer Churn Dataset](https://www.kaggle.com/datasets/blastchar/telco-customer-churn)

---

## Project Structure

```
churnpredictionsystem/
├── backend/
│   ├── api/                     # Django REST API app
│   ├── backend/                 # Django project settings
│   ├── churn_model_top10.pkl    # Trained Gradient Boosting model
│   ├── scaler.pkl                # Feature scaler
│   ├── feature_columns_top10.pkl # Feature columns used by the model
│   ├── threshold.pkl              # Classification threshold
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   ├── Insights.js
│   │   │   ├── Navbar.js
│   │   │   └── Predict.js
│   │   └── App.js
│   └── package.json
├── churn_prediction.py          # Model training script
├── telco_churn.csv               # Training dataset
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js and npm
- pip

### 1. Clone the repository
```bash
git clone https://github.com/2004abhiramips-sudo/churn-prediction-system.git
cd churn-prediction-system
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
The backend will run at `http://127.0.0.1:8000/`

### 3. Frontend Setup (React)
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
The frontend will run at `http://localhost:3000/`

---

## How It Works

1. The user enters customer details (tenure, contract type, monthly charges, services subscribed, etc.) through the React form.
2. The data is sent to the Django REST API.
3. The backend preprocesses the input using the saved `scaler.pkl` and aligns it with `feature_columns_top10.pkl`.
4. The Gradient Boosting model (`churn_model_top10.pkl`) predicts the churn probability.
5. The result — **Churn** or **No Churn** with a confidence score — is returned and displayed on the frontend.

---

## Model Details

- **Algorithm**: Gradient Boosting Classifier
- **Dataset**: Telco Customer Churn (7,043 customers, 21 features)
- **Feature Selection**: Top 10 most predictive features used for the final model to balance accuracy and performance
- **Preprocessing**: One-Hot Encoding for categorical variables, feature scaling for numerical variables

---

## Future Improvements

- [ ] Add model explainability (SHAP values) to show why a customer was flagged as at-risk
- [ ] Deploy the app (e.g., Render/Vercel for frontend, Railway/Render for backend)
- [ ] Add authentication for saved prediction history
- [ ] Expand dashboard with more visual analytics

---

## Author

**Abhirami P S**
- GitHub: [@ps-abhirami](https://github.com/ps-abhirami)
- LinkedIn: [abhirami-ps](https://www.linkedin.com/in/abhirami-ps)

---

## License

This project is open source and available under the [MIT License](LICENSE).
