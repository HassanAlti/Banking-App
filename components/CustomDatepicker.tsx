import React from "react";
import { Control, Controller, FieldPath } from "react-hook-form";
import DatePicker from "react-datepicker";
import { FormField, FormLabel, FormControl, FormMessage } from "./ui/form";
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { authFormSchema } from "@/lib/utils";

import "@/styles/react-datepicker.css";

const formSchema = authFormSchema("sign-up");

interface CustomDatePickerProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  control,
  name,
  label,
  placeholder,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    onChange={(date: Date | null) => {
                      if (date) {
                        onChange(date.toISOString().split("T")[0]);
                      } else {
                        onChange(null);
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText={placeholder}
                    className="input-class w-full px-3 py-2"
                    wrapperClassName="w-full"
                  />
                )}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomDatePicker;
