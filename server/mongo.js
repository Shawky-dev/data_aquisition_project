import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL);

export async function connectMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Mongo error:", e);
  }
}

export default client;
