import mongoose, { Document, Schema, Model } from 'mongoose';

// Statussen als hardcoded string literals of een aparte file
export type LeadStatus = 'NIEUW' | 'CONTACT_OPGENOMEN' | 'OFFERTE' | 'GEWONNEN' | 'VERLOREN';

// --- Interface Definition ---
export interface ILead extends Document {
    // Relatie naar de Account Manager (VERPLICHT)
    accountManager: mongoose.Types.ObjectId;
    // Relatie naar de uiteindelijke Klant (als de lead gewonnen is)
    customer?: mongoose.Types.ObjectId; 

    // Bedrijfsgegevens Lead
    companyName: string;
    kvkNumber?: string;
    
    // Contactpersoon Lead
    contactPersonFirstname: string;
    contactPersonLastname: string;
    contactEmail: string;
    contactPhone: string;

    // Status & Info
    status: LeadStatus;
    notes?: string; // Notities van de AM bij aanmaken
    adminNotes?: string; // Notities van sales admin

    // Audit
    createdAt: Date;
    updatedAt: Date;
    wonAt?: Date; // Datum waarop de lead 'GEWONNEN' werd
}

// --- Mongoose Schema Definition ---
const leadSchema = new Schema<ILead>({
    // Verwijzing naar het AccountManager model. Cruciaal voor commissie.
    accountManager: { type: Schema.Types.ObjectId, ref: 'AccountManager', required: true },
    
    // Optioneel: als de lead een klant wordt, verwijs naar het Customer model
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' }, 

    companyName: { type: String, required: true, trim: true },
    kvkNumber: { type: String, trim: true },
    
    contactPersonFirstname: { type: String, required: true, trim: true },
    contactPersonLastname: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },

    // Enum status veld
    status: { 
        type: String, 
        enum: ['NIEUW', 'CONTACT_OPGENOMEN', 'OFFERTE', 'GEWONNEN', 'VERLOREN'],
        default: 'NIEUW',
        required: true
    },
    notes: { type: String },
    adminNotes: { type: String },

    wonAt: { type: Date }, // Wordt gezet als status naar GEWONNEN gaat

}, {
    timestamps: true,
});

// Indexen voor performance in het dashboard
leadSchema.index({ accountManager: 1 }); // Snel alle leads van één manager vinden
leadSchema.index({ status: 1 }); // Filteren op status (bijv. alle 'NIEUW' leads)
leadSchema.index({ createdAt: -1 }); // Sorteren op datum (nieuwste eerst)

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);

export default Lead;