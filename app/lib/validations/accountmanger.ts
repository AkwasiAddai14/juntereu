import { z } from 'zod';

export const createAccountManagerValidation = z.object({
  // clerkId is vaak vereist, maar wordt soms server-side toegevoegd.
  // Pas aan op basis van je flow.
  clerkId: z.string().min(1, "Clerk ID is verplicht"),
  
  // Persoonsgegevens
  firstname: z.string().min(2, "Voornaam moet minimaal 2 tekens zijn"),
  infix: z.string().optional(),
  lastname: z.string().min(2, "Achternaam moet minimaal 2 tekens zijn"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(10, "Telefoonnummer is te kort").optional(),
  
  // Adresgegevens
  postcode: z.string().min(4, "Ongeldige postcode").max(7),
  housenumber: z.string().min(1),
  street: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  country: z.string().default('NL'),

  // Zakelijke & Financiële gegevens
  companyName: z.string().min(2, "Bedrijfsnaam is te kort").optional(), // Optioneel, als ze als bedrijf handelen
  kvkNumber: z.string().length(8, "KVK nummer moet 8 cijfers zijn").optional(), // Optioneel, voor validatie
  vatId: z.string().regex(/^NL[0-9]{9}B[0-9]{2}$/, "Ongeldig NL BTW-nummer").optional(), // Regex voor NL
  iban: z.string().regex(/^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/, "Ongeldig IBAN nummer"),
  
  // Profiel
  profilePhoto: z.string().url().optional(),
  bio: z.string().max(500, "Bio mag maximaal 500 tekens zijn").optional(),
  
  // Status
  onboarded: z.boolean().default(false).optional(),
});

// Type afgeleid van de validatie (handig voor in je controller)
export type CreateAccountManagerInput = z.infer<typeof createAccountManagerValidation>;