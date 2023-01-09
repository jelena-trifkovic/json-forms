import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { DateAnswer } from "../types/Answer";
import { DateQuestion } from "../types/Question";
import AdapterMoment from "@mui/lab/AdapterMoment";
import moment from "moment";

type DateInputProps = DateQuestion["props"] & {
  answer?: DateAnswer;
  onChange?: (newAnswer: DateAnswer) => void;
};

const DateInput = ({ label, answer, onChange }: DateInputProps) => {
  const [date, setDate] = useState<Date | null>(
    answer ? moment(answer, "YYYY-MM-DD").toDate : null
  );

  useEffect(() => {
    if (date === null && answer) {
      answer && setDate(moment(answer, "YYYY-MM-DD").toDate);
    }
  }, [answer, date]);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setDate(newValue);
      if (newValue && moment(newValue).isValid() && moment.isDate(newValue)) {
        onChange?.(moment(newValue).format("MM/dd/yyyy"));
      }
    },
    [onChange]
  );

  return (
    <Box my={2}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDatePicker
          label={label}
          inputFormat="MM/dd/yyyy"
          value={date}
          onChange={(newValue: Date | null) => handleChange(newValue)}
          renderInput={(params: any) => (
            <TextField variant="filled" fullWidth={true} {...params} />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateInput;
