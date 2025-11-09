import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
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
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to MONGODB");
} catch (error) {
        console.log("Error connecting to MONGODB:", error);
    }
};

type Experience = {
    bedrijf: string;
    functie: string;
    duur: string;
  };
  
  type Skills = {
    vaardigheid: string;
  };
  
  type Education = {
    naam: string;
    school: string;
    niveau?: string;
  };
  
  type Employee = {
    clerkId: string;
    firstname: string;
    infix?: string;
    lastname: string;
    country: string;
    dateOfBirth: Date;
    email?: string;
    phone?: string;
    postcode: string;
    housenumber: string;
    street: string;
    city: string;
    onboarded: boolean;
    taxBenefit?: boolean;
    SalaryTaxDiscount?: boolean;
    VATidnr?: string;
    iban: string;
    bio?: string;
    companyRegistrationNumber?: string;
    profilephoto?: any;
    experience?: Experience[];
    skills?: Skills[];
    education?: Education[];
    SocialSecurity?: string; // Ensure bsn is included as it is required in the schema
  };


export const createNCEmployee = async (user:Employee) => {
    try {
      // Connection should already be established by the caller (createEmployee)
      // Check if connected, but don't reconnect as it might switch to wrong database
      if (mongoose.connection.readyState !== 1) {
        console.log("DB connection not established - this should not happen");
        throw new Error("DB connection not established. Please ensure getDatabaseConnection is called first.");
      }
      
      console.log("Using existing database connection:", mongoose.connection.db?.databaseName);
      
      const newEmployee = await Employee.create(user);
      await Employee.findOneAndUpdate({clerkId: user.clerkId}, {
        onboarded:false
      },
      {
        upsert:true, new: true 
      });
      
        return JSON.parse(JSON.stringify(newEmployee))
        
        } 
    catch (error: any) {
          throw new Error(`Failed to create or update user: ${error.message}`);
      }
}

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider, e.g., Gmail, SendGrid, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  interface EmailContent {
    subject: string;
    text: string;
  }
  
  function generateEmailContent(bedrijfDetails: any): EmailContent {

    return {
        subject: `Gefeliciteerd! Een nieuw bedrijf heeft zich aangemeld: ${bedrijfDetails.displayname}`,
        text: `
        Gefeliciteerd! Een nieuw bedrijf heeft zich aangemeld:
        Contactpersoon: ${bedrijfDetails.name}
        emailadres: ${bedrijfDetails.email}
        telefoonnummer: ${bedrijfDetails.phone}
        KVK-nummmer: ${bedrijfDetails.CompanyRegistrationNumber}
        Straat: ${bedrijfDetails.street}
        Huisnummer: ${bedrijfDetails.housenumber}
        postcode: ${bedrijfDetails.postcode}
        stad: ${bedrijfDetails.city}
        Maak ze helemaal wegwijs op het platform!
        `,
    };
};

export async function sendEmailBasedOnStatus(Email: string, bedrijfDetails: any, ) {
    const emailContent = generateEmailContent(bedrijfDetails);
  
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: Email,
        subject: emailContent.subject,
        text: emailContent.text,
    };
  
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to ' + Email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
  }

type company = {
    clerkId: string,
    profilephoto: string,
    name: string,
    displayname: string,
    CompanyRegistrationNumber: string,
    VATidnr: string,
    postcode: string,
    housenumber: string,
    city: string,
    street: string,
    email: string,
    phone: string,
    iban: string,
};



export async function maakGLBedrijf(organization: company) {
    try {
        // Connection should already be established by the caller (maakBedrijf)
        // Check if connected, but don't reconnect as it might switch to wrong database
        if (mongoose.connection.readyState !== 1) {
            console.log("DB connection not established - this should not happen");
            throw new Error("DB connection not established. Please ensure getDatabaseConnection is called first.");
        }
        
        console.log("Using existing database connection:", mongoose.connection.db?.databaseName);

        console.log("Creating a new bedrijf document...");
        const newBedrijf = new Employer(organization);
        
        await newBedrijf.save();
        console.log("Document saved successfully:", newBedrijf);
        await sendEmailBasedOnStatus('akwasivdsm@gmail.com', newBedrijf);
        return newBedrijf;
    } catch (error) {
        console.error('Error creating bedrijf:', error);
        throw new Error('Error creating bedrijf');
    }
}