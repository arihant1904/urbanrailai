import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
import joblib
import os

def generate_data(num_samples=5000):
    np.random.seed(42)
    speed = np.random.randint(40, 120, num_samples)
    mileage = np.random.randint(10000, 100000, num_samples)
    lastMaintenanceDaysAgo = np.random.randint(1, 200, num_samples)
    previous_delay = np.random.randint(0, 60, num_samples)
    congestion = np.random.randint(1, 10, num_samples) # 1 to 10 scale
    occupancyPercentage = np.random.randint(20, 100, num_samples)

    # Logic for delay
    # Congestion and occupancy increase delay, speed decreases it.
    delay_minutes = (congestion * 3.5) + (occupancyPercentage * 0.1) - (speed * 0.1) + previous_delay * 0.6 + np.random.normal(0, 5, num_samples)
    delay_minutes = np.maximum(0, delay_minutes).astype(int)

    # Logic for maintenance
    # High mileage and high last maintenance increases risk
    risk_score = (mileage / 100000) * 5 + (lastMaintenanceDaysAgo / 200) * 5 + np.random.normal(0, 1, num_samples)
    
    maintenance_status = []
    for score in risk_score:
        if score > 7.5:
            maintenance_status.append("Critical")
        elif score > 5.5:
            maintenance_status.append("Minor Issue")
        else:
            maintenance_status.append("Healthy")

    df = pd.DataFrame({
        'speed': speed,
        'mileage': mileage,
        'lastMaintenanceDaysAgo': lastMaintenanceDaysAgo,
        'previous_delay': previous_delay,
        'congestion': congestion,
        'occupancyPercentage': occupancyPercentage,
        'delay_minutes': delay_minutes,
        'maintenance_status': maintenance_status
    })
    return df

if __name__ == "__main__":
    print("Generating training data...")
    df = generate_data()
    df.to_csv('kerala_train_data.csv', index=False)
    print(f"Data saved to kerala_train_data.csv with {len(df)} records.")

    X = df[['speed', 'mileage', 'lastMaintenanceDaysAgo', 'previous_delay', 'congestion', 'occupancyPercentage']]
    y_delay = df['delay_minutes']
    y_maint = df['maintenance_status']

    print("Training RandomForestRegressor for Delay prediction...")
    regressor = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
    regressor.fit(X, y_delay)

    print("Training RandomForestClassifier for Maintenance prediction...")
    classifier = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42)
    classifier.fit(X, y_maint)

    joblib.dump(regressor, 'delay_model.pkl')
    joblib.dump(classifier, 'maint_model.pkl')
    print("Training complete! Models saved as 'delay_model.pkl' and 'maint_model.pkl'.")
