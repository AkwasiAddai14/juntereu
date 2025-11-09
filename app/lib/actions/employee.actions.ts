"use server"

import { connectToDB } from "../mongoose";
import Employee, { IEmployee } from "../models/employee.model";
import { currentUser } from "@clerk/nextjs/server";
import mongoose, { SortOrder } from "mongoose";
import { createNCEmployee } from "../onboarding";
import navigation from "next/navigation";
import { redirect as nextRedirect } from "next/navigation";
import { serializeData } from '@/app/lib/utils/serialization';
import { getDatabaseConnection, getCountryFunctions } from "../database-connection";



type Experience = {
    bedrijf: string;
    functie: string;
    duur: string;
  };
  
  type Skills = {
    vaardigheid: string;
  };
  
  type Education = {
    naam: string;
    school: string;
    niveau?: string;
  };
  
  type Employee = {
    clerkId: string;
    firstname: string;
    infix?: string;
    lastname: string;
    country: string;
    dateOfBirth: Date;
    email?: string;
    phone?: string;
    postcode: string;
    housenumber: string;
    street: string;
    city: string;
    onboarded: boolean;
    taxBenefit?: boolean;
    SalaryTaxDiscount?: boolean;
    VATidnr?: string;
    iban: string;
    bio?: string;
    companyRegistrationNumber?: string;
    profilephoto?: any;
    experience?: Experience[];
    skills?: Skills[];
    education?: Education[];
    SocialSecurity?: string; // Ensure bsn is included as it is required in the schema
  };


export const createEmployee = async (user:Employee) => {
    try {
      console.log("Starting createEmployee with data:", user);
      
      const userInfo = await currentUser();
      const countryFromMetadata = userInfo?.unsafeMetadata?.country as string;
      
      // Use country from user object first, then metadata, then default
      const targetCountry = (user.country ?? countryFromMetadata ?? 'Nederland');
      console.log(`Target country: ${targetCountry} (from user: ${user.country}, from metadata: ${countryFromMetadata})`);
      
      // Connect to the appropriate database based on country
      const connected = await getDatabaseConnection(targetCountry);
      
      if (!connected) {
        console.error('Failed to connect to database');
        throw new Error('Database connection failed');
      }

      // Get country-specific functions using the resolved country
      const countryFunctions = await getCountryFunctions(targetCountry);
      console.log(`Using functions for ${targetCountry}:`, countryFunctions);

      // Call country-specific function if available
      if (targetCountry && countryFunctions.createEmployee === 'createNCEmployee') {
        console.log(`Calling country-specific function for ${targetCountry}`);
        return await createNCEmployee(user);
      }
      
      if(user.clerkId){
        console.log("clerkId found:", user.clerkId);
      }
      
      console.log("Connected to database");
      
      // Use findOneAndUpdate with upsert to create or update the employee
      const newEmployee = await Employee.findOneAndUpdate(
        { clerkId: user.clerkId }, 
        {
          ...user,
          onboarded: true  // Set onboarded to true when creating/updating
        },
        {
          upsert: true, 
          new: true,
          runValidators: true
        }
      );
      
      console.log("Employee created/updated successfully:", newEmployee);
      return serializeData(newEmployee);
        
    } catch (error: any) {
      console.error("Error in createEmployee:", error);
      throw new Error(`Failed to create or update user: ${error.message}`);
    }
}


export const updateFreelancer = async  (user: Employee ) => {
        const userInfo = await currentUser();
    try {
      if(!userInfo?.unsafeMetadata.country){
        console.log('User country is not set in metadata');
      } else {
        createNCEmployee(user);
      }
      if(user.clerkId){
        console.log("clerkId found:", user.clerkId);
      }
      await connectToDB();
      // Find the freelancer by clerkId and update their details
      // Set onboarded to true during the update
      // Use upsert to create a new document if one doesn't exist
      // Return the updated or newly created document
      // Log the user object to verify its contents
      console.log("Updating freelancer with data:", user);
      
      // Create a new employee document
      //
      const newEmployee = await Employee.create(user);
      await Employee.findOneAndUpdate({clerkId: user.clerkId}, {
        onboarded:false
      },
      {
        upsert:true, new: true 
      });
      
        //return JSON.parse(JSON.stringify(newEmployee))
        
        return { success: true, message: `Freelancer successfully updated. ==> ${newEmployee}` };
    } catch (error) {
        console.error('Error updating freelancer:', error);
        throw new Error('Error updating freelancer');
    }
    
   } 

