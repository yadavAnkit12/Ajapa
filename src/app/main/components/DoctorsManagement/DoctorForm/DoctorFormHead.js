import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import _ from '@lodash';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { motion } from 'framer-motion';

import { useFormContext } from 'react-hook-form';

import { useDispatch } from 'react-redux';

import { Link, useParams, useNavigate } from 'react-router-dom';

import axios from "axios";

import { useEffect, useState } from 'react';

import { doctorAPIConfig } from 'src/app/main/API/apiConfig';

import { showMessage } from 'app/store/fuse/messageSlice';

function DoctorFormHead(props) {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useFormContext();
  const [doctorData, setDoctorData] = useState({})
  const { formState, watch, getValues, reset } = methods;
  const { errors, isDirty } = formState;
  const profileImage = watch('profileImage');
  const name = watch('name');
  const theme = useTheme();
  // const mandatoryFieldArray = ['name', 'email', 'dob', 'mobile', 'gender', 'fee', 'licenseNo', 'doctorType', 'category', 'slotTime', 'commission', 'about', 'bankName', 'branch', 'accountNumber', 'IFSC']
  const mandatoryFieldArray = ['name', 'email', 'dob', 'mobile', 'gender', 'licenseNo']

  useEffect(() => {
    let mandateFlag = true;
    mandatoryFieldArray.forEach((item) => {
      if (!doctorData[item]) {
        mandateFlag = false;
      }
    })

    // if (_.size(props.selectedLanguages) === 0) {
    //   mandateFlag = false;
    // }
    if (mandateFlag) {
      const { doctorId } = routeParams;
// console.log(doctorData)
      const formData = new FormData();
      formData.append("name", doctorData.name);
      formData.append("email", doctorData.email);
      formData.append("mobile", doctorData.mobile);
      formData.append("gender", doctorData.gender);
      // formData.append("fee", doctorData.fee);
      // formData.append('publishedFee', generatePublishedFee(doctorData.fee, doctorData.commission, doctorData.commissionType));
      formData.append("dob", doctorData.dob);
      formData.append("licenseNo", doctorData.licenseNo);
      formData.append("qualifications", doctorData.qualifications);
      formData.append("specialization", doctorData.specialization);
      formData.append("subSpecialization", doctorData.subSpecialization);
      // formData.append("experience", doctorData.experience);
      // formData.append("doctorType", doctorData.doctorType);
      // formData.append("category", doctorData.category);
      // formData.append("slotTime", doctorData.slotTime);
      // formData.append("scheduler", JSON.stringify(props.schedular));
      formData.append("profileImage", doctorData.profileImage);
      // formData.append("commissionType", doctorData.commissionType);
      // formData.append("commission", doctorData.commission);
      formData.append("licenseDocument", doctorData.licenseDocument);
      formData.append("certificateDocument", doctorData.certificateDocument);
      // formData.append("language", props.selectedLanguages)
      // formData.append("about", doctorData.about);
      // const bankDetails = {
      //   accountNumber: doctorData.accountNumber,
      //   bankName: doctorData.bankName,
      //   IFSC: doctorData.IFSC,
      //   branch: doctorData.branch
      // }
      // formData.append('bankDetails', JSON.stringify(bankDetails));

      if (doctorData.name) {
        if (doctorId == "new") {
          axios.post(doctorAPIConfig.register, formData, {
            headers: {
              'Content-type': 'multipart/form-data',
              authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
          }).then((response) => {
            if (response.status === 201) {
              reset({
                name: '', email: '', mobile: '', gender: '', dob: '', licenseNo: '',
                qualifications: '', specialization: '', subSpecialization: [], experience: ''
              })
              dispatch(showMessage({ message: "Doctor Register successfully", variant: 'success' }));
              navigate('/app/doctor');
            } else {
              dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
          })
        }
        else {
          axios.put(`${doctorAPIConfig.updateDoctorbyId}/${doctorId}`, formData, {
            headers: {
              'Content-type': 'multipart/form-data',
              authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
          }).then((response) => {
            if (response.status === 200) {
              dispatch(showMessage({ message: "Doctor Update successfully", variant: 'success' }));
              navigate('/app/doctor');
            } else {
              dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
          })
        }

      }
    } else {
      dispatch(showMessage({ message: "Please fill all mandatory fields" }));
    }
  }, [doctorData])

  function handleSaveProduct() {
    setDoctorData(getValues());
  }


  // function generatePublishedFee(fee, commission, commissionType) {
  //   let publishedFee = 0;
  //   let p = Number(commission);
  //   let f = Number(fee);
  //   if (commissionType == 'Percentage') {
  //     let calculateFee = (p * f) / 100;

  //     publishedFee = calculateFee + f;
  //   } else if (commissionType == 'FlatRate') {
  //     publishedFee = f + p;
  //   }
  //   else {
  //     publishedFee = 0;
  //   }
  //   return publishedFee;
  // }

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
      <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/app/doctor/"
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === 'ltr'
                ? 'heroicons-outline:arrow-sm-left'
                : 'heroicons-outline:arrow-sm-right'}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">Doctors</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            {profileImage ? (
              <img
                className="w-32 sm:w-48 rounded"
                src={typeof (profileImage) === 'string' ? profileImage : URL.createObjectURL(profileImage)}
                alt={name}
              />
            ) : (
              <img
                className="w-32 sm:w-48 rounded"
                src="assets/images/apps/ecommerce/product-image-placeholder.png"
                alt={name}
              />
            )}

          </motion.div>
          <motion.div
            className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {name || 'New Doctor'}
            </Typography>
            <Typography variant="caption" className="font-medium">
              Doctor Detail
            </Typography>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >

        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={!isDirty || _.size(Object.keys(errors)) > 0}
          onClick={handleSaveProduct}
        >
          Save
        </Button>
      </motion.div>
    </div>
  );
}

export default DoctorFormHead;