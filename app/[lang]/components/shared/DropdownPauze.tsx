import React, { useState } from 'react';
import { Select, SelectContent, 
  SelectItem, SelectTrigger, 
  SelectValue } from "@/app/[lang]/components/ui/select";
import type { IPauze } from '@/app/lib/models/pauze.model';
import { voegAangepast } from '@/app/lib/actions/shift.actions';


type Option = {
  value: string;
  label: string;
};

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  options: Option[];
};


const DropdownPauze = ({ value, onChangeHandler, options }: Props) => {
     const [pauze, setPauze] = useState<IPauze[]>([])
     const [aangepast, setAangepast] = useState('');
     

     const voegPauzeToe = () => {
        voegAangepast({
          Aangepast: aangepast.trim()
        })
          .then((pauze) => {
            setPauze((prevState) => [...prevState, pauze])
          })
      }

      /* const fields = components.shared.DropdownPauze.options */

  return (
    <div>
    <Select onValueChange={onChangeHandler} defaultValue={value}>
    <SelectTrigger className="w-full h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
      <SelectValue placeholder="Break" />
    </SelectTrigger>
    <SelectContent className="bg-gray-50 border border-gray-200">
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value} className="text-gray-800 hover:bg-blue-50 focus:bg-blue-600 focus:text-white">
          {opt.label}
        </SelectItem>
      ))}

      {pauze.map((p) => (
        <SelectItem key={p._id} value={p._id} className="text-gray-800 hover:bg-blue-50 focus:bg-blue-600 focus:text-white">
          {p.name}
        </SelectItem>
      ))}


    </SelectContent>
  </Select>
  </div>
  )
};

export default DropdownPauze