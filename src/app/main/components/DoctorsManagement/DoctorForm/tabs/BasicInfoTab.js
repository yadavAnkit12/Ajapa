import { Controller, useFormContext } from 'react-hook-form';
import { TextField, Stack, MenuItem, Box } from '@mui/material';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';

const commTypeArray = [
  { _id: 'Percentage', type: 'Percentage' },
  { _id: 'FlatRate', type: 'Flat Rate' },
];

function BasicInfoTab(props) {
  const [loading, setLoading] = useState(false);
  const methods = useFormContext();
  const { control, formState } = methods;

  const { errors } = formState;

  return (
    <div>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={(!!errors.name)}
            required
            helperText={errors?.name?.message}
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.email}
            required
            type="email"
            helperText={errors?.email?.message}
            label="Email"
            id="email"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="mobile"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.mobile}
            required
            type="number"
            helperText={errors?.mobile?.message}
            label="Mobile"
            id="mobile"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="dob"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.dob}
            required
            type="date"
            helperText={errors?.dob?.message}
            label="Date of Birth"
            id="dob"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      />
      <Controller
        name="gender"
        control={control}
        defaultValue={''}
        render={({ field }) => (
          <TextField
            {...field}
            select
            className="mt-8 mb-16"
            error={!!errors.gender}
            required
            helperText={errors?.gender?.message}
            variant="outlined"
            color="secondary"
            fullWidth
            id="gender"
            label="Gender"
            sx={{ mb: 4 }}
          >
            <MenuItem key={1} value="male">Male</MenuItem>
            <MenuItem key={2} value="female">Female</MenuItem>
            <MenuItem key={3} value="other">Other</MenuItem>
          </TextField>
        )
        }
      />
      {/* <Controller
        name="fee"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.fee}
            required
            type="number"
            label="Fees"
            id="fee"
            variant="outlined"
            fullWidth
            value={field.value}
            onChange={(e) => {
              if (e.target.value < 0)
                return;
              field.onChange(e);
            }}
          />
        )}
      /> */}
      {/* <Stack direction="row" spacing={2}>
        <Controller
          name="commissionType"
          control={control}
          render={({ field }) => (
            <TextField
              select
              variant="outlined"
              color="secondary"
              id="commissionType"
              label="Commission Type"
              name="commissionType"
              value={field.value || 'select'}
              onChange={(e) => {
                field.onChange(e);
                methods.setValue('commission', '');
              }}
              onBlur={field.onBlur}
              sx={{ mb: 4, width: '50%', marginRight: '16px' }} // Adjust the width and margin as needed
            >
              <MenuItem value="select">Select Type</MenuItem>
              {commTypeArray.map((name) => (
                <MenuItem key={name._id} value={name._id}>
                  {name.type}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="commission"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16"
              error={!!errors.commission}
              required
              type="number"
              label="Commission"
              id="commission"
              variant="outlined"
              fullWidth
              disabled={!methods.getValues('commissionType')}
              value={field.value}
              onChange={(e) => {
                if (e.target.value < 0)
                  return;
                field.onChange(e);
              }}
            />
          )}
        />
      </Stack> */}

      <Controller
        name="profileImage"

        control={control}
        render={({ field: { onChange, value } }) => (
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? lighten(theme.palette.background.default, 0.4)
                  : lighten(theme.palette.background.default, 0.02),
            }}
            component="label"
            htmlFor="profile-file"
            className="productImageUpload flex items-center justify-center relative w-128 h-40 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
          >

            <div className="flex flex-col justify-between text-center m-8">

              <h4>Upload</h4>
              <span style={{ fontSize: '1rem' }}>(jpg/jpeg/png)</span>
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              id="profile-file"
              onChange={async (e) => {
                function readFileAsync() {
                  return new Promise((resolve, reject) => {
                    const file = e.target.files[0];
                    setLoading(true)
                    if (!file) {
                      return;
                    } else {
                      resolve(file)
                    }
                  });
                }
                const newImage = await readFileAsync();
                if (newImage) (
                  setLoading(false)
                )
                onChange(newImage);
              }}
            />
            <FuseSvgIcon size={32} color="action">
              heroicons-outline:upload
            </FuseSvgIcon>
          </Box>
        )}
      />
    </div >
  );
}

export default BasicInfoTab;  