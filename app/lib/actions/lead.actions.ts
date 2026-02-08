"use server";

import { connectToDB } from "../mongoose";
import Lead from "@/app/lib/models/lead.model";
import AccountManager from "@/app/lib/models/accountmanger.model";
import {
  createLeadValidation,
  CreateLeadInput,
} from "@/app/lib/validations/lead";
import { z } from "zod";

const partnerLeadSchema = createLeadValidation
  .omit({ accountManagerId: true })
  .extend({
    accountManagerId: z.string().min(1).optional(),
    kvkNumber: z.string().optional(), // partner form may send partial or empty KVK
  });

type PartnerLeadInput = z.infer<typeof partnerLeadSchema>;

interface CreateLeadParams {
  formData: PartnerLeadInput;
}

async function getDefaultAccountManagerId(): Promise<string> {
  const defaultId = process.env.DEFAULT_ACCOUNT_MANAGER_ID;
  if (defaultId) return defaultId;
  const first = await AccountManager.findOne().select("_id").lean();
  if (!first) throw new Error("Geen accountmanager gevonden. Voeg eerst een accountmanager toe.");
  return String(first._id);
}

export async function createLead({ formData }: CreateLeadParams): Promise<void> {
  const validated = partnerLeadSchema.safeParse(formData);
  if (!validated.success) {
    const first = validated.error.flatten().fieldErrors;
    const msg = Object.values(first).flat().join(". ") || "Ongeldige gegevens.";
    throw new Error(msg);
  }

  const accountManagerId =
    validated.data.accountManagerId ?? (await getDefaultAccountManagerId());

  const kvkNumber =
    validated.data.kvkNumber?.length === 8
      ? validated.data.kvkNumber
      : undefined;

  const fullData: CreateLeadInput = {
    ...validated.data,
    accountManagerId,
    kvkNumber,
  };

  createLeadValidation.parse(fullData);

  await connectToDB();

  await Lead.create({
    accountManager: accountManagerId,
    companyName: fullData.companyName,
    kvkNumber: fullData.kvkNumber,
    contactPersonFirstname: fullData.contactPersonFirstname,
    contactPersonLastname: fullData.contactPersonLastname,
    contactEmail: fullData.contactEmail,
    contactPhone: fullData.contactPhone,
    notes: fullData.notes,
    status: fullData.status ?? "NIEUW",
  });
}
