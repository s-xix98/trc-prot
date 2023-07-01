import { InputAdornment, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { sx } from '@/lib/mui';

export const FormInput = ({
  name,
  type,
  start,
  placeholder,
}: {
  name: string;
  type: 'text' | 'password';
  start?: string;
  placeholder?: string;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type={type}
          variant="standard"
          placeholder={placeholder}
          sx={sx}
          InputProps={{
            startAdornment: start ? (
              <InputAdornment position="start">
                <p style={{ color: '#33ff33' }}>{start}</p>
              </InputAdornment>
            ) : undefined,
          }}
          autoComplete="off"
          error={fieldState.error ? true : false}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};
