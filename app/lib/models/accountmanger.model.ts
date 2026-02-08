import mongoose, { Document, Schema, Model } from 'mongoose';

// --- Interface Definition (voor TypeScript) ---
export interface IAccountManager extends Document {
    clerkId: string;
    
    // Persoonsgegevens
    firstname: string;
    infix?: string;
    lastname: string;
    email: string;
    phone?: string;

    // Adresgegevens
    postcode: string;
    housenumber: string;
    street?: string;
    city?: string;
    country: string;

    // Zakelijke & Financiële gegevens
    companyName?: string;
    kvkNumber?: string;
    vatId?: string;
    iban: string;

    // Profiel & Status
    profilePhoto?: string;
    bio?: string;
    onboarded: boolean;
    isActive: boolean;

    // --- Relaties ---
    // Leads die door deze manager zijn aangebracht
    leads: mongoose.Types.ObjectId[]; 
    // Facturen voor uitbetaling aan de manager
    invoices: mongoose.Types.ObjectId[];

    // --- Statistieken (Optioneel, voor snelle toegang) ---
    commissionTotal: number; // Totaal verdiende commissie
    commissionPending: number; // Nog uit te betalen
    dealsClosed: number; // Aantal succesvolle leads

    createdAt: Date;
    updatedAt: Date;
}

// --- Mongoose Schema Definition ---
const accountManagerSchema = new Schema<IAccountManager>({
    clerkId: { type: String, required: true, unique: true },
    
    firstname: { type: String, required: true, trim: true },
    infix: { type: String, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },

    postcode: { type: String, required: true, trim: true },
    housenumber: { type: String, required: true, trim: true },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, required: true, default: 'NL', trim: true },

    companyName: { type: String, trim: true },
    kvkNumber: { type: String, trim: true },
    vatId: { type: String, trim: true },
    iban: { type: String, required: true, trim: true },

    profilePhoto: { type: String },
    bio: { type: String, maxlength: 500 },
    onboarded: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Relaties
    leads: [{ type: Schema.Types.ObjectId, ref: 'Lead' }],
    invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }], // Verwijs naar je bestaande Invoice model

    // Statistieken (defaults op 0)
    commissionTotal: { type: Number, default: 0 },
    commissionPending: { type: Number, default: 0 },
    dealsClosed: { type: Number, default: 0 },

}, {
    timestamps: true, // Voegt automatisch createdAt en updatedAt toe
});

// Voeg indexen toe voor veelgezochte velden
// accountManagerSchema.index({ email: 1 }); // Wordt al gedaan door unique: true
// accountManagerSchema.index({ clerkId: 1 }); // Wordt al gedaan door unique: true

// Zorg dat het model niet opnieuw wordt gecompileerd bij hot-reload (Next.js specifiek)
const AccountManager: Model<IAccountManager> = mongoose.models.AccountManager || mongoose.model<IAccountManager>('AccountManager', accountManagerSchema);

export default AccountManager;