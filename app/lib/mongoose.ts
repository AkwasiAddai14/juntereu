import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { determineLocation } from './country';
import { currentUser } from "@clerk/nextjs/server";
import Employer from "@/app/lib/models/employer.model";
import Employee from "@/app/lib/models/employee.model";

// Load environment variables from .env file
dotenv.config();

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

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

    // If there's already a connection attempt in progress, wait for it
    if (connectionPromise) {
        await connectionPromise;
        return;
    }

    connectionPromise = (async () => {
        try {
            // Try to get country-specific connection, fallback to default
            let connectionString;
            try {
                connectionString = await determineLocation();
            } catch (error) {
                console.log("Could not determine location, using fallback connection");
                connectionString = process.env.MONGODB_URL;
            }

            if(!connectionString || connectionString === 'Geen land geselecteerd') {
                console.log("No valid connection string found, using fallback.");
                connectionString = process.env.MONGODB_URL;
            }

            await mongoose.connect(connectionString!);
            isConnected = true;
            const dbName = mongoose.connection.db?.databaseName || "Unknown";
            console.log("Connected to MONGODB");
            console.log("Database name:", dbName);
            console.log("Connection string used:", connectionString!.substring(0, 50) + "...");
        } catch (error) {
            console.log("Error connecting to MONGODB:", error);
            // Reset connection state on error
            isConnected = false;
            throw error;
        } finally {
            connectionPromise = null;
        }
    })();

    await connectionPromise;
};
