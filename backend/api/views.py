from rest_framework.decorators import api_view
from rest_framework.response import Response
import pickle
import numpy as np
import os

# Load model files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, 'churn_model_top10.pkl'), 'rb') as f:
    model = pickle.load(f)

with open(os.path.join(BASE_DIR, 'feature_columns_top10.pkl'), 'rb') as f:
    feature_columns = pickle.load(f)

with open(os.path.join(BASE_DIR, 'scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

with open(os.path.join(BASE_DIR, 'threshold.pkl'), 'rb') as f:
    threshold = pickle.load(f)

@api_view(['POST'])
def predict_churn(request):
    try:
        data = request.data

        # Get inputs from request
        online_security = 1 if data['OnlineSecurity'] == 'Yes' else 0
        tenure = float(data['tenure'])
        tech_support = 1 if data['TechSupport'] == 'Yes' else 0
        monthly_charges = float(data['MonthlyCharges'])
        dependents = 1 if data['Dependents'] == 'Yes' else 0
        total_charges = float(data['TotalCharges'])

        # Contract encoding
        contract = data['Contract']
        contract_one_year = 1 if contract == 'One year' else 0
        contract_two_year = 1 if contract == 'Two year' else 0

        # InternetService encoding
        internet_service = data['InternetService']
        internet_fiber = 1 if internet_service == 'Fiber optic' else 0

        # PaymentMethod encoding
        payment_method = data['PaymentMethod']
        payment_mailed_check = 1 if payment_method == 'Mailed check' else 0

        # Scale numeric features
        numeric = scaler.transform([[tenure, monthly_charges, total_charges]])
        tenure_scaled = numeric[0][0]
        monthly_scaled = numeric[0][1]
        total_scaled = numeric[0][2]

        # Build feature array in correct order
        features = np.array([[
            online_security,
            tenure_scaled,
            contract_two_year,
            tech_support,
            contract_one_year,
            monthly_scaled,
            dependents,
            internet_fiber,
            total_scaled,
            payment_mailed_check
        ]])

        # Predict
        probability = model.predict_proba(features)[0][1]
        prediction = 1 if probability >= threshold else 0

        return Response({
            'prediction': int(prediction),
            'probability': round(float(probability) * 100, 2),
            'result': 'Will Churn' if prediction == 1 else 'Will Not Churn'
        })

    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
def get_features(request):
    return Response({'features': feature_columns})