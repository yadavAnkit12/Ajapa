const key = process.env.REACT_APP_URL;
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material"
import axios from "axios";
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import * as Yup from 'yup';
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";
import { blogAPIConfig, foodAPIConfig } from "../../API/apiConfig";
import FuseLoading from "@fuse/core/FuseLoading";

const validationSchema = Yup.object().shape({
  message: Yup.string(),
  image: Yup
    .mixed()
    .nullable()
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      return allowedTypes.includes(value.type);
    })
    .test("fileSize", "File size is too large (max 10MB)", (value) => {
      if (!value) return true;
      return value.size <= 10 * 1024 * 1024; // 10MB in bytes
    })


});


const BlogForm = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [defaultImage, setDefaultImage] = useState(null)


  const handleSubmit = async (values) => {
    if (formik.isValid) {
      if (values.message === '' && values.image === null) {
        dispatch(showMessage({ message: 'Please add message or image', variant: 'error' }));
        return;
      }
      const currentDate = new Date();
      setLoading(true)
      const formData = new FormData();
      formData.append("message", values.message);
      formData.append("dop", currentDate);
      if (values.image !== null) {
        formData.append("file", values.image);
      }
      else {
        await axios.get(`${key}/posts/default.jpg`, {
          responseType: 'blob' // Set the response type to blob
        }).then((response) => {
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          const file = new File([blob], 'default.jpg', { type: 'image/jpeg' });
          setDefaultImage(file)
          formData.append("file", file);
        }).catch((error) => {
          console.error('Error fetching default image:', error);
        });
      }

      axios.post(blogAPIConfig.savePostWithImage, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          formik.resetForm()
          setLoading(false)
          dispatch(showMessage({ message: response.data.message, variant: 'success' }));

        } else {
          setLoading(false)
          dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
        }
      }).catch((error) => {
        setLoading(false)
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
      })
    }

  }


  const formik = useFormik({
    initialValues: {
      message: '',
      image: null
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit

  })




  if (loading) {
    return (
      <FuseLoading />
    );
  }


  return <>
    <Typography variant="h4" fontWeight="700" fontSize="2.4rem" line-height="1.5" fontFamily="Helvetica" align="center" marginBottom="10px">
      Blog
    </Typography>
    <form onSubmit={formik.handleSubmit}>
      <Stack sx={{ mt: 2, marginBottom: 2 }}>

        <TextField
          label="Write Your Message Here"
          name="message"
          InputLabelProps={{ shrink: true }}
          //   placeholder='Max 160 Characters'
          variant="outlined"
          sx={{ mb: 2, mt: 2, width: '100%', minWidth: '240px' }}
          className="max-w-md"
          type="text"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
          multiline
          rows={3}  // Set the number of rows you want
        />


        <div>
          <div>
            <input
              type="file"
              name="image"
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "image",
                  event.target.files[0]
                );
              }}
              style={{
                fontSize: "1.8rem",
                color: "#1a202c",
                padding: "0.75rem", // Adjust the padding to increase the size
                borderRadius: "0.375rem",
                cursor: "pointer",
                background: "transparent",
                outline: "none",
                border: "none",
              }}
            />
          </div>

          {formik.touched.image &&
            formik.errors.image && (
              <p
                style={{
                  fontSize: "13px",
                  padding: "0.75rem",
                  color: "red",
                }}
              >
                {formik.errors.image}
              </p>
            )}
          <p style={{ fontSize: "15px", padding: "0.75rem" }}>
            PNG, JPG, or JPEG (Must be a clear image).
            {/* <span style={{ color: "red", fontSize: "1.8rem" }}>*</span> */}
          </p>
        </div>


        <Button
          variant="contained"
          color="secondary"
          className="m-10"
          aria-label="Register"
          type="submit"
        >
          Post
        </Button>

      </Stack>
    </form>
  </>
}

export default BlogForm