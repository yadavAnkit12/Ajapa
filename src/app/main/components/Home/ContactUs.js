import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { Container } from "@mui/system";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";



export default function ContactUs() {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email("Invalid email address")
      .matches(
        /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z]{2,4})\.\2)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        "Invalid email"
      )
      .required("Please enter your email"),
    mobileNumber: yup
      .string()
      .matches(/^[1-9]\d{9}$/, "Invalid mobile number")
      .required("Please enter your mobile number"),
    message: yup.string().required('Message is required'),

  });


  const handleSubmit = () => {

  }


  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobileNumber: '',
      message: '',

    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      <div className='flex flex-col mb-5 py-4 items-center justify-center  text-white h-128 sm:h-256' style={{ backgroundColor: "#792b00" }}>
        <Typography style={{ fontStyle: 'normal', fontSize: '28px', lineHeight: '28px', letterSpacing: '0px', textAlign: 'center', fontWeight: 'bold' }}>
          Contact Us
        </Typography>
      </div>

      <Container>

        <div className="flex flex-col md:flex-row md:border md:border-grey-600 rounded-lg">
          <div className="flex flex-col items-center justify-center ">
            <form className="p-4" onSubmit={handleSubmit}>

              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                required
                sx={{ mb: 2 }}
                className="max-w-md"
              />
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                required
                sx={{ mb: 2 }}
                className="max-w-md"
              />
              <TextField
                fullWidth
                name="mobileNumber"
                label="Mobile Number"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                required
                sx={{ mb: 2 }}
                className="max-w-md"
              />

              <TextField
                label="Write Your Message Here"
                name="message"
                InputLabelProps={{ shrink: true }}
                placeholder='Max 160 Characters'
                variant="outlined"
                sx={{ mb: 2, mt: 2, width: '100%' }}
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


              <div style={{ display: 'block' }}>
                <Button
                  variant="contained"
                  className="py-3 px-4"
                  color="secondary"
                  aria-label="Register"
                  type="submit"
                  size="large"
                  style={{ backgroundColor: "#792b00" }}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
 

 <div className="flex flex-col justify-center items-center mt-4 sm:mt-0 sm:w-5/6">
          <div className="flex flex-col">
            {/* <div className="flex flex-row my-2">
              <div className="px-2">
              <IoLocationSharp className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                Jamshedpur, India
              </Typography>
            </div> */}

            <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>


            <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>
            

            <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>
            

            <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>
            

            <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>

                        <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>

                        <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>

                        <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>

                        <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>

                        <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>

                        <div className="grid grid-cols-12 gap-4 my-2">
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <MdEmail className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                info@ajapayog.org
              </Typography>
            </div>
            <div className="flex flex-row my-1 col-span-6">
              <div className="px-2">
              <FaPhoneAlt className="text-xl" />
              </div>
              <Typography color="text.primary" variant="body1">
                +91-9625572723
              </Typography>
            </div>
            </div>
            

          
          </div>


<div className="flex flex-col mt-4">

              <Typography color="text.primary" variant="h6" className="text-[#792b00]">
                Follow Us 
              </Typography>

          <div className="flex flex-row">
             
             <a href="https://www.facebook.com/ajapayog/" className="text-3xl p-2 text-black" ><FaFacebookSquare /></a>

             <a href="https://www.instagram.com/ajapayog/" className="text-3xl p-2 text-black"><FaInstagramSquare /></a>

             <a href="https://www.youtube.com/channel/UCmETLc66p6EPeKNRrieJ19A" className="text-3xl p-2 text-black"><FaYoutube /></a>
          </div>
          </div>
          </div>
        </div>
      </Container>

    </div>
  );
}