export const checkOnboardingStatusEmployee = async (clerkId:string) => {
  try {
    await connectToDB();
   
    const employee = await Employee.findOne({clerkId: clerkId})
    
     return employee?.onboarded ?? null;
  } catch (error) {
    console.error('failed to find status:', error);
    //throw new Error('Failed to find status');
    return null;
  }
};

export async function verwijderFreelancer(clerkId: string): Promise<Employee | null> {
  try {
      const deletedFreelancer = await Employee.findOneAndDelete({ clerkId: clerkId });
      if (!deletedFreelancer) {
          throw new Error('Freelancer not found');
      }
      return deletedFreelancer;
  } catch (error) {
      console.error('Error deleting freelancer:', error);
      throw new Error('Error deleting freelancer');
  }
}

export const haalFreelancerVoorCheckout = async (id: string) => {
try {
  await connectToDB();
  const freelancer = await Employee.findById(id).lean();
  return serializeData(freelancer);
} catch (error:any) {
  console.error('Error retrieving freelancers:', error);
  throw new Error('Error retrieving freelancers');
}
}

export const haalFreelancer = async (clerkId: string): Promise<IEmployee | null> => {
  try {
    await connectToDB();

    let freelancer: IEmployee | null = null;

    if (mongoose.Types.ObjectId.isValid(clerkId)) {
      freelancer = await Employee.findById(clerkId).lean() as IEmployee | null;;
    }

    if (!freelancer && clerkId) {
      freelancer = await Employee.findOne({ clerkId }).lean() as IEmployee | null;;
    }

    if (!freelancer) {
      const user = await currentUser();
      if (user) {
        freelancer = await Employee.findOne({ clerkId: user.id }).lean() as IEmployee | null;;
      } else {
        console.log("No user logged in or found!");
      }
    }

    return freelancer ? serializeData(freelancer) : null;
  } catch (error) {
    console.error('Error retrieving freelancer:', error);
    redirect('../onboarding');
    return null;
  }
};


export const haalFreelancerProfielModal = async  (Id: string) => {
try {
  await connectToDB();

  const freelancer = await Employee.findById(Id).lean();

  console.log(freelancer)
    return serializeData(freelancer);
    
} catch (error) {
    console.error('Error retrieving freelancers:', error);
    throw new Error('Error retrieving freelancers');
}
}

export const haalFreelancerVoorAdres = async  (clerkId: string) => {
try {
  const CurrentUser = await currentUser();
  const metadata = CurrentUser?.unsafeMetadata.country
//connectToDB();
  await connectToDB();
  let freelancer;
  if(mongoose.Types.ObjectId.isValid(clerkId)){
    freelancer = await Employee.findById(clerkId);
  }
  if (clerkId.toString() !== ""){
    freelancer = await Employee.findOne({clerkId: clerkId});
  } else {
    const user = await currentUser();
    if (user) {
      freelancer = await Employee.findOne({clerkId: user!.id});
    }
    else {
      console.log("No user logged in or found!")
    }
  }
  console.log(freelancer)
    return serializeData(freelancer);
} catch (error) {
    console.error('Error retrieving freelancers:', error);
    throw new Error('Error retrieving freelancers');
}
}

export const haalFreelancerFlexpool = async  (clerkId: string) => {
  
try {
    const freelancer = await Employee.findById(clerkId);
    return serializeData(freelancer);
} catch (error) {
    console.error('Error retrieving freelancers:', error);
    throw new Error('Error retrieving freelancers');
}
}

