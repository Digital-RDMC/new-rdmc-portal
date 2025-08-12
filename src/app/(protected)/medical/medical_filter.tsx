import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { set } from "date-fns";




interface MedicalData {
  provider_type: string;
  
  specialty: string;
  governate: string;
  area: string;
  provider_type_ar: string;

  specialty_ar: string;
  governate_ar: string;
  area_ar: string;
}

export default function MedicalFilter() {
      const {  i18n } = useTranslation();
   const currentLanguage = i18n.language; // This gets the current language
  const isArabic = currentLanguage === 'ar';
    const userContext = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [medicalData, setMedicalData] = useState<MedicalData[]>([]);
    const [filteredMedicalData, setFilteredMedicalData] = useState<MedicalData[]>([]);
    
    const [governate, setGovernate] = useState<string[]>([]);
    const [governateOpen, setGovernateOpen] = useState(false);
    const [governateValue, setGovernateValue] = useState("");

    const [area, setArea] = useState<string[]>([]);
    const [areaOpen, setAreaOpen] = useState(false);
    const [areaValue, setAreaValue] = useState("");

    const [specialty, setSpecialty] = useState<string[]>([]);
    const [specialtyOpen, setSpecialtyOpen] = useState(false);
    const [specialtyValue, setSpecialtyValue] = useState("");



    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await fetch("https://n8n.srv869586.hstgr.cloud/webhook/medical-filter", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userContext.vtoken || ''}`,
              },
            });
            
            if (!response.ok) {
              throw new Error("Failed to fetch medical data");
            }

            const data: MedicalData[] = await response.json();

            
            setMedicalData(data);
            setFilteredMedicalData(data); // Initialize filtered data with all data
            setGovernate(Array.from(new Set(data.map(item => item.governate))));
            setArea(Array.from(new Set(data.map(item => item.area))));
            setSpecialty(Array.from(new Set(data.map(item => item.specialty))));


        }catch (error) {
          setError(error instanceof Error ? error.message : "An error occurred");
          console.error("Failed to fetch medical data:", error);
        } finally {
          setLoading(false);
        }
      };

      if (userContext.userData) {
        fetchData();
      }
    }, [userContext.userData]);

  return (
    <div>
      <h2>Medical Filter</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              value: governateValue,
              setValue: setGovernateValue,
              groupArray: governate,
              open: governateOpen,
              setOpen: setGovernateOpen,
            },{
              value: areaValue,
              setValue: setAreaValue,
              groupArray: area,
              open: areaOpen,
              setOpen: setAreaOpen,
            },{
              value: specialtyValue,
              setValue: setSpecialtyValue,
              groupArray: specialty,
              open: specialtyOpen,
              setOpen: setSpecialtyOpen,
            },
          ].map((item, index) => (
            <Popover key={index} open={item.open} onOpenChange={item.setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={item.open}
                  className="w-[200px] justify-between"
                >
                  {item.value
                    ? item.groupArray.find((gov) => gov === item.value)
                    : "Select governate..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {item.groupArray.map((framework) => (
                        <CommandItem
                          key={framework}
                          value={framework}
                          onSelect={(currentValue) => {
                            item.setValue(
                              currentValue === item.value ? "" : currentValue
                            );
                            item.setOpen(false);
                          }}
                        >
                          {framework}
                          <Check
                            className={cn(
                              "ml-auto",
                              governateValue === framework
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            //   <div key={index} className="border p-4 rounded">
            //     <h3 className="font-bold">{item.value}</h3>
            //     <p>{item.groupArray.join(", ")}</p>
            //   </div>
          ))}

          {medicalData.map((item: MedicalData, key: number) => (
            <div key={key} className="border p-4 rounded">
              <h3 className="font-bold">
                {isArabic ? item.provider_type_ar : item.provider_type}
              </h3>

              <p>{isArabic ? item.specialty_ar : item.specialty}</p>
              <p>{isArabic ? item.governate_ar : item.governate}</p>
              <p>{isArabic ? item.area_ar : item.area}</p>
            </div>
          ))}
        </div>

        // <pre>{JSON.stringify(medicalData, null, 2)}</pre>
      )}
    </div>
  );
}
