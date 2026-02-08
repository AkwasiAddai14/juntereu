"use server"

import { connectToDB } from "../mongoose";
import { currentUser } from "@clerk/nextjs/server";
import AccountManager, { IAccountManager } from '@/app/lib/models/accountmanger.model';
import { createAccountManagerValidation, CreateAccountManagerInput } from '@/app/lib/validations/accountmanger';
import { createLeadValidation, CreateLeadInput } from '@/app/lib/validations/lead';
import mongoose from "mongoose";
import Lead from '@/app/lib/models/lead.model';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateAffiliateSignupEmailContent(manager: {
  firstname: string;
  infix?: string;
  lastname: string;
  email: string;
  phone?: string;
  street?: string;
  housenumber: string;
  postcode: string;
  city?: string;
  country: string;
  companyName?: string;
  kvkNumber?: string;
  iban: string;
}) {
  const fullName = [manager.firstname, manager.infix, manager.lastname].filter(Boolean).join(' ');
  return {
    subject: `Nieuwe affiliate aangemeld: ${fullName}`,
    text: `
Een nieuwe affiliate (accountmanager) heeft zich aangemeld:

Naam: ${fullName}
E-mail: ${manager.email}
Telefoon: ${manager.phone ?? '–'}
Bedrijf: ${manager.companyName ?? '–'}
KVK: ${manager.kvkNumber ?? '–'}
IBAN: ${manager.iban}

Adres:
Straat: ${manager.street ?? '–'} ${manager.housenumber}
Postcode: ${manager.postcode}
Plaats: ${manager.city ?? '–'}
Land: ${manager.country}

Maak ze wegwijs op het partnerportaal!
    `.trim(),
  };
}

async function sendAffiliateSignupNotification(toEmail: string, manager: Parameters<typeof generateAffiliateSignupEmailContent>[0]) {
  const content = generateAffiliateSignupEmailContent(manager);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: content.subject,
      text: content.text,
    });
    console.log('Affiliate signup notification sent to', toEmail);
  } catch (error) {
    console.error('Error sending affiliate signup email:', error);
  }
}

// Interface voor de data die van het formulier komt
interface CreateAccountManagerParams {
    formData: Omit<CreateAccountManagerInput, 'clerkId'>; // clerkId voegen we server-side toe
}

export async function createAccountManager({ formData }: CreateAccountManagerParams): Promise<void> {
    try {
        await connectToDB();

        // 1. Haal de huidige gebruiker op via Clerk
        const user = await currentUser();
        if (!user) {
            throw new Error("Geen geauthenticeerde gebruiker gevonden.");
        }

        // 2. Combineer formulier data met de Clerk ID
        const inputData: CreateAccountManagerInput = {
            ...formData,
            clerkId: user.id,
        };

        // 3. Valideer de input data met Zod
        const validatedData = createAccountManagerValidation.parse(inputData);

        // 4. Check of de accountmanager al bestaat (op basis van Clerk ID of e-mail)
        const existingManager = await AccountManager.findOne({
            $or: [{ clerkId: validatedData.clerkId }, { email: validatedData.email }]
        });

        if (existingManager) {
            // Optioneel: Update het bestaande profiel in plaats van een fout te geven
            // Voor nu gooien we een fout als ze al bestaan.
            throw new Error("Er bestaat al een accountmanager met dit e-mailadres of Clerk ID.");
        }

        // 5. Maak een nieuw AccountManager document
        const newAccountManager = new AccountManager({
            ...validatedData,
            // Stel standaardwaarden in (hoewel het model dit ook doet)
            onboarded: true, // Aanname: na invullen van dit formulier zijn ze onboarded
            isActive: true,
            leads: [],
            invoices: [],
            commissionTotal: 0,
            commissionPending: 0,
            dealsClosed: 0
        });

        // 6. Sla op in de database
        await newAccountManager.save();
        console.log(`Accountmanager ${validatedData.firstname} succesvol aangemaakt.`);

        // 7. Stuur e-mailnotificatie (nieuwe affiliate aangemeld)
        const notificationEmail = process.env.AFFILIATE_SIGNUP_NOTIFICATION_EMAIL || process.env.EMAIL_USER;
        if (notificationEmail) {
          await sendAffiliateSignupNotification(notificationEmail, newAccountManager.toObject());
        }

    } catch (error: any) {
        // Behandel Zod validatie fouten apart voor betere feedback
        if (error.name === 'ZodError') {
            console.error('Validatiefout:', error.issues);
            // In een echte app zou je deze fouten terug willen sturen naar de client
            throw new Error(`Validatiefout: ${error.issues.map((i: any) => i.message).join(', ')}`);
        }

        console.error('Fout bij aanmaken accountmanager:', error.message);
        throw new Error(error.message || 'Kon accountmanager niet aanmaken.');
    }
}

// Interface voor de data van het Lead formulier
// We gebruiken partial omdat de accountManagerId server-side wordt bepaald
interface CreateLeadParams {
    formData: Omit<CreateLeadInput, 'accountManagerId'>; 
}

export async function createLead({ formData }: CreateLeadParams): Promise<void> {
    try {
        await connectToDB();

        // 1. Haal de huidige gebruiker (de accountmanager) op via Clerk
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("U moet ingelogd zijn om een lead toe te voegen.");
        }

        // 2. Zoek de bijbehorende AccountManager in MongoDB om zijn ObjectId te krijgen
        const accountManager = await AccountManager.findOne({ clerkId: clerkUser.id });
        if (!accountManager) {
            throw new Error("Accountmanager profiel niet gevonden. Voltooi eerst uw onboarding.");
        }
        const manager = accountManager as IAccountManager;

        // 3. Bereid de data voor validatie voor
        const inputData: CreateLeadInput = {
            ...formData,
            accountManagerId: (manager._id as mongoose.Types.ObjectId).toString(), // Zet ObjectId om naar string voor Zod
            status: 'NIEUW' // Standaard status
        };

        // 4. Valideer de input data met Zod
        const validatedData = createLeadValidation.parse(inputData);

        // 5. Maak een nieuw Lead document
        const newLead = new Lead({
            // Spreid de gevalideerde data uit
            companyName: validatedData.companyName,
            kvkNumber: validatedData.kvkNumber,
            contactPersonFirstname: validatedData.contactPersonFirstname,
            contactPersonLastname: validatedData.contactPersonLastname,
            contactEmail: validatedData.contactEmail,
            contactPhone: validatedData.contactPhone,
            notes: validatedData.notes,
            status: validatedData.status,

            // Zet de string ID terug om naar een MongoDB ObjectId
            accountManager: new mongoose.Types.ObjectId(validatedData.accountManagerId),
        });

        // 6. Sla de lead op
        const savedLead = await newLead.save();

        // 7. Voeg de nieuwe lead toe aan de lijst van leads van de AccountManager
        manager.leads.push(savedLead._id as mongoose.Types.ObjectId);
        await manager.save();

        console.log(`Lead ${validatedData.companyName} succesvol aangemaakt voor manager ${manager.firstname}.`);

    } catch (error: any) {
        if (error.name === 'ZodError') {
            console.error('Validatiefout:', error.issues);
            throw new Error(`Validatiefout: ${error.issues.map((i: any) => i.message).join(', ')}`);
        }

        console.error('Fout bij aanmaken lead:', error.message);
        throw new Error(error.message || 'Kon lead niet aanmaken.');
    }
}