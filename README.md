# 🌾 CropWise — Intelligent Crop Recommendation System

A full-stack web application that provides AI-powered crop recommendations, farm management tools, weather insights, soil analysis, and comprehensive analytics for modern farmers.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, SCSS, Chart.js, React Router v6, Material-UI, Context API |
| **Backend** | Django 4.2, Django REST Framework, SimpleJWT |
| **ML Pipeline** | scikit-learn, XGBoost, pandas, numpy | 
| **DL Pipeline** | Open-CV, Pillow, Tensor Flow-2.20, Keras-3.12|
| **Database** | SQLite (default) |
| **Weather API** | tomorrow.io (no API key needed) |

## Features

- **🤖 Crop Recommendation** — ML model trained on 23 crops using 7 soil/climate features with top-k predictions
- **📍 Location-Based Prediction** — Auto-fetches weather data from coordinates for recommendations
- **📋 Farm Records** — Full CRUD for planting, harvest, sales, expenses, and resources
- **☁️ Weather Dashboard** — Real-time weather, 7-day forecast, agricultural recommendations
- **🧪 Soil Analysis** — Soil test tracking, nutrient recommendations, image analysis
- **📊 Analytics** — Yield trends, financial summaries, crop distribution, cost estimator
- **🏆 Achievements** — Gamified milestones for farming activities
- **🔐 JWT Authentication** — Secure login/register with token refresh

## ML Model

The crop recommendation engine trains 7 models and selects the best:

1. Logistic Regression
2. K-Nearest Neighbors
3. Naive Bayes
4. Decision Tree
5. Random Forest
6. Gradient Boosting
7. Support Vector Machine

## DL Model

The crop recommendation engine trains 4 Deep Learning models and selects the best and also image processing:


1. Convolutional Nural Network(CNN)

Input features: Nitrogen, Phosphorus, Potassium, Temperature, Humidity, pH, Rainfall

Supports 23 crops including rice, wheat, maize, cotton, coffee, and more.

