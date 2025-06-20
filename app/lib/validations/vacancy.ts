import * as z from 'zod';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Locale } from '@/i18n.config';

export const VacancyValidation = async (lang: Locale) => {
  const { Validations } = await getDictionary(lang);


 return z.object({
    image: z.string(),
    title: z.string({ required_error: Validations.VacancyValidations.Titel }),
    function: z.string({ required_error: Validations.VacancyValidations.Functie }),
    hourlyRate: z.number({ required_error: Validations.VacancyValidations.Uurtarief }).refine((val) => val >= 12.00, {
        message: 'Het uurtarief moet minimaal €12.00 zijn.',
      }),
    startingDate: z.date({ required_error: Validations.VacancyValidations.Begindatum }),
    endingDate: z.date({ required_error: Validations.VacancyValidations.Einddatum }),
    housenumber: z.string({ required_error: Validations.VacancyValidations.Huisnummer }),
    city: z.string({ required_error: Validations.VacancyValidations.Stad }),
    postcode:z.string({ required_error: Validations.VacancyValidations.Postcode }),
    street: z.string({ required_error: Validations.VacancyValidations.Straat }),
    starting: z.string({ required_error: Validations.VacancyValidations.begintijd }),
    ending: z.string({ required_error: Validations.VacancyValidations.eindtijd }),
    break: z.string({ required_error: Validations.VacancyValidations.pauze }),
    description: z.string({ required_error: Validations.VacancyValidations.beschrijving }),
    skills: z.union([z.string(), z.array(z.string())]),
    dresscode: z.union([z.string(), z.array(z.string())]),
    surcharge: z.boolean(),
    surchargetype: z.number(),
    surchargepercentage: z.number(),
    surchargeVan: z.string(),
    surchargeTot: z.string()
});
}