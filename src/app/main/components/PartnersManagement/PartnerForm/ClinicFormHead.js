import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import axios from "axios";

import { useEffect, useState } from 'react';
import { clinicAPIConfig, partnerAPIConfig } from 'src/app/main/API/apiConfig';
import { showMessage } from 'app/store/fuse/messageSlice';



function ClinicFormHead(props) {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [partnerData, setPartnerData] = useState({})
  const navigate = useNavigate();
  const { formState, watch, getValues, reset } = methods;
  const { isValid, dirtyFields } = formState;
  const profileImage = watch('profileImage');
  const name = watch('name');
  const theme = useTheme();

  function handleSaveProduct() {
    setPartnerData(getValues());
  }

  useEffect(() => {

    const { partnerId } = routeParams;
    const formData = new FormData();
    formData.append("name", partnerData.name);
    formData.append("email", partnerData.email);
    formData.append("mobile", partnerData.mobile);
    // formData.append("organizationName", partnerData.organizationName);
    // formData.append("brandName", partnerData.brandName);
    formData.append("licenseNo", partnerData.licenseNo);

    formData.append("gstNo", partnerData.gstNo);
    formData.append("profileImage", partnerData.profileImage);
    formData.append("licenseDocument", partnerData.licenseDocument);
    formData.append("certificateDocument", partnerData.certificateDocument);
    // const bankDetails = {
    //   accountNumber: partnerData.accountNumber,
    //   bankName: partnerData.bankName,
    //   IFSC: partnerData.IFSC,
    //   branch: partnerData.branch
    // }
    // formData.append('bankDetails', JSON.stringify(bankDetails));


    if (partnerData.name) {
      if (partnerId == "new") {
        axios.post(clinicAPIConfig.register, formData, {
          headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 201) {
            reset({
              name: '', email: '', mobile: '', licenseNo: '', image: ''

            })
            dispatch(showMessage({ message: "Partner Register successfully", variant: 'success' }));
            navigate('/app/clinic');
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        })
      }
      else {
        axios.put(`${clinicAPIConfig.update}/${partnerId}`, formData, {
          headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            dispatch(showMessage({ message: "Partner Update successfully", variant: 'success' }));
            navigate('/app/clinic');
          } else {
            dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
          }
        })
      }

    }
  }, [partnerData])

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
            to="/app/clinic/"
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === 'ltr'
                ? 'heroicons-outline:arrow-sm-left'
                : 'heroicons-outline:arrow-sm-right'}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">Case</span>
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
              {name || 'New Clinic'}
            </Typography>
            <Typography variant="caption" className="font-medium">
              Clinic Detail
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
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSaveProduct}
        >
          Save
        </Button>
      </motion.div>
    </div>
  );
}

export default ClinicFormHead;   