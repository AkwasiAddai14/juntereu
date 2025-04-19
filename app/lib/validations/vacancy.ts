import * as z from 'zod';

export const VacancyValidation = z.object({
    image: z.string(),
    title: z.string(),
    function: z.string(),
    hourlyRate: z.number().refine((val) => val >= 12.00, {
        message: 'Het uurtarief moet minimaal €12.00 zijn.',
      }),
    startingDate: z.date(),
    endingDate: z.date(),
    housenumber: z.string(),
    city: z.string(),
    postcode:z.string(),
    street: z.string(),
    starting: z.string(),
    ending: z.string(),
    break: z.string(),
    description: z.string(),
    skills: z.union([z.string(), z.array(z.string())]),
    dresscode: z.union([z.string(), z.array(z.string())]),
    surcharge: z.boolean(),
    surchargetype: z.number(),
    surchargepercentage: z.number(),
    surchargeVan: z.string(),
    surchargeTot: z.string()
})