import { z } from 'zod';

export const EmployeeValidation = z.object({
    employeeId: z.string(),
    country: z.string(),
    firstname: z.string(),
    infix: z.string().optional(),
    lastname: z.string(),
    dateOfBirth: z.date(),
    phone: z.string(),
    email: z.string(),
    taxBenefit: z.boolean().optional(),
    SalaryTaxDiscount: z.boolean().optional(),
    VATidnr: z.string().optional(),
    SocialSecurity: z.string().optional(),
    iban: z.string(),
    postcode: z.string(),
    housenumber: z.string(),
    street: z.string(),
    city: z.string(),
    profilephoto: z.string(),
    bio: z.string(),
    companyRegistrationNumber: z.string().optional()
})