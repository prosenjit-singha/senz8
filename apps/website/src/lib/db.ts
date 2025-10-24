import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const dbClient = new MongoClient(process.env.MONGODB_URI!);
export const db = dbClient.db();

export const mongodb = mongodbAdapter(db, { client: dbClient });

// optional Mongoose init for your app
export const connectMongoose = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
};