export const haalFreelancers = async ({
  clerkId,
  searchString ="",
  pageNumber = 1,
  pageSize = 40,
  sortBy = "desc"
} : {
  clerkId: string,
  searchString?: string,
  pageNumber?: number,
  pageSize?: number,
  sortBy?: SortOrder; 
}) =>{ 
  try {
      // Build the search query
      const query = {
          $and: [
              { clerkId: { $ne: clerkId } }, // Exclude the provided clerkId
              {
                  $or: [
                      { voornaam: new RegExp(searchString, 'i') },
                      { achternaam: new RegExp(searchString, 'i') },
                      { emailadres: new RegExp(searchString, 'i') }
                  ]
              }
          ]
      };

      // Calculate the number of documents to skip for pagination
      const skipDocuments = (pageNumber - 1) * pageSize;

      // Execute the query with pagination and sorting
      const freelancers = await Employee.find(query)
          .sort({ voornaam: sortBy })
          .skip(skipDocuments)
          .limit(pageSize);

      // Get the total number of documents that match the query
      const totalFreelancers = await Employee.countDocuments(query);

      // Return the result with pagination info
      return {
          freelancers: serializeData(freelancers),
          totalFreelancers,
          totalPages: Math.ceil(totalFreelancers / pageSize),
          currentPage: pageNumber
      };
  } catch (error) {
      console.error('Error retrieving freelancers:', error);
      throw new Error('Error retrieving freelancers');
  }
};



export const haalAlleFreelancers = async (): Promise<Employee[]> => {
  try {
      await connectToDB();
      const opdrachtnemers = await Employee.find();
      
      console.log(opdrachtnemers)
      return serializeData(opdrachtnemers) || []; // Return an array with 'naam' property
  } catch (error) {
      console.error('Error fetching freelancers:', error);
      throw new Error('Failed to fetch freelancers');
  }
};

export const updateKorregeling = async (clerkId: string, value: any) => {
  try {
      const freelancer = await Employee.findOneAndUpdate({clerkId : clerkId}
          ,{ korregeling: value, },
{ new: true, runValidators: true });

  if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  return freelancer;  // Return the updated freelancer object
} catch (error) {
  console.error('Error updating freelancer:', error);
  throw new Error('Failed to update freelancer');
}
} 
export const updateBio = async (clerkId: string, value: any) => {
  try {
      const freelancer = await Employee.findOneAndUpdate({clerkId : clerkId}
          ,{ bio: value, },
{ new: true, runValidators: true });

  if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  return freelancer;  // Return the updated freelancer object
} catch (error) {
  console.error('Error updating freelancer:', error);
  throw new Error('Failed to update freelancer');
}
} 
export const updateWerkervaring = async (clerkId: string, value: any) => {
  try {
      const freelancer = await Employee.findOneAndUpdate(
          { clerkId: clerkId },  // Find freelancer by clerkId
          { 
            $addToSet: { werkervaring: value }  // Properly wrap $addToSet inside an object
          },
          { 
            new: true,  // Return the updated document
            runValidators: true  // Ensure schema validation is run
          }
        );

  if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  return freelancer;  // Return the updated freelancer object
} catch (error) {
  console.error('Error updating freelancer:', error);
  throw new Error('Failed to update freelancer');
}
}
export const updateOpleiding = async (clerkId: string, value: any) => {
  try {
      const freelancer = await Employee.findOneAndUpdate(
          { clerkId: clerkId },  // Find freelancer by clerkId
          { 
            $addToSet: { opleidingen: value }  // Properly wrap $addToSet inside an object
          },
          { 
            new: true,  // Return the updated document
            runValidators: true  // Ensure schema validation is run
          }
        );

  if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  return freelancer;  // Return the updated freelancer object
} catch (error) {
  console.error('Error updating freelancer:', error);
  throw new Error('Failed to update freelancer');
}
}

