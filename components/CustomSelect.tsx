import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormField, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { authFormSchema } from "@/lib/utils";

const formSchema = authFormSchema("sign-up");

interface CustomSelectProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
}

const CustomSelect = ({
  control,
  name,
  label,
  placeholder,
  options,
}: CustomSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item bg-white">
          <FormLabel className="form-label bg-white">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="input-class w-full px-3">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent side="bottom" align="end" position="popper">
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="bg-white cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="form-message mt-2"></FormMessage>
          </div>
        </div>
      )}
    />
  );
};

export default CustomSelect;
