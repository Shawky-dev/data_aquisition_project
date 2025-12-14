import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL);

let db;
let motionCollection;

export async function connectMongo() {
  try {
    await client.connect();
    db = client.db("motion_detection");
    motionCollection = db.collection("detections");
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Mongo error:", e);
  }
}

export async function saveMotionDetection(distance) {
  try {
    const record = {
      timestamp: new Date(),
      distance: parseFloat(distance),
    };
    await motionCollection.insertOne(record);
    return record;
  } catch (e) {
    console.error("Error saving motion detection:", e);
    return null;
  }
}

export async function getAllDetections() {
  try {
    const records = await motionCollection.find({}).sort({ timestamp: -1 }).toArray();
    return records;
  } catch (e) {
    console.error("Error fetching detections:", e);
    return [];
  }
}

export default client;
