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
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Pauze" />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}

      {pauze.map((p) => (
        <SelectItem key={p._id} value={p._id}>
          {p.name}
        </SelectItem>
      ))}

      {/* <SelectItem value="0">Geen pauze</SelectItem>
      <SelectItem value="15">15 minuten pauze</SelectItem>
      <SelectItem value="30">30 minuten pauze</SelectItem>
      <SelectItem value="45">45 minuten pauze</SelectItem>
      <SelectItem value="60">60 minuten pauze</SelectItem>
      <SelectItem value="90">90 minuten pauze</SelectItem>
      <SelectItem value="120">120 minuten pauze</SelectItem> */}

      {/* {pauze.length > 0 && pauze.map((pauze) => (
          <SelectItem key={pauze._id} value={pauze._id} className="select-item p-regular-14">
            {pauze.name}
          </SelectItem>
        ))}


      <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Aangepast</AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Aangepast</AlertDialogTitle>
              <AlertDialogDescription>
                <Input type="text" placeholder="aangepaste pauze" className="input-field mt-3" onChange={(e) => setAangepast(e.target.value)} />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuleer</AlertDialogCancel>
              <AlertDialogAction onClick={() => startTransition(voegPauzeToe)}>Toevoegen</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}

    </SelectContent>
  </Select>
  </div>
  )
};

export default DropdownPauze