import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function BasicDatePicker({ birthdate, setBirthdate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Birthdate"
        value={birthdate}
        onChange={(newValue) => setBirthdate(newValue)}
      />
    </LocalizationProvider>
  );
}

export default BasicDatePicker;
