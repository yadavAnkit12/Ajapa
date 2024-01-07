import { Controller, useFormContext } from 'react-hook-form';
import { TextField, Box, CircularProgress, MenuItem } from '@mui/material';
import { lighten, styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import * as React from 'react';
import { green } from '@mui/material/colors';


function BasicInfoTab(props) {
  const [loading, setLoading] = React.useState(false);
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
            error={!!errors.name}
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

      {/* <Controller
        name="organizationName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.organizationName}
            required
            helperText={errors?.organizationName?.message}
            label="Organization Name"
            id="organizationName"
            variant="outlined"
            fullWidth
          />
        )}
      /> */}
{/* 
      <Controller
        name="brandName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.brandName}
            required
            helperText={errors?.brandName?.message}
            label="Brand Name"
            id="brandName"
            variant="outlined"
            fullWidth
          />
        )}
      /> */}

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
          > {loading == true ?
            <CircularProgress
              size={24}
              sx={{
                color: green[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            /> :
            <div className="flex flex-col justify-between text-center m-8">
              <h4>Upload</h4>
              <span style={{ fontSize: '1rem' }}>(jpg/jpeg/png)</span>
            </div>
            }
            <input
              type="file"
              accept=".png, .jpg,.jpeg"
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