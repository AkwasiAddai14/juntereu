import { z } from 'zod';

export const CompanyValidation = z.object({
    companyId: z.string(),
    name: z.string(),
    country: z.string(),
    displayname: z.string(),
    profilephoto: z.string(),
    bio: z.string(),
    CompanyRegistrationNumber: z.string().optional(),
    VATidnr: z.string(),
    postcode: z.string(),
    housenumber: z.string(),
    street: z.string(),
    city: z.string(),
    phone: z.string(),
    email: z.string(),
    iban: z.string()
})