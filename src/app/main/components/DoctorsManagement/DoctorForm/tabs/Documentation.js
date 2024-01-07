import { TextField, Box, CircularProgress } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';

const documentList = [
  {
    type: 'license',
    name: 'licenseDocument',
    label: 'License'
  },
  {
    type: 'certificate',
    name: 'certificateDocument',
    label: 'Certificate'
  }
];
function Documentation(props) {
  const [loading, setLoading] = useState(false);
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  const getDocumentTitle = (file) => {
    if (typeof (file) === "object") {
      return file.name;
    } else if (typeof (file) === "string") {
      const documentArray = file.split('/');
      return documentArray[documentArray.length - 1];
    }
    return '';
  }

  return (
    <div>
      <Controller
        name="licenseNo"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.licenseNo}
            required
            helperText={errors?.licenseNo?.message}
            label="License No."
            autoFocus
            id="licenseNo"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <div className="flex flex-col mb-20">
        {documentList.map((document, idx) => (
          <div className="flex flex-row justify-start items-center mb-24" key={idx}>
            <Controller
              name={document.name}
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
                  htmlFor={document.type + "-file"}
                  className="productImageUpload flex items-center justify-center relative w-140 h-40 rounded-16 md:w-1/4 sm:w-full lg:w-1/4 p-10 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                > {loading == true ?
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'green[500]',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  /> :
                  <div className="flex flex-col justify-between text-center m-8">
                    <h4>{document.label}</h4>
                    <span style={{ fontSize: '1rem' }}>(.pdf)</span>
                  </div>
                  }
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id={document.type + "-file"}
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
            <div className="mx-20" style={{ color: "Blue" }}>
              {getDocumentTitle(methods.getValues(document.name))}
            </div>
          </div>
        )
        )}
      </div>
    </div >

  );
}

export default Documentation;