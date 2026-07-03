from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_churn, name='predict_churn'),
    path('features/', views.get_features, name='get_features'),
]