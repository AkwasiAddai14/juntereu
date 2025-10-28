"use server"

import { connectToDB } from "../mongoose";
import mongoose from "mongoose";
import Employer from "../models/employer.model";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from 'nodemailer';
import Employee from "../models/employee.model";
import { maakGLBedrijf } from "../onboarding";
import { redirect } from "next/navigation";
import { getDatabaseConnection, getCountryFunctions } from "../database-connection";

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
        Contactpersoon: ${bedrijfDetails.displayname}
        emailadres: ${bedrijfDetails.emailadres}
        telefoonnummer: ${bedrijfDetails.telefoonnummer}
        KVK-nummmer: ${bedrijfDetails.CompanyRegistrationNumber}
        Straat: ${bedrijfDetails.steet}
        Huisnummer: ${bedrijfDetails.housenumber}
        postcode: ${bedrijfDetails.postcode}
        stad: ${bedrijfDetails.city}
        Maak ze helemaal wegwijs op het platform!
        `,
    };
}

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
    country: string,
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



export async function maakBedrijf(organization: company) {
    try {
        const userInfo = await currentUser();
        const country = userInfo?.unsafeMetadata?.country as string;
        
        // Connect to the appropriate database based on country
        const connected = await getDatabaseConnection( organization.country ?? country ?? 'Nederland' );
        
        if (!connected) {
            console.error('Failed to connect to database');
            throw new Error('Database connection failed');
        }

        // Get country-specific functions
        const countryFunctions = await getCountryFunctions(country || 'Nederland');
        console.log(`Using functions for ${country}:`, countryFunctions);

        // Call country-specific function if available
        if (country && countryFunctions.createEmployer === 'maakGLBedrijf') {
            console.log(`Calling country-specific function for ${country}`);
            return await maakGLBedrijf(organization);
        }
        
        // Default database operations
        if (mongoose.connection.readyState === 1) {
            console.log("Connected to database");
        } else {
            console.log("DB connection attempt failed");
            throw new Error("DB connection attempt failed");
        }

        console.log("Creating a new bedrijf document...");
        const newBedrijf = new Employer(organization);
        
        await newBedrijf.save();
        console.log("Document saved successfully:", newBedrijf);
        await sendEmailBasedOnStatus('akwasivdsm@gmail.com', newBedrijf);
        
        // Convert to plain object for serialization
        const plainBedrijf = newBedrijf.toObject();
        return plainBedrijf;
    } catch (error) {
        console.error('Error creating bedrijf:', error);
        throw new Error('Error creating bedrijf');
    }
}

export const checkOnboardingStatusEmployer = async (clerkId:string) => {
    try {
      await connectToDB();
     
      const employer = await Employer.findOne({clerkId: clerkId})
      
      return employer?.onboarded ?? null;
    } catch (error) {
      console.error('failed to find stauts:', error);
      throw new Error('Failed to find status');
    }
  }

export async function updateBedrijf( organization: company)
{

    try {
        await connectToDB();
        const newBedrijf = await Employer.create(organization);
        return JSON.parse(JSON.stringify(newBedrijf))
        } 
    catch (error: any) {
                throw new Error(`Failed to create or update user: ${error.message}`);
            }
};


  export async function verwijderBedrijf(organization: company) {
    try {
        await connectToDB();
        const deletedBedrijf = await Employer.findOneAndDelete(organization);

        if (!deletedBedrijf) {
            throw new Error('Bedrijf not found');
        }

        return { success: true, message: 'Bedrijf deleted successfully' };
    } catch (error) {
        console.error('Error deleting bedrijf:', error);
        throw new Error('Error deleting bedrijf');
    }
}

export async function zoekBedrijf({
    clerkId,
    searchString = "",
    pageNumber = 1,
    pageSize = 40,
    sortBy = 'desc'
}: {
    clerkId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: 'asc' | 'desc';
}) {
    try {
        // Build the query object
        await connectToDB()
        const query: any = { clerkId };

        if (searchString) {
            query.$or = [
                { naam: { $regex: searchString, $options: 'i' } },
                { kvknr: { $regex: searchString, $options: 'i' } },
                { btwnr: { $regex: searchString, $options: 'i' } },
                { postcode: { $regex: searchString, $options: 'i' } },
                { emailadres: { $regex: searchString, $options: 'i' } },
                { telefoonnummer: { $regex: searchString, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (pageNumber - 1) * pageSize;

        // Retrieve the documents from the database
        const bedrijven = await Employer.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ naam: sortBy });

        // Get the total count for pagination
        const totalCount = await Employer.countDocuments(query);

        return {
            bedrijven,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: pageNumber
        };
    } catch (error) {
        console.error('Error searching for bedrijven:', error);
        throw new Error('Error searching for bedrijven');
    }
}

export const fetchBedrijfDetails = async (clerkId: string) => {
    try {
      await connectToDB();
      const bedrijf = await Employer.findOne({ clerkId: clerkId }).lean();
      if (bedrijf) {
        return bedrijf;
      }
      throw new Error('Bedrijf not found');
    } catch (error) {
      console.error('Error fetching bedrijf details:', error);
      throw error;
    }
  };

  export const fetchBedrijfByClerkId = async (clerkId: string) => {
    try {
        await connectToDB()
        const bedrijf = await Employer.findOne({ clerkId: clerkId }).lean();
    if (bedrijf) {
      console.log('Found Bedrijf: ', JSON.stringify(bedrijf, null, 2));  // Log the entire bedrijf object
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(bedrijf));
    } else {
      console.log('No bedrijf found for clerkId:', clerkId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching bedrijf details:', error);
    throw error;
    }
  };

  export const isBedrijf = async () => {
    try {
      await connectToDB();
      const gebruiker = await currentUser();
      
      // Check if user is authenticated
      if (!gebruiker || !gebruiker.id) {
        console.log('No authenticated user found');
        return false;
      }
      
      const bedrijf = await Employer.findOne({ clerkId: gebruiker.id }).exec();
      if (bedrijf) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching bedrijf details:', error);
      return false;
    }
  };

  export const fetchBedrijfClerkId = async (bedrijfId: string): Promise<string> => {
    try {
      await connectToDB();
      
      // Find the company by its ObjectId
      const bedrijf = await Employer.findById(bedrijfId).exec();
      
      if (bedrijf) {
        return bedrijf.clerkId; // Return the clerkId of the found company
      }
      
      throw new Error('Bedrijf not found');
    } catch (error) {
      console.error('Error fetching bedrijf details:', error);
      redirect('/[lang]/onboarding');
    }
  };


  export const haalAlleBedrijven = async (): Promise<company[]> => {
    try {
        await connectToDB();
        const opdrachtgevers = await Employer.find().lean<company[]>(); // Use lean() to return plain objects

        console.log(opdrachtgevers);
        return opdrachtgevers || []; // Return an array with 'naam' property
    } catch (error) {
        console.error('Error fetching bedrijven:', error);
        throw new Error('Failed to fetch bedrijven');
    }
};


interface idProps {
  freelancerId: string;
  bedrijfId: string;
}

function generateEmailBlokkadeContent(freelancerDetails: any, bedrijfDetails: any): EmailContent {
  
          return {
              subject: `Verzoek van ${bedrijfDetails.naam}, ${bedrijfDetails.displaynaam} om freelancer ${freelancerDetails.voornaam} ${freelancerDetails.tussenvoegsel} ${freelancerDetails.achternaam} te blokkeren`,
              text: `
              bedrijf: ${bedrijfDetails.displaynaam} heeft een verzoek ingediend om freelancer ${freelancerDetails.emailadres}
              ${freelancerDetails.profielfoto} ${freelancerDetails.voornaam} ${freelancerDetails.achternaam} ${freelancerDetails.straat} ${freelancerDetails.huisnummer}
              ${freelancerDetails.geboortedatum} 
              `,
  }
}

export const blokkeerFreelancer = async ({freelancerId, bedrijfId}: idProps) => {
  try {
    await connectToDB();
    const freelancer = await Employee.findById(freelancerId)
    const bedrijf = await Employer.findOne({clerkId: bedrijfId})
     await sendEmailBlokkade(freelancer, bedrijf);
     return { success: true, message: "Verzoek blokkade ingediend!" };
  } catch (error) {
    console.error('Error verzoek blokkade:', error);
    throw new Error('Failed to block freelancer');
  }
}
export const checkOnboardingStatusBedrijf = async (clerkId:string) => {
  try {
    await connectToDB();
   
    const bedrijf = await Employer.findOne({clerkId: clerkId})
    
    return bedrijf?.onboarded ?? null;
  } catch (error) {
    console.error('failed to find stauts:', error);
    throw new Error('Failed to find status');
  }
}

export async function sendEmailBlokkade( freelancerDetails: any, bedrijfsDetails: any,) {
  const emailContent = generateEmailBlokkadeContent(freelancerDetails, bedrijfsDetails);
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'georgeaddai@junter.works',
      subject: emailContent.subject,
      text: emailContent.text,
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent to ' + 'georgeaddai@junter.works');
  } catch (error) {
      console.error('Error sending email:', error);
  }
}

