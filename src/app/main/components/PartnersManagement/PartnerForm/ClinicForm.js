import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import PartnerFormHead from './ClinicFormHead';
import BasicInfoTab from './tabs/BasicInfoTab';
import { useDispatch } from 'react-redux';
import Documentation from './tabs/Documentation';
import { clinicAPIConfig, partnerAPIConfig } from 'src/app/main/API/apiConfig';
import axios from "axios";
import { showMessage } from 'app/store/fuse/messageSlice';
// import BankDetails from './tabs/BankDetails';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').min(2).max(40).required(),
  mobile: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  gstNo:yup.string().matches(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,'Invalid GST No.')
  // .matches(/^[0-9A-Za-z]{15}$/, 'Invalid GST number')  // Example regular expression for a 15-character alphanumeric GST number
  // .required('GST number is required')
  // organizationName: yup.string().required('You must enter a organization name').min(5, 'The organization name must be at least 5 characters'),
  // brandName: yup.string().required('You must enter a brand name'),
  // branch: yup.string().required('Branch name is required'),
  // bankName: yup.string().required('Bank name is required'),
  // IFSC: yup.string().required('IFSC code is required'),
  // accountNumber: yup.string().required('Account Number is required')
});

function ClinicForm(props) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [partner, setPartner] = useState(null);
  const [partnerID, setPartnerID] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);


  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, setValue } = methods;
  const form = watch();

  function handleTabChange(event, value) {

    setTabValue(value);
  }
  useEffect(() => {
    const { partnerId } = routeParams;
    if (partnerId == "new") {
      setIsLoaded(true)
    } else {
      setPartnerID(partnerId);
    }
  }, [])

  useEffect(() => {
    if (partnerID) {
      axios.get(`${clinicAPIConfig.getById}/${partnerID}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          reset(response.data.data);
          // const bankDetails = _.get(response, 'data.data.bankDetails') && response.data.data.bankDetails;
          // setValue("bankName", bankDetails.bankName);
          // setValue("branch", bankDetails.branch);
          // setValue("accountNumber", bankDetails.accountNumber);
          // setValue("IFSC", bankDetails.IFSC);
          setPartner(response.data.data)
          setIsLoaded(true)
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [partnerID]);



  if (!isLoaded) {
    return <FuseLoading />;
  }


  return (
    <FormProvider {...methods}>
      {isLoaded &&
        <FusePageCarded
          header={<PartnerFormHead />}

          content={
            <>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                classes={{ root: 'w-full h-64 border-b-1' }}
              >

                <Tab className="h-64" label="Basic Info" />
                <Tab className="h-64" label="Documentation" />
                {/* <Tab className="h-64" label="BankDetails" /> */}


              </Tabs>
              <div className="p-16 sm:p-24 max-w-3xl">
                <div className={tabValue !== 0 ? 'hidden' : ''}>
                  <BasicInfoTab />
                </div>

                <div className={tabValue !== 1 ? 'hidden' : ''}>
                  <Documentation />
                </div>

                {/* <div className={tabValue !== 2 ? 'hidden' : ''}>
                  <BankDetails />
                </div> */}
              </div>
            </>
          }
          scroll={isMobile ? 'normal' : 'content'}
        />
      }
    </FormProvider>
  );
}

export default ClinicForm;