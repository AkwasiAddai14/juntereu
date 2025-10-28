"use server";


import mongoose, { Types } from 'mongoose';
import { connectToDB } from '../mongoose';
import Employee from '@/app/lib/models/employee.model';
import Employer from '@/app/lib/models/employer.model';
import ShiftArray, {IShiftArray} from '../models/shiftArray.model';
import Shift, { ShiftType } from '@/app/lib/models/shift.model';
import { currentUser } from '@clerk/nextjs/server'
import cron from 'node-cron';


export const haalActieveShifts = async ({ employerId }: { employerId: string }) => {
    try {
      await connectToDB();
      console.log("Fetching active shifts for employer:", employerId);
      const employer = await Employer.findById( employerId ).lean();
      console.log("Found employer:", employer ? "Yes" : "No");
  
      if (!employer) {
        throw new Error(`Bedrijf with ID ${employerId} not found`);
      }
  
      console.log("Employer shifts:", employer.shifts);
      // If no shifts array or empty array, return empty array
      if (!employer.shifts || employer.shifts.length === 0) {
        console.log("No shifts found for employer");
        return [];
      }
  
      // Get only active shifts (available: true and status: 'beschikbaar')
      const activeShiftArrays = await ShiftArray.find({ 
        _id: { $in: employer.shifts }, 
        available: true, 
        status: 'beschikbaar' 
      }).lean();
      
      console.log("Active shiftArrays count:", activeShiftArrays.length);
      
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(activeShiftArrays));
    } catch (error) {
      console.error('Error fetching active shifts:', error);
      throw new Error('Failed to fetch active shifts');
    }
  };

