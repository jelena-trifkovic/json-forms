import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { ReactNode } from "react";
import { isBoolean } from "lodash";
import { YesNoQuestionChildren } from "../Form";
import { YesNoAnswer } from "../types/Answer";
import { YesNoQuestion } from "../types/Question";

type YesNoInputProps = YesNoQuestion["props"] &
  YesNoQuestionChildren<ReactNode> & {
    name?: string;
    answer?: YesNoAnswer;
    onChange?: (newAnswer: YesNoAnswer) => void;
  };

const YesNoInput = ({
  name,
  label,
  answer,
  onChange,
  child,
}: YesNoInputProps) => {
  const value = isBoolean(answer)
    ? answer
      ? "Yes"
      : "No"
    : isBoolean(answer?.value)
    ? answer?.value
      ? "Yes"
      : "No"
    : "";
  const booleanValue = isBoolean(answer)
    ? answer
    : isBoolean(answer?.value)
    ? answer?.value
    : undefined;

  return (
    <Box my={3}>
      <FormControl fullWidth={true}>
        <FormLabel>{label}</FormLabel>
        <RadioGroup
          row
          aria-label={label}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value === "Yes")}
        >
          <FormControlLabel
            value="Yes"
            control={<Radio color="primary" />}
            label="Yes"
          />
          <FormControlLabel
            value="No"
            control={<Radio color="primary" />}
            label="No"
          />
        </RadioGroup>
      </FormControl>
      {booleanValue === true && child}
      {booleanValue === false && child}
    </Box>
  );
};

export default YesNoInput;
