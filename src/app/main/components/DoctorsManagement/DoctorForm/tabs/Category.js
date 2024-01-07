import { TextField, MenuItem } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

function Category(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  return (
    <div>
      <Controller
        name="doctorType"
        control={control}
        defaultValue=''
        render={({ field }) => (
          <TextField
            {...field}
            select
            className="mt-8 mb-16"
            error={!!errors.doctorType}
            required
            helperText={errors?.doctorType?.message}
            variant="outlined"
            color="secondary"
            fullWidth
            id="doctorType"
            label="Doctor Type"
            autoFocus
            sx={{ mb: 4 }}
          >
            <MenuItem key={100} value="Kapeefit_Doctor_Membership">  Kapeefit Doctor(Membership Only) </MenuItem>
            <MenuItem key={105} value="Kapeefit_Doctor_Paid"> Kapeefit Doctor(Paid Only) </MenuItem>
            <MenuItem key={110} value="Kapeefit_Doctor_And_Membership"> Kapeefit Doctor(Membership and Paid ) </MenuItem>
            <MenuItem key={120} value="Kapeefit_Partner"> Partner Doctors </MenuItem>
          </TextField>
        )
        }
      />
      <Controller
        name="category"
        control={control}
        defaultValue=''
        render={({ field }) => (
          <TextField
            {...field}
            select
            className="mt-8 mb-16"
            error={!!errors.category}
            required
            helperText={errors?.category?.message}
            variant="outlined"
            color="secondary"
            fullWidth
            id="category"
            label="Category"
            autoFocus
            sx={{ mb: 4 }}
          >
            <MenuItem key={1} value="Level1">Level 1</MenuItem>
            <MenuItem key={2} value="Level2">Level 2</MenuItem>
            <MenuItem key={3} value="Level3">Level 3</MenuItem>
          </TextField>
        )
        }
      />
    </div>
  );
}

export default Category;
