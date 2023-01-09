import { Box, TextField } from "@mui/material";
import React from "react";
import { TextAnswer } from "../types/Answer";
import { TextQuestion } from "../types/Question";

type TextInputProps = TextQuestion["props"] & {
  name?: string;
  answer?: TextAnswer;
  onChange?: (newAnswer: TextAnswer) => void;
};

const TextInput = ({ name, label, answer, onChange }: TextInputProps) => (
  <Box my={2}>
    <TextField
      type="text"
      autoComplete="off"
      label={label}
      variant="filled"
      fullWidth={true}
      aria-label={label}
      name={name}
      value={answer ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </Box>
);

export default TextInput;
