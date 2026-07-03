import pandas as pd
import numpy as np

df = pd.read_csv('telco_churn.csv')

# Drop customerID - not useful
df.drop(columns=['customerID'], inplace=True)

# Fix TotalCharges - convert to numeric (spaces become NaN)
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')

# Check how many NaN appeared after conversion
#print("NaN in TotalCharges:", df['TotalCharges'].isna().sum())

# Drop those NaN rows (will be very few)
df.dropna(inplace=True)

# Fix Churn - convert Yes/No to 1/0
df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})

# Confirm fixes
# print("\nUpdated Shape:", df.shape)
# print("\nUpdated Types:\n", df.dtypes)
# print("\nChurn value counts:\n", df['Churn'].value_counts())
# Label Encoding - binary columns (only 2 values)
binary_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 
               'PaperlessBilling', 'MultipleLines', 'OnlineSecurity', 
               'OnlineBackup', 'DeviceProtection', 'TechSupport', 
               'StreamingTV', 'StreamingMovies']

from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()

for col in binary_cols:
    df[col] = le.fit_transform(df[col])

# One Hot Encoding - columns with 3+ categories
df = pd.get_dummies(df, columns=['InternetService', 'Contract', 'PaymentMethod'], 
                    drop_first=True)

# Confirm
# Convert True/False to 1/0
df = df.astype({col: int for col in df.select_dtypes(bool).columns})

# print(df.head())
# print("New Shape:", df.shape)
# print("\nColumn Names:\n", df.columns.tolist())
# print("\nFirst 5 rows:\n", df.head())
from sklearn.preprocessing import StandardScaler

# Only scale these 3 numeric columns
scale_cols = ['tenure', 'MonthlyCharges', 'TotalCharges']

scaler = StandardScaler()
df[scale_cols] = scaler.fit_transform(df[scale_cols])

# Confirm
# print("Scaled values sample:")
# print(df[scale_cols].head())
# print("\nStats after scaling:")
# print(df[scale_cols].describe().round(2))
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Split X and y
X = df.drop(columns=['Churn'])
y = df['Churn']

# Split into train and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

# print("Training size:", X_train.shape)
# print("Testing size:", X_test.shape)

# Build Logistic Regression model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
# print("\nAccuracy:",round(accuracy_score(y_test, y_pred),4))
# print("\nClassification Report:\n", classification_report(y_test, y_pred))
# print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import roc_auc_score
from imblearn.over_sampling import SMOTE

# Fix class imbalance using SMOTE
smote = SMOTE(random_state=42)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)

# print("Before SMOTE:", y_train.value_counts().to_dict())
# print("After SMOTE:", y_train_sm.value_counts().to_dict())

# Test 3 models
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42)
}

for name, model in models.items():
    model.fit(X_train_sm, y_train_sm)
    y_pred = model.predict(X_test)
    acc = round(accuracy_score(y_test, y_pred), 4)
    auc = round(roc_auc_score(y_test, y_pred), 4)
    # print(f"\n{name}")
    # print(f"  Accuracy : {acc}")
    # print(f"  AUC Score: {auc}")
    # print(f"  Classification Report:\n{classification_report(y_test, y_pred)}")
    from sklearn.model_selection import GridSearchCV

# Define parameters to try
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.05, 0.1],
    'min_samples_split': [2, 5, 10]
}

# Grid Search with cross validation
grid_search = GridSearchCV(
    GradientBoostingClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
    verbose=0
)

grid_search.fit(X_train_sm, y_train_sm)

# Best parameters
# print("\nBest Parameters:", grid_search.best_params_)
#print("Best AUC Score:", round(grid_search.best_score_, 4))

# Evaluate best model
best_model = grid_search.best_estimator_
y_pred_best = best_model.predict(X_test)

# print("\nTuned Model Results:")
# print("Accuracy:", round(accuracy_score(y_test, y_pred_best), 4))
# print("AUC Score:", round(roc_auc_score(y_test, y_pred_best), 4))
# print("\nClassification Report:\n", classification_report(y_test, y_pred_best))
# Get the GB model from the models dict (SMOTE trained)
gb_model = models['Gradient Boosting']

# Get probabilities
y_probs = gb_model.predict_proba(X_test)[:, 1]

# Try different thresholds
from sklearn.metrics import recall_score, precision_score, f1_score
import numpy as np

thresholds = np.arange(0.1, 0.9, 0.05)

# print(f"{'Threshold':<12} {'Accuracy':<12} {'Recall':<12} {'Precision':<12} {'F1':<12}")
# print("-" * 60)

