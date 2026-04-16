from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import random
import os

app = FastAPI(title="Nexus AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained models
base_dir = os.path.dirname(os.path.abspath(__file__))
delay_model = joblib.load(os.path.join(base_dir, 'delay_model.pkl'))
maint_model = joblib.load(os.path.join(base_dir, 'maint_model.pkl'))

# Initialize base train states (mocking the database)
base_trains = [
  { "id": "12393", "trainNumber": "12393", "trainName": "Parasuram Express", "date": "2025-11-18", "departureTime": "03:13", "arrivalTime": "12:03", "origin": "Kannur", "destination": "Palakkad", "weather": "Clear", "platformNumber": "3", "nextServiceDueDays": 109, "currentLocation": "Kozhikode", "mileage": 64039, "lastMaintenanceDaysAgo": 91, "speed": 43, "occupancyPercentage": 68 },
  { "id": "12455", "trainNumber": "12455", "trainName": "Venad Express", "date": "2025-01-03", "departureTime": "07:16", "arrivalTime": "16:36", "origin": "Kollam", "destination": "Thrissur", "weather": "Clear", "platformNumber": "6", "nextServiceDueDays": 69, "currentLocation": "Ernakulam", "mileage": 49293, "lastMaintenanceDaysAgo": 131, "speed": 70, "occupancyPercentage": 82 },
  { "id": "12448", "trainNumber": "12448", "trainName": "Parasuram Express", "date": "2025-05-01", "departureTime": "04:51", "arrivalTime": "09:11", "origin": "Alappuzha", "destination": "Kozhikode", "weather": "Rain", "platformNumber": "3", "nextServiceDueDays": 146, "currentLocation": "Ernakulam", "mileage": 28223, "lastMaintenanceDaysAgo": 54, "speed": 78, "occupancyPercentage": 76 },
  { "id": "12956", "trainNumber": "12956", "trainName": "Ernad Express", "date": "2025-12-03", "departureTime": "06:30", "arrivalTime": "15:28", "origin": "Thrissur", "destination": "Kannur", "weather": "Clear", "platformNumber": "7", "nextServiceDueDays": 186, "currentLocation": "Kozhikode", "mileage": 21233, "lastMaintenanceDaysAgo": 14, "speed": 56, "occupancyPercentage": 50 },
  { "id": "12131", "trainNumber": "12131", "trainName": "Malabar Express", "date": "2025-03-08", "departureTime": "05:53", "arrivalTime": "10:19", "origin": "Trivandrum", "destination": "Palakkad", "weather": "Rain", "platformNumber": "8", "nextServiceDueDays": 29, "currentLocation": "Kollam", "mileage": 75069, "lastMaintenanceDaysAgo": 171, "speed": 74, "occupancyPercentage": 67 },
  { "id": "12094", "trainNumber": "12094", "trainName": "Intercity Express", "date": "2025-10-26", "departureTime": "05:06", "arrivalTime": "14:13", "origin": "Ernakulam", "destination": "Kollam", "weather": "Clear", "platformNumber": "9", "nextServiceDueDays": 121, "currentLocation": "Alappuzha", "mileage": 95121, "lastMaintenanceDaysAgo": 79, "speed": 52, "occupancyPercentage": 85 },
  { "id": "12003", "trainNumber": "12003", "trainName": "Kerala Express", "date": "2025-03-18", "departureTime": "10:52", "arrivalTime": "16:33", "origin": "Palakkad", "destination": "Kottayam", "weather": "Clear", "platformNumber": "8", "nextServiceDueDays": 200, "currentLocation": "Thrissur", "mileage": 20100, "lastMaintenanceDaysAgo": 180, "speed": 91, "occupancyPercentage": 68 },
  { "id": "12000", "trainNumber": "12000", "trainName": "Maveli Express", "date": "2025-07-26", "departureTime": "08:34", "arrivalTime": "12:48", "origin": "Alappuzha", "destination": "Kottayam", "weather": "Rain", "platformNumber": "4", "nextServiceDueDays": 15, "currentLocation": "Ernakulam", "mileage": 46906, "lastMaintenanceDaysAgo": 185, "speed": 85, "occupancyPercentage": 77 },
  { "id": "12844", "trainNumber": "12844", "trainName": "Jan Shatabdi Express", "date": "2025-08-27", "departureTime": "03:01", "arrivalTime": "12:06", "origin": "Alappuzha", "destination": "Kannur", "weather": "Rain", "platformNumber": "1", "nextServiceDueDays": 90, "currentLocation": "Kozhikode", "mileage": 41500, "lastMaintenanceDaysAgo": 110, "speed": 67, "occupancyPercentage": 71 },
  { "id": "12052", "trainNumber": "12052", "trainName": "Maveli Express", "date": "2025-11-18", "departureTime": "11:20", "arrivalTime": "20:29", "origin": "Kozhikode", "destination": "Kannur", "weather": "Heavy Rain", "platformNumber": "5", "nextServiceDueDays": 35, "currentLocation": "Thalassery", "mileage": 60465, "lastMaintenanceDaysAgo": 165, "speed": 99, "occupancyPercentage": 54 },
  { "id": "12549", "trainNumber": "12549", "trainName": "Ernad Express", "date": "2025-12-29", "departureTime": "08:27", "arrivalTime": "15:52", "origin": "Thrissur", "destination": "Palakkad", "weather": "Clear", "platformNumber": "10", "nextServiceDueDays": 164, "currentLocation": "Shoranur", "mileage": 96448, "lastMaintenanceDaysAgo": 36, "speed": 54, "occupancyPercentage": 87 },
  { "id": "12469", "trainNumber": "12469", "trainName": "Intercity Express", "date": "2025-08-25", "departureTime": "12:30", "arrivalTime": "22:22", "origin": "Kottayam", "destination": "Thrissur", "weather": "Rain", "platformNumber": "6", "nextServiceDueDays": 78, "currentLocation": "Ernakulam", "mileage": 33330, "lastMaintenanceDaysAgo": 122, "speed": 80, "occupancyPercentage": 67 },
  { "id": "12799", "trainNumber": "12799", "trainName": "Kerala Express", "date": "2025-12-04", "departureTime": "11:06", "arrivalTime": "14:22", "origin": "Kollam", "destination": "Alappuzha", "weather": "Clear", "platformNumber": "9", "nextServiceDueDays": 28, "currentLocation": "Kayamkulam", "mileage": 77386, "lastMaintenanceDaysAgo": 172, "speed": 87, "occupancyPercentage": 69 }
]

random.seed(42)
for t in base_trains:
    # Assign persistent hidden dynamics per train
    t["previous_delay"] = random.randint(0, 30)
    t["congestion"] = random.randint(1, 10)
    t["isAIFixed"] = False

@app.get("/api/trains")
def get_trains():
    response = []
    
    for t in base_trains:
        # Simulate real-time variance directly on the base states
        if not t.get("isAIFixed", False):
            t["speed"] = max(10, min(120, t.get("speed", 50) + random.randint(-5, 5)))
            t["occupancyPercentage"] = max(10, min(100, t.get("occupancyPercentage", 50) + random.randint(-2, 2)))
        
        # Prepare feature vector: speed, mileage, lastMaintenanceDaysAgo, previous_delay, congestion, occupancyPercentage
        features = [[
            t["speed"],
            t["mileage"],
            t["lastMaintenanceDaysAgo"],
            t["previous_delay"],
            t["congestion"],
            t["occupancyPercentage"]
        ]]
        
        predicted_delay = int(delay_model.predict(features)[0])
        predicted_health = maint_model.predict(features)[0]
        
        item = dict(t)
        
        # if AI fixed it, force delay to 0 and health to Healthy
        if t.get("isAIFixed"):
            item["delayMinutes"] = 0
            item["status"] = "On Time"
            item["maintenanceStatus"] = "Healthy"
        else:
            item["delayMinutes"] = max(0, predicted_delay)
            if item["delayMinutes"] > 15:
                item["status"] = "Delayed"
            elif item["delayMinutes"] > 0:
                item["status"] = "Slightly Delayed"
            else:
                item["status"] = "On Time"
            item["maintenanceStatus"] = predicted_health
            
        response.append(item)
    return response

@app.post("/api/optimize")
def optimize_route(train_id: str):
    found = False
    for t in base_trains:
        if t["id"] == train_id:
            # Emulate AI fixing the physical factors
            t["congestion"] = 1
            t["previous_delay"] = 0
            t["speed"] = 95 # Increase speed
            t["lastMaintenanceDaysAgo"] = 0 # reset hardware status theoretically
            t["isAIFixed"] = True
            found = True
            break
            
    if found:
        return {"status": "success", "message": "Nexus AI Route Optimized"}
    else:
        return {"status": "error", "message": "Train not found"}
