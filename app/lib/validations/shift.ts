import * as z from 'zod';

export const ShiftValidation = z.object({
    image: z.string(),
    title: z.string(),
    function: z.string(),
    hourlyRate: z.number().gt(13),
    startingDate: z.date(),
    endingDate: z.date(),
    adres: z.string(),
    starting: z.string(),
    ending: z.string(),
    break: z.string(),
    spots: z.number().gt(0),
    description: z.string(),
    skills: z.union([z.string(), z.array(z.string())]),
    dresscode: z.union([z.string(), z.array(z.string())]),
    inFlexpool: z.boolean(),
    flexpoolId: z.string(),
})