for thresh in thresholds:
    y_pred_thresh = (y_probs >= thresh).astype(int)
    acc = round(accuracy_score(y_test, y_pred_thresh), 3)
    rec = round(recall_score(y_test, y_pred_thresh), 3)
    pre = round(precision_score(y_test, y_pred_thresh), 3)
    f1 = round(f1_score(y_test, y_pred_thresh), 3)
    #print(f"{thresh:<12.2f} {acc:<12} {rec:<12} {pre:<12} {f1:<12}")
import pickle

# Save model, scaler, threshold and feature columns
best_threshold = 0.50

with open('churn_model.pkl', 'wb') as f:
    pickle.dump(gb_model, f)

with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

with open('feature_columns.pkl', 'wb') as f:
    pickle.dump(X.columns.tolist(), f)

with open('threshold.pkl', 'wb') as f:
    pickle.dump(best_threshold, f)

# print("✅ Model saved!")
# print("✅ Scaler saved!")
# print("✅ Feature columns saved!")
# print("✅ Threshold saved:", best_threshold)
# Pick some real customers from test set
# print("Checking real predictions:\n")
# print(f"{'Customer':<12} {'Actual':<12} {'Predicted':<12} {'Probability':<12} {'Result':<12}")
# print("-" * 60)

for i in range(10):
    actual = y_test.iloc[i]
    prob = y_probs[i]
    predicted = 1 if prob >= best_threshold else 0
    result = "✅ Correct" if actual == predicted else "❌ Wrong"
    #print(f"{i+1:<12} {actual:<12} {predicted:<12} {prob:<12.3f} {result}")
    import matplotlib.pyplot as plt
import pandas as pd

# Get feature importances from GB model
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': gb_model.feature_importances_
}).sort_values('Importance', ascending=False)

# print("Top 10 Most Important Features:")
# print(feature_importance.head(10))

# Plot
plt.figure(figsize=(10, 6))
plt.barh(feature_importance['Feature'][:10][::-1], 
         feature_importance['Importance'][:10][::-1])
plt.xlabel('Importance Score')
plt.title('Top 10 Feature Importances')
plt.tight_layout()
plt.savefig('feature_importance.png')
#plt.show()
#print("✅ Plot saved as feature_importance.png")
# Select only top 10 features
top_features = ['OnlineSecurity', 'tenure', 'Contract_Two year', 
                'TechSupport', 'Contract_One year', 'MonthlyCharges',
                'Dependents', 'InternetService_Fiber optic', 
                'TotalCharges', 'PaymentMethod_Mailed check']

X_top = df[top_features]
y = df['Churn']

# Retrain with top 10 features
X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(
    X_top, y, test_size=0.2, random_state=42, stratify=y)

smote = SMOTE(random_state=42)
X_train_sm_t, y_train_sm_t = smote.fit_resample(X_train_t, y_train_t)

gb_model_top = GradientBoostingClassifier(random_state=42)
gb_model_top.fit(X_train_sm_t, y_train_sm_t)

y_pred_top = gb_model_top.predict(X_test_t)
y_probs_top = gb_model_top.predict_proba(X_test_t)[:, 1]

# print("Top 10 Model Results:")
# print("Accuracy:", round(accuracy_score(y_test_t, y_pred_top), 4))
# print("AUC Score:", round(roc_auc_score(y_test_t, y_pred_top), 4))
# print("\nClassification Report:\n", classification_report(y_test_t, y_pred_top))
# Save top 10 model
with open('churn_model_top10.pkl', 'wb') as f:
    pickle.dump(gb_model_top, f)

with open('feature_columns_top10.pkl', 'wb') as f:
    pickle.dump(top_features, f)

# print("✅ Top 10 model saved!")
# print("✅ Top 10 feature columns saved!")
# print("\nFinal Model Summary:")
# print("Features used:", len(top_features))
# print("AUC Score:", 0.755)
# print("Churn Recall:", 0.80)
# print("Threshold:", 0.50)
# # Check top 10 model predictions
# print("Checking Top 10 Model Predictions:\n")
# print(f"{'Customer':<12} {'Actual':<12} {'Predicted':<12} {'Probability':<12} {'Result':<12}")
# print("-" * 60)

y_probs_top = gb_model_top.predict_proba(X_test_t)[:, 1]

for i in range(10):
    actual = y_test_t.iloc[i]
    prob = y_probs_top[i]
    predicted = 1 if prob >= 0.50 else 0
    result = "✅ Correct" if actual == predicted else "❌ Wrong"
    print(f"{i+1:<12} {actual:<12} {predicted:<12} {prob:<12.3f} {result}")