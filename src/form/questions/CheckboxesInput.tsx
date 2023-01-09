import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import React from "react";
import { CheckboxesAnswer } from "../types/Answer";
import { CheckboxesQuestion } from "../types/Question";

type CheckboxesInputProps = CheckboxesQuestion["props"] & {
  name?: string;
  answer?: CheckboxesAnswer;
  onChange?: (newAnswer: CheckboxesAnswer) => void;
};

const CheckboxesInput = ({
  name,
  label,
  checkboxes,
  horizontal,
  answer,
  onChange,
}: CheckboxesInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changed = { [event.target.name]: event.target.checked };
    onChange?.(answer ? { ...answer, ...changed } : changed);
  };

  return (
    <Box my={3}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <FormHelperText>Check all that apply</FormHelperText>
        <FormGroup>
          <Box display="flex" flexDirection={horizontal ? "row" : "column"}>
            {checkboxes.map((checkbox) => {
              const { name, label } = checkbox;
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!answer?.[name]}
                      onChange={handleChange}
                      name={name}
                    />
                  }
                  label={label}
                />
              );
            })}
          </Box>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default CheckboxesInput;
