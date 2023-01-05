import { Autocomplete, Box, TextField } from '@mui/material';
import React from 'react';
import { SelectAnswer } from '../types/Answer';
import { SelectQuestion } from '../types/Question';

type SelectInputProps = SelectQuestion['props'] & {
  name?: string;
  answer?: SelectAnswer;
  onChange?: (newAnswer: SelectAnswer) => void;
};

const SelectInput = ({ name, label, options, answer, onChange }: SelectInputProps) => {
  console.log('SelectInput', name, label, options, answer);

  return (
    <Box my={3}>
      <Autocomplete
        value={answer || null}
        onChange={(event, newValue) => {
          console.log('SelectInput-newValue', newValue);
          onChange?.(newValue);
        }}
        options={options}
        getOptionLabel={option => option.label}
        renderInput={params => <TextField {...params} label={label} variant="filled" />}
      />
    </Box>
  );
};

export default SelectInput;
