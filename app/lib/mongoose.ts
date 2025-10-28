import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { determineLocation } from './country';
import { currentUser } from "@clerk/nextjs/server";
import Employer from "@/app/lib/models/employer.model";
import Employee from "@/app/lib/models/employee.model";

// Load environment variables from .env file
dotenv.config();

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) {
        console.log("MONGODB_URL not found");
        return;
    }
    if (isConnected) {
        console.log("Already connected to MONGODB");
        console.log("Current database:", mongoose.connection.db?.databaseName || "Unknown");
        return;
    }

    try {
       
        const connectionString = await determineLocation();

         if(!connectionString || connectionString === 'Geen land geselecteerd') {
            console.log("No valid connection string found.");
            // Use fallback connection
            if (!process.env.MONGODB_URL) {
                throw new Error("Fallback MONGODB_URL not set in .env");
            }
            await mongoose.connect(process.env.MONGODB_URL);
            isConnected = true;
            const dbName = mongoose.connection.db?.databaseName || "Unknown";
            console.log("Connected to MONGODB using fallback URL");
            console.log("Database name:", dbName);
            return;
        } else {
            await mongoose.connect(connectionString);
            isConnected = true;
            const dbName = mongoose.connection.db?.databaseName || "Unknown";
            console.log("Connected to MONGODB");
            console.log("Database name:", dbName);
            console.log("Connection string used:", connectionString.substring(0, 50) + "...");
        }
    } catch (error) {
        console.log("Error connecting to MONGODB:", error);
    }
};