export const haalGeplaatsteShifts = async ({ employerId }: { employerId: string }) => {
    try {
      await connectToDB();
      console.log("Fetching shifts for employer:", employerId);
      const employer = await Employer.findById( employerId ).lean();
      console.log("Found employer:", employer ? "Yes" : "No");
  
      if (!employer) {
        throw new Error(`Bedrijf with ID ${employerId} not found`);
      }
  
      console.log("Employer shifts:", employer.shifts);
      // If no shifts array or empty array, return empty array
      if (!employer.shifts || employer.shifts.length === 0) {
        console.log("No shifts found for employer");
        return [];
      }
  
      // Get all shiftArrays for the employer
      const allShiftArrays = await ShiftArray.find({ _id: { $in: employer.shifts } }).lean();
      console.log("All shiftArrays count:", allShiftArrays.length);
      
      // Filter by different statuses for better organization
      const activeShiftArrays = allShiftArrays.filter(shift => shift.available === true && shift.status === 'beschikbaar');
      const expiredShiftArrays = allShiftArrays.filter(shift => shift.status === 'verlopen');
      const draftShiftArrays = allShiftArrays.filter(shift => shift.available === false && shift.status !== 'verlopen');
      
      console.log("Active shifts count:", activeShiftArrays.length);
      console.log("Expired shifts count:", expiredShiftArrays.length);
      console.log("Draft shifts count:", draftShiftArrays.length);
      
      // Return only active shifts (available: true AND status: 'beschikbaar')
      const shiftArrays = activeShiftArrays;
      console.log("Returning active shiftArrays count:", shiftArrays.length);
         
      console.log("ShiftArrays: ", JSON.stringify(shiftArrays, null, 2)); // Pretty print the objects for better readability

      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(shiftArrays));
    } catch (error) {
      console.error('Error fetching geplaatste shifts:', error);
      throw new Error('Failed to fetch geplaatste shifts');
    }
  };

  export const haalShifts = async (clerkId : string) => {
    try {
      // Connect to the database
      await connectToDB();
      const freelancer = await Employee.findOne({clerkId: clerkId}).populate('shifts').exec();;
      if (!freelancer) {
        throw new Error(`Freelancer with ID ${clerkId} not found`);
      }
          // Extract shiftArrayIds from the freelancer's shifts
          const freelancerShiftArrayIds = freelancer.shifts.map((shift: any) => shift.shiftArrayId.toString());
          console.log(freelancerShiftArrayIds)
          // Find all ShiftArray documents
          const allShiftArrays = await ShiftArray.find().lean();
      
          // Filter ShiftArrays that do not match any shiftArrayId in the freelancer's shifts
          const filteredShiftArrays = allShiftArrays.filter((shiftArray: any) => 
            !freelancerShiftArrayIds.includes(shiftArray._id.toString())
          );
          // Ensure proper serialization by converting to JSON and back
          return JSON.parse(JSON.stringify(filteredShiftArrays));
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw new Error('Failed to fetch shifts');
    }
  };
  
  export const haalAlleShifts = async () => {
    try {
      await connectToDB();
  
      const allShiftArrays = await ShiftArray.find().lean();
  
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(allShiftArrays));
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw new Error('Failed to fetch shifts');
    }
  };
  
  
  export const haalShift = async (freelancerId: Types.ObjectId) => {
    try {
      await connectToDB();
      // Find the freelancer by their ObjectId
      let freelancer; 
      let shiftsArrayIds: string | any[];
      if(mongoose.Types.ObjectId.isValid(freelancerId)){
        freelancer = await Employee.findById(freelancerId);
        if (freelancer && freelancer.shifts && freelancer.shifts.length > 0) {
          // Fetch the related Flexpool documents
          const shifts = await Shift.find({ _id: { $in: freelancer.shifts } }).lean() as ShiftType[];
          // Extract shiftArrayIds from each shift
          console.log("alle shifts: ", shifts)
          shiftsArrayIds = shifts.map(shift => shift.shiftArrayId);
      } else {
        const user = await currentUser();
        if (user) {
           freelancer = await Employee.findOne({ clerkId: user.id });
           if (freelancer && freelancer.shifts && freelancer.shifts.length > 0) {
            // Fetch the related shifts documents
            const shifts = await Shift.find({ _id: { $in: freelancer.shifts } }) as ShiftType[];
            // Extract shiftArrayIds from each shift
            shiftsArrayIds = shifts.map(shift => shift.shiftArrayId);
          }
      } else {
        console.log('No shifts found for this freelancer.');
        return [];
      }   
  }
      // Find all ShiftArray documents
      const allShiftArrays = await ShiftArray.find({beschikbaar: true}).lean();
  
      // Filter ShiftArrays that do not match any shiftArrayId in the freelancer's shifts
      const filteredShiftArrays = allShiftArrays.filter((shiftArray: any) => 
        !shiftsArrayIds.includes(shiftArray._id.toString())
      );
      console.log("filtered shifts: ", filteredShiftArrays)
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(filteredShiftArrays));
    } 
  } catch (error) {
    console.error('Error fetching shifts:', error);
    throw new Error('Failed to fetch shifts');
    }
  };

  export const haalOngepubliceerdeShifts = async ({ bedrijfId }: { bedrijfId: string }) => {
    try {
      await connectToDB();
      const bedrijf = await Employer.findById( bedrijfId  ).lean(); //as unknown as Types.ObjectId
  
      if (!bedrijf) {
        throw new Error(`Bedrijf with ID ${bedrijfId} not found`);
      }
  
      // If no shifts array or empty array, return empty array
      if (!bedrijf.shifts || bedrijf.shifts.length === 0) {
        return [];
      }
  
       // Get unpublished shifts (available: false OR status: 'draft' OR status: 'concept')
       const shiftArrays = await ShiftArray.find({ 
         _id: { $in: bedrijf.shifts }, 
         $or: [
           { available: false },
           { status: 'draft' },
           { status: 'concept' }
         ]
       }).lean();
       
       console.log("Unpublished shifts query conditions:", { 
         _id: { $in: bedrijf.shifts }, 
         $or: [
           { available: false },
           { status: 'draft' },
           { status: 'concept' }
         ]
       });
       console.log("Found unpublished shiftArrays count:", shiftArrays.length);
       console.log("Unpublished ShiftArrays: ", JSON.stringify(shiftArrays, null, 2));
      
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(shiftArrays));
    } catch (error) {
      console.error('Error fetching ongepubliceerde shifts:', error);
      throw new Error('Failed to fetch ongepubliceerde shifts');
    }
  };
  
  export const fetchUnpublishedShifts = async (bedrijfId: string) => {
    try {
      const bedrijf = await Employer.findOne({ clerkId: bedrijfId }).lean();
      let shiftArrays: (mongoose.FlattenMaps<IShiftArray> & Required<{ _id: mongoose.FlattenMaps<unknown>; }>)[] = [];
  
      if (bedrijf) {
        const id = bedrijf._id;
        // Query to find only shifts with beschikbaar: false and status: 'container'
        shiftArrays = await ShiftArray.find(
          { opdrachtgever: id, beschikbaar: false, status: 'container' } // All conditions go here
        ).lean();
      }
  
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(shiftArrays));
    } catch (error: any) {
      console.error('Error fetching unpublished shifts:', error);
      throw error;
    }
  }
  
  
  export const fetchBedrijfShiftsByClerkId = async (clerkId: string) => {
    try {
      await connectToDB();
      
      // Find the company by its ObjectId
      const bedrijf = await Employer.findOne({ clerkId }).lean();
      
      if (bedrijf) {
        const shiftArrays = await ShiftArray.find({ _id: { $in: bedrijf.shifts }, status: 'beschikbaar', beschikbaar: true })
        .lean(); // Use lean to return plain JS objects
  
      console.log("ShiftArrays: ", JSON.stringify(shiftArrays, null, 2)); // Pretty print the objects for better readability

      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(shiftArrays));
      }
      
      throw new Error('Bedrijf not found');
    } catch (error) {
      console.error('Error fetching bedrijf details:', error);
      throw error;
    }
  };
  
  
  
  export const haalAanmeldingen = async (shiftId: any) => {
    try {
      await connectToDB()
      const shift = await ShiftArray.findById(shiftId);
      if (!shift) {
        throw new Error(`Shift with ID ${shiftId} not found`);
      }
  
      const freelancers = await Employee.find({
        _id: { $in: shift.applications }
      });
      console.log(freelancers)
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(freelancers));
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to fetch aanmeldingen: ${error.message}`);
    }
  };
  
  export const haalAangenomen = async (shiftId: any) => {
    try {
      await connectToDB()
      const shift = await ShiftArray.findById(shiftId);
      if (!shift) {
        throw new Error(`Shift with ID ${shiftId} not found`);
      }
  
      const freelancers = await Employee.find({
        _id: { $in: shift.accepted }
      });
      console.log(freelancers)
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(freelancers));
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to fetch aangenomen ${error.message}`);
    }
  };
  
  export const haalReserves = async (shiftId: any) => {
    try {
      await connectToDB()
      const shift = await ShiftArray.findById(shiftId);
      if (!shift) {
        throw new Error(`Shift with ID ${shiftId} not found`);
      }
  
      const freelancers = await Employee.find({
        _id: { $in: shift.reserves }
      });
      console.log(freelancers)
      // Ensure proper serialization by converting to JSON and back
      return JSON.parse(JSON.stringify(freelancers));
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to fetch reserves: ${error.message}`);
    }
  };
  
  export const deleteShifts = async (shiftsToDelete: any[]) => {
    try {
      // Extract all the _id values from the shiftsToDelete array
      const shiftIds = shiftsToDelete.map((shift: { _id: any; }) => shift._id);
  
      if (shiftIds.length === 0) {
        console.log('No shifts to delete.');
        return { success: true, message: 'No shifts to delete.' };
      }
  
      // Perform batch deletion
      const result = await Shift.deleteMany({ _id: { $in: shiftIds } });
  
      console.log(`${result.deletedCount} shifts deleted successfully.`);
      return { success: true, message: `${result.deletedCount} shifts deleted.` };
    } catch (error) {
      console.error('Error deleting shifts:', error);
      return { success: false, message: 'Error deleting shifts.', error };
    }
  };
  
  export const cloudShift = async () => {
    try {
      const now = new Date();
      const currentTimeString = now.toTimeString().slice(0, 5); // Get current time in HH:MM format
      
      // Create proper date boundaries without mutating the original date
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
      // Find shifts where the date is today and time has passed
      const shiftsToUpdate = await ShiftArray.find({
        startingDate: {
          $gte: todayStart, // today's date at midnight
          $lte: todayEnd // today's date at 23:59:59
        },
        starting: { $lte: currentTimeString }, // shifts where starting time has passed
        available: true // only update if still available
      });
  
      // Update shifts
      await Promise.all(shiftsToUpdate.map(async (shift) => {
        shift.available = false;
        shift.status = "verlopen"
        await shift.save();
      }));
  
      console.log(`${shiftsToUpdate.length} shifts updated to beschikbaar: false.`);
    } catch (error) {
      console.error('Error updating shifts:', error);
    }
  };

  // Function to fix incorrectly expired future shifts
  export const fixExpiredFutureShifts = async () => {
    try {
      await connectToDB();
      const now = new Date();
      
      // Find shifts that are marked as expired but have future dates
      const futureShifts = await ShiftArray.find({
        startingDate: { $gt: now }, // Future dates
        status: "verlopen", // Currently marked as expired
        available: false // Currently marked as unavailable
      });
      
      console.log(`Found ${futureShifts.length} future shifts incorrectly marked as expired`);
      
      // Reset them to active status
      await Promise.all(futureShifts.map(async (shift) => {
        shift.available = true;
        shift.status = "beschikbaar";
        await shift.save();
      }));
      
      console.log(`Fixed ${futureShifts.length} future shifts - reset to active status`);
      return futureShifts.length;
    } catch (error) {
      console.error('Error fixing expired future shifts:', error);
      throw error;
    }
  };
  
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const currentTimeString = now.toTimeString().slice(0, 5); // Get current time in HH:MM format
      
      // Create proper date boundaries without mutating the original date
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
      // Find shifts where the date is today and time has passed
      const shiftsToUpdate = await ShiftArray.find({
        startingDate: {
          $gte: todayStart, // today's date at midnight
          $lte: todayEnd // today's date at 23:59:59
        },
        starting: { $lte: currentTimeString }, // shifts where starting time has passed
        available: true // only update if still available
      });
  
      // Update shifts
      await Promise.all(shiftsToUpdate.map(async (shift) => {
        shift.available = false;
        shift.status = "verlopen"
        await shift.save();
      }));
  
      console.log(`${shiftsToUpdate.length} shifts updated to beschikbaar: false.`);
    } catch (error) {
      console.error('Error updating shifts:', error);
    }
  });
  
  export const cloudShifts = async () => {
    try {
      const now = new Date();
      const currentTimeString = now.toTimeString().slice(0, 5); // Get current time in HH:MM format
      
      // Create proper date boundaries without mutating the original date
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
      // Find shifts where the date is today and time has passed
      const shiftsToUpdate = await ShiftArray.find({
        startingDate: {
          $gte: todayStart, // today's date at midnight
          $lte: todayEnd // today's date at 23:59:59
        },
        starting: { $lte: currentTimeString }, // shifts where starting time has passed
        available: true // only update if still available
      });
  
      const shiftsToDelete = await Shift.find({
        shiftArrayId: { $in: shiftsToUpdate.map((shift) => shift._id) }, status: "beschikbaar",
      });
  
      await deleteShifts(shiftsToDelete)
      // Update shifts
      await Promise.all(shiftsToUpdate.map(async (shift) => {
        shift.available = false;
        shift.status = "verlopen"
        try {
          await shift.save();
        } catch (error) {
          console.error(`Error updating shift ${shift._id}:`, error);
        }
      }));
  
      console.log(`${shiftsToUpdate.length} shifts updated to beschikbaar: false.`);
    } catch (error) {
      console.error('Error updating shifts:', error);
    }
  };