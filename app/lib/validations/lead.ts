import { z } from 'zod';

// Enum voor de status van de lead, handig om ook in Zod te definiëren
export const LeadStatusEnum = z.enum(['NIEUW', 'CONTACT_OPGENOMEN', 'OFFERTE', 'GEWONNEN', 'VERLOREN']);

export const createLeadValidation = z.object({
  // Verwijzing naar de manager is cruciaal.
  // In een formulier is dit vaak de ID van de ingelogde gebruiker.
  accountManagerId: z.string().min(1, "Account Manager ID is verplicht"), // ObjectId als string

  // Bedrijfsgegevens Lead
  companyName: z.string().min(2, "Bedrijfsnaam is verplicht"),
  kvkNumber: z.string().length(8, "KVK nummer moet 8 cijfers zijn").optional(),
  
  // Contactpersoon Lead
  contactPersonFirstname: z.string().min(2, "Voornaam contactpersoon is verplicht"),
  contactPersonLastname: z.string().min(2, "Achternaam contactpersoon is verplicht"),
  contactEmail: z.string().email("Ongeldig e-mailadres"),
  contactPhone: z.string().min(10, "Telefoonnummer is te kort"),

  // Extra info
  notes: z.string().optional(), // Notities van de account manager

  // Status (default is vaak 'NIEUW')
  status: LeadStatusEnum.default('NIEUW').optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadValidation>;

// Aparte validatie voor het updaten van de status door een admin
export const updateLeadStatusValidation = z.object({
    leadId: z.string().min(1),
    status: LeadStatusEnum,
    adminNotes: z.string().optional(), // Reden voor update
});