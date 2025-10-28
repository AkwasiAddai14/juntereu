"use server";

import { connectToDB } from "@/app/lib/mongoose";
import { currentUser } from '@clerk/nextjs/server';
import Shift from "@/app/lib/models/shift.model";
import Employee from "@/app/lib/models/employee.model";
import Employer from "@/app/lib/models/employer.model";
import Flexpool from "@/app/lib/models/flexpool.model";
import Invoice from '@/app/lib/models/invoice.model';
import ShiftArray from "@/app/lib/models/shiftArray.model";


export const AuthorisatieCheck = async (id: string, nummer: number) => {/*  */
  try {
    console.log('Starting authorization check for ID:', id, 'Number:', nummer);
    
    // Connect to the database
    await connectToDB();
    console.log('Database connected successfully');
    
    let freelancer;
    let bedrijf;
    
    // Get the current user
    const gebruiker = await currentUser();
    
    // Check if user is authenticated
    if (!gebruiker) {
        console.log('No authenticated user found');
        return false;
    }
    
    console.log('User authenticated:', gebruiker.id);
    
    if (nummer === 1 || nummer === 3 || nummer === 5 || nummer ===7 ){
         freelancer = await Employee.findOne({ clerkId: gebruiker.id }).exec();
         if(!freelancer){
            /* redirect('/NotFound'); */ // Redirect to NotFound if not a freelancer
            return false;
         }
    } else {
         // Fetch the associated entities for the user
     bedrijf = await Employer.findOne({ clerkId: gebruiker.id }).exec();
     console.log('Authorization check - User ID:', gebruiker.id);
     console.log('Authorization check - Bedrijf found:', !!bedrijf);
     console.log('Authorization check - Bedrijf ID:', bedrijf?._id);
     if(!bedrijf){
        console.log('Authorization check - No bedrijf found for user');
        /* redirect('/NotFound'); */ // Redirect to NotFound if not a freelancer
            return false;
     }
    }
   
    

    // Validate based on the input `nummer`
    switch (nummer) {
      case 1: // Freelancer checks
        if (freelancer) {
          return true;
        }
        /* redirect('/NotFound'); */

        case 2: // Bedrijf is opdrachtgever for shift
          if (bedrijf) {
            try {
              const shift = await ShiftArray.findById(id).exec();
              console.log('Authorization check - Shift found:', !!shift);
              console.log('Authorization check - Shift employer:', shift?.employer);
              console.log('Authorization check - Shift employer type:', typeof shift?.employer);
              console.log('Authorization check - Bedrijf ID:', bedrijf._id);
              console.log('Authorization check - Bedrijf ID type:', typeof bedrijf._id);
              console.log('Authorization check - Bedrijf ID toString:', (bedrijf._id as any).toString());
              console.log('Authorization check - Shift employer toString:', shift?.employer?.toString());
              console.log('Authorization check - Match:', shift && shift.employer && shift.employer.toString() === (bedrijf._id as any).toString());
              
              if (shift && shift.employer && shift.employer.toString() === (bedrijf._id as any).toString()) {
                console.log('Authorization check - SUCCESS: User is authorized');
                return true;
              } else {
                console.log('Authorization check - FAILED: IDs do not match');
                console.log('Authorization check - Shift employer string:', shift?.employer?.toString());
                console.log('Authorization check - Bedrijf ID string:', (bedrijf._id as any).toString());
              }
            } catch (error) {
              console.error('Error in authorization check for shift:', error);
            }
          } else {
            console.log('Authorization check failed - no bedrijf found for user');
          }
          console.log('Authorization check failed - returning false');
          return false;

      case 3: // Freelancer is opdrachtnemer for checkout
        if (freelancer) {
          const checkout = await Shift.findById(id).exec();
          if (checkout && checkout.employee === freelancer._id.toString()) {
            return true;
          }
        }
        /* redirect('/NotFound'); */
        return false;

      case 4: // Bedrijf is opdrachtgever for checkout
        if (bedrijf) {
          const checkout = await Shift.findById(id).exec();
          if (checkout && checkout.employer === bedrijf._id) {
            return true;
          }
        }
        /* redirect('/NotFound'); */
        return false;

      case 5: // Freelancer is in flexpool
        if (freelancer) {
          const flexpool = await Flexpool.findById(id).exec();
          if (flexpool && flexpool.employees.includes(freelancer._id.toString())) {
            return true;
          }
        }
        /* redirect('/NotFound'); */
        return false;

      case 6: // Bedrijf is opdrachtgever for flexpool
        if (bedrijf) {
          const flexpool = await Flexpool.findById(id).exec();
          if (flexpool && flexpool.employer === bedrijf._id) {
            return true;
          }
        }
        /* redirect('/NotFound'); */
        return false;

      case 7: // Freelancer is associated with factuur
        if (freelancer) {
          const factuur = await Invoice.findById(id).exec();
          if (factuur && factuur.freelancerId === freelancer._id.toString()) {
            return true;
          }
        }
        /* redirect('/NotFound'); */
        return false;

      case 8: // Bedrijf is opdrachtgever for factuur
        if (bedrijf) {
          const factuur = await Invoice.findById(id).exec();
          if (factuur && factuur.opdrachtgeverId === bedrijf._id) {
            return true;
          }
        }
        /* redirect('/NotFound'); */
        return false;

      default:
        /* redirect('/NotFound'); */ // Invalid `nummer`
        return false;
    }
  } catch (error) {
    console.error('Error during authorisation check:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      id,
      nummer
    });
    return false;
  }
};