// Enhanced functions for work experience and education management
export const addWorkExperience = async (clerkId: string, workExperience: any) => {
  try {
    await connectToDB();
    
    const freelancer = await Employee.findOneAndUpdate(
      { clerkId: clerkId },
      { 
        $push: { 
          experience: {
            ...workExperience,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    return serializeData(freelancer);
  } catch (error) {
    console.error('Error adding work experience:', error);
    throw new Error('Failed to add work experience');
  }
};

export const updateWorkExperience = async (clerkId: string, experienceId: string, workExperience: any) => {
  try {
    await connectToDB();
    
    const freelancer = await Employee.findOneAndUpdate(
      { 
        clerkId: clerkId,
        'experience._id': experienceId
      },
      { 
        $set: { 
          'experience.$.bedrijf': workExperience.company,
          'experience.$.functie': workExperience.position,
          'experience.$.duur': workExperience.startDate + ' - ' + workExperience.endDate,
          'experience.$.updatedAt': new Date()
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!freelancer) {
      throw new Error('Freelancer or work experience not found');
    }

    return serializeData(freelancer);
  } catch (error) {
    console.error('Error updating work experience:', error);
    throw new Error('Failed to update work experience');
  }
};

export const deleteWorkExperience = async (clerkId: string, experienceId: string) => {
  try {
    await connectToDB();
    
    const freelancer = await Employee.findOneAndUpdate(
      { clerkId: clerkId },
      { 
        $pull: { 
          experience: { _id: experienceId }
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    return serializeData(freelancer);
  } catch (error) {
    console.error('Error deleting work experience:', error);
    throw new Error('Failed to delete work experience');
  }
};

export const addEducation = async (clerkId: string, education: any) => {
  try {
    await connectToDB();
    
    const freelancer = await Employee.findOneAndUpdate(
      { clerkId: clerkId },
      { 
        $push: { 
          education: {
            ...education,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    return serializeData(freelancer);
  } catch (error) {
    console.error('Error adding education:', error);
    throw new Error('Failed to add education');
  }
};

export const updateEducation = async (clerkId: string, educationId: string, education: any) => {
  try {
    await connectToDB();
    
    const freelancer = await Employee.findOneAndUpdate(
      { 
        clerkId: clerkId,
        'education._id': educationId
      },
      { 
        $set: { 
          'education.$.naam': education.institution,
          'education.$.school': education.degree,
          'education.$.niveau': education.field,
          'education.$.updatedAt': new Date()
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!freelancer) {
      throw new Error('Freelancer or education not found');
    }

    return serializeData(freelancer);
  } catch (error) {
    console.error('Error updating education:', error);
    throw new Error('Failed to update education');
  }
};

export const deleteEducation = async (clerkId: string, educationId: string) => {
  try {
    await connectToDB();
    
    const freelancer = await Employee.findOneAndUpdate(
      { clerkId: clerkId },
      { 
        $pull: { 
          education: { _id: educationId }
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    return serializeData(freelancer);
  } catch (error) {
    console.error('Error deleting education:', error);
    throw new Error('Failed to delete education');
  }
}; 
export const updateProfielfoto  = async (clerkId: string, value: any) => {
  try {
      const freelancer = await Employee.findOneAndUpdate({clerkId : clerkId},
          
          { profielfoto: value, },
          { new: true, runValidators: true }
          
          );

  if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  return freelancer;  // Return the updated freelancer object
} catch (error) {
  console.error('Error updating freelancer:', error);
  throw new Error('Failed to update freelancer');
}
}

// Enhanced photo upload function with UploadThing integration
export const updateProfilePhoto = async (clerkId: string, photoUrl: string) => {
  try {
    await connectToDB();
    
    const freelancer = await Employee.findOneAndUpdate(
      { clerkId: clerkId },
      { 
        profilephoto: photoUrl,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    return serializeData(freelancer);
  } catch (error) {
    console.error('Error updating profile photo:', error);
    throw new Error('Failed to update profile photo');
  }
};
export const updateAdres = async (clerkId: string, value: any) => {
  try {
      const freelancer = await Employee.findOneAndUpdate({clerkId : clerkId},
          
          { 
            straatnaam: value[0],
            huisnummer: value[1]
          },
          { new: true, runValidators: true }

);

  if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  return freelancer;  // Return the updated freelancer object
} catch (error) {
  console.error('Error updating freelancer:', error);
  throw new Error('Failed to update freelancer');
}
} 
export const updateTelefoonnummer = async (clerkId: string, value: any) => {
  try {
      const freelancer = await Employee.findOneAndUpdate({clerkId : clerkId},
          { telefoonnummer: value, },
{ new: true, runValidators: true });

  if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  return freelancer;  // Return the updated freelancer object
} catch (error) {
  console.error('Error updating freelancer:', error);
  throw new Error('Failed to update freelancer');
}
} 
function redirect(url: string) {
  nextRedirect(url);
}
