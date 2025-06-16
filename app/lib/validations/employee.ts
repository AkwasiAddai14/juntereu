import { z } from 'zod';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Locale } from '@/i18n.config';

export const createEmployeeValidation = async (lang: Locale) => {
  const { Validations } = await getDictionary(lang);

  return z.object({
    employeeId: z.string(),
    country: z.string({ required_error: Validations.EmployeeValidations.Land }),
    firstname: z.string({ required_error: Validations.EmployeeValidations.voornaam }),
    infix: z.string().optional(),
    lastname: z.string({ required_error: Validations.EmployeeValidations.Achternaam }),
    dateOfBirth: z.date({ required_error: Validations.EmployeeValidations.Geboortedatum }),
    phone: z.string({ required_error: Validations.EmployeeValidations.Telefoonnumer }),
    email: z.string({ 
      required_error: Validations.EmployeeValidations.Emailadres 
    }),
    taxBenefit: z.boolean().optional(),
    SalaryTaxDiscount: z.boolean().optional(),
    VATidnr: z.string().optional(),
    SocialSecurity: z.string().optional(),
    iban: z.string({ required_error: Validations.EmployeeValidations.IBAN }),
    postcode: z.string({ required_error: Validations.EmployeeValidations.Postcode }),
    housenumber: z.string({ required_error: Validations.EmployeeValidations.Huisnummer }),
    street: z.string({ required_error: Validations.EmployeeValidations.Straat }),
    city: z.string({ required_error: Validations.EmployeeValidations.Stad }),
    profilephoto: z.string().optional(),
    bio: z.string().optional(),
    companyRegistrationNumber: z.string().optional()
  });
};
