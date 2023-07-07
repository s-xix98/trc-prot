import { FormControlLabel, FormGroup } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Controller, useFormContext } from 'react-hook-form';

export const FormCheckbox = ({
  name,
  label,
}: {
  name: string;
  label: string;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <FormGroup {...field}>
          <FormControlLabel
            control={<Checkbox />}
            label={label}
            value={field.value}
          />
        </FormGroup>
      )}
    />
  );
};
