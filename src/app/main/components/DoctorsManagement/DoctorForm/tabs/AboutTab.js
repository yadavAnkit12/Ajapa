import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

function AboutTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;

  return (
    <div>
      <Controller
        name="about"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="about"
            label="About the doctor "
            type="text"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            placeholder={'Hi, I am here to solve your desease'}
          />
        )}
      />

    </div >

  );
}

export default AboutTab;