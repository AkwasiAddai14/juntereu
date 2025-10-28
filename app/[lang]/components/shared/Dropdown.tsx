"use client"

import mongoose from 'mongoose';
import { Input } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { IFlexpool } from '@/app/lib/models/flexpool.model';
import { haalAlleFlexpools, maakFlexpool } from '@/app/lib/actions/flexpool.actions';
import { Select,SelectContent,  SelectItem,  SelectTrigger,  SelectValue } from "@/app/[lang]/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/app/[lang]/components/ui/alert-dialog";

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  flexpoolsList: string[];
  userId: string;
  components: any;
};

const Dropdown = ({ value, onChangeHandler, flexpoolsList, userId, components }: Props) => {
    const [flexpools, setFlexpools] = useState<IFlexpool[]>([]);
    const [newFlexpoolTitle, setNewFlexpoolTitle] = useState('');

    
    useEffect(() => {
      const fetchFlexpools = async () => {
        try {
          const fetchedFlexpools = await haalAlleFlexpools(flexpoolsList);
          setFlexpools(fetchedFlexpools);
        } catch (error) {
          console.error("Error fetching flexpools:", error);
        }
      };
  
      if (flexpoolsList.length > 0) {
        fetchFlexpools();
      }
    }, [flexpoolsList, userId]); 

  
    const voegFlexpoolToe = async () => {
      try {
        if (!userId) {
          console.error("BedrijfId is not available");
          return;
        }
       const nieuwFlexpool =  await maakFlexpool({
          titel: newFlexpoolTitle.trim(),
          bedrijfId: userId as unknown as mongoose.Types.ObjectId,
        });
        // You should manage the flexpools state in the parent component and update it here
        setNewFlexpoolTitle("");
        setFlexpools((prevFlexpools) => [...prevFlexpools, {
          _id: nieuwFlexpool[0] as unknown as mongoose.Types.ObjectId,
          titel: nieuwFlexpool[1] as string,
          bedrijf: new mongoose.Types.ObjectId(userId as string), // Correct ObjectId
          freelancers: [],
          shifts: [],
        } as unknown as IFlexpool,
      ]);
      } catch (error) {
        console.error("Error creating flexpool:", error);
      }
    };

    return (
        <div>
            <Select onValueChange={onChangeHandler} defaultValue={value}>
                <SelectTrigger className="w-full h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select flexpool" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50 border border-gray-200">
                  
                      {flexpools.length > 0 ? (
                        flexpools.map((flexpool: IFlexpool) => (
                          <SelectItem
                            key={flexpool._id as string}
                            value={flexpool._id as string}
                            className="text-gray-800 hover:bg-blue-50 focus:bg-blue-600 focus:text-white"
                          >
                            {flexpool.titel.toString()}
                          </SelectItem>
                        ))
                      ) : (
                        <div className='ml-8 items-center justify-center text-sm'>{components.shared.Dropdown.labels[0]}</div>
                      )}

                    <AlertDialog>
                        <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
                            {components.shared.Dropdown.labels[1]}
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>{components.shared.Dropdown.labels[2]}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Input type="text" placeholder="flexpool toevoegen" className="input-field mt-3" onChange={(e) => setNewFlexpoolTitle(e.target.value)} />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{components.shared.Dropdown.buttons[0]}</AlertDialogCancel>
                                <AlertDialogAction onClick={voegFlexpoolToe}>{components.shared.Dropdown.buttons[1]}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </SelectContent>
            </Select>
        </div>
    )
}

export default Dropdown;
