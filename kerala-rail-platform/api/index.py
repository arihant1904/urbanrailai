from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import joblib
import random
import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session

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

# Database Configuration
# Works dynamically with Vercel Postgres when deployed, and SQLite when local.
POSTGRES_URL = os.environ.get("POSTGRES_URL")

if not POSTGRES_URL:
    # If on Vercel but no Postgres linked, use /tmp (read-write) instead of ./ (read-only)
    if os.environ.get("VERCEL"):
        POSTGRES_URL = "sqlite:////tmp/trains.db"
    else:
        POSTGRES_URL = "sqlite:///./trains.db"
        
if POSTGRES_URL.startswith("postgres://"):
    POSTGRES_URL = POSTGRES_URL.replace("postgres://", "postgresql://", 1)

# SQLite specific config, others it will ignore
connect_args = {"check_same_thread": False} if "sqlite" in POSTGRES_URL else {}

engine = create_engine(POSTGRES_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Traim Model
class DbTrain(Base):
    __tablename__ = "trains"
    id = Column(String, primary_key=True, index=True)
    trainNumber = Column(String)
    trainName = Column(String)
    date = Column(String)
    departureTime = Column(String)
    arrivalTime = Column(String)
    origin = Column(String)
    destination = Column(String)
    weather = Column(String)
    platformNumber = Column(String)
    nextServiceDueDays = Column(Integer)
    currentLocation = Column(String)
    mileage = Column(Integer)
    lastMaintenanceDaysAgo = Column(Integer)
    speed = Column(Integer)
    occupancyPercentage = Column(Integer)
    previous_delay = Column(Integer)
    congestion = Column(Integer)
    isAIFixed = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize base train states if empty
def init_db():
    db = SessionLocal()
    if db.query(DbTrain).count() == 0:
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
        for t_data in base_trains:
            db_train = DbTrain(**t_data)
            db_train.previous_delay = random.randint(0, 30)
            db_train.congestion = random.randint(1, 10)
            db_train.isAIFixed = False
            db.add(db_train)
        db.commit()
    db.close()

# Run initialization
try:
    init_db()
except Exception as e:
    print(f"Error initializing DB: {e}")

@app.get("/api/trains")
def get_trains(db: Session = Depends(get_db)):
    trains = db.query(DbTrain).all()
    response = []
    
    for t in trains:
        # Simulate real-time variance directly on the database items
        if not t.isAIFixed:
            t.speed = max(10, min(120, t.speed + random.randint(-5, 5)))
            t.occupancyPercentage = max(10, min(100, t.occupancyPercentage + random.randint(-2, 2)))
        
        # Prepare feature vector: speed, mileage, lastMaintenanceDaysAgo, previous_delay, congestion, occupancyPercentage
        features = [[
            t.speed,
            t.mileage,
            t.lastMaintenanceDaysAgo,
            t.previous_delay,
            t.congestion,
            t.occupancyPercentage
        ]]
        
        predicted_delay = int(delay_model.predict(features)[0])
        predicted_health = maint_model.predict(features)[0]
        
        # Convert SQLAlchemy model to dict
        item = {column.name: getattr(t, column.name) for column in t.__table__.columns}
        
        # apply AI constraints
        if t.isAIFixed:
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
    
    # Save the updated speeds/occupancy back to database
    db.commit()
    
    return response

@app.post("/api/optimize")
def optimize_route(train_id: str, db: Session = Depends(get_db)):
    t = db.query(DbTrain).filter(DbTrain.id == train_id).first()
    if t:
        # Emulate AI fixing the physical factors and rewriting to DB
        t.congestion = 1
        t.previous_delay = 0
        t.speed = 95 # Increase speed
        t.lastMaintenanceDaysAgo = 0 # reset hardware status theoretically
        t.isAIFixed = True
        db.commit()
        return {"status": "success", "message": "Nexus AI Route Optimized"}
    else:
        return {"status": "error", "message": "Train not found"}

@app.post("/api/reset")
def reset_network(db: Session = Depends(get_db)):
    trains = db.query(DbTrain).all()
    for t in trains:
        t.isAIFixed = False
        t.congestion = random.randint(1, 10)
        t.previous_delay = random.randint(0, 30)
        t.lastMaintenanceDaysAgo = random.randint(1, 200)
    db.commit()
@app.get("/api/trains/{train_id}/ai-insights")
def get_ai_insights(train_id: str, db: Session = Depends(get_db)):
    t = db.query(DbTrain).filter(DbTrain.id == train_id).first()
    if t:
        features = [[
            t.speed,
            t.mileage,
            t.lastMaintenanceDaysAgo,
            t.previous_delay,
            t.congestion,
            t.occupancyPercentage
        ]]
        predicted_delay = float(delay_model.predict(features)[0])
        predicted_health = maint_model.predict(features)[0]
        return {
            "predictedDelayMinutes": max(0, predicted_delay * 1.15),
            "predictedMaintenanceStatus": predicted_health
        }
    return {"error": "Train not found"}

