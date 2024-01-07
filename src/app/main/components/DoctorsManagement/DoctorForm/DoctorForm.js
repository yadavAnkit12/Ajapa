import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import { yupResolver } from '@hookform/resolvers/yup';

import _ from '@lodash';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';

import * as yup from 'yup';

import { doctorAPIConfig } from 'src/app/main/API/apiConfig';

import axios from "axios";
import { showMessage } from "app/store/fuse/messageSlice";


import DoctorFormHead from './DoctorFormHead';

import BasicInfoTab from './tabs/BasicInfoTab';
import Category from './tabs/Category';
import Documentation from './tabs/Documentation';
import Scheduler from './tabs/Scheduler';
import Specification from './tabs/Specification';
import AboutTab from './tabs/AboutTab';
import BankDetails from './tabs/BankDetails';
import Languages from './tabs/Languages';

const schema = yup.object().shape({
  name: yup.string().matches(/^[A-Za-z ]*$/, 'Please enter valid name').min(2).max(40).required(),
  mobile: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
  email: yup
    .string()
    .email('You must enter a valid email'),
  dob: yup.date().max(new Date(), 'Date of Birth cannot be in the future').required('Date of Birth is required'),
  // fee: yup.number().positive("Fees must be more than 0").integer("Fees must be an integer").required("Fees is required"),
  // slotTime: yup.number().typeError('slotTime must be a number').integer('slotTime must be an integer').positive('slotTime must be more than 0').min(1, 'minimum 1').max(59, 'not more than 59').required('slotTime is required'),
  // publishedFee: yup.number().positive("Commission must be an integer").min(0, " Commssion must be  more than zero."),
  // branch: yup.string().required('Branch name is required'),
  // bankName: yup.string().matches(/^[A-Za-z\s]*$/, 'Please enter a valid bank name').min(2, 'Bank name must be at least 2 characters').max(50, 'Bank name cannot exceed 50 characters').required('Bank name is required'),
  // IFSC: yup.string().matches(/^[A-Z]{4}\d{7}$/, 'Please enter a valid IFSC code').required('IFSC code is required'),
  // accountNumber: yup.string().min(9, 'Please enter a valid Account Number').max(18, 'Please enter a valid Account Number').required('Account Number is required')
});

function DoctorForm(props) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
const dispatch=useDispatch()
  const routeParams = useParams();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [doctorID, setDoctorID] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  // const [schedular, setSchedular] = useState({
  //   monday: [{ start: null, end: null }],
  //   tuesday: [{ start: null, end: null }],
  //   wednesday: [{ start: null, end: null }],
  //   thursday: [{ start: null, end: null }],
  //   friday: [{ start: null, end: null }],
  //   saturday: [{ start: null, end: null }],
  //   sunday: [{ start: null, end: null }],
  // });

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, setValue } = methods;

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  useEffect(() => {
    const { doctorId } = routeParams;
    if (doctorId == "new") {
      setIsLoaded(true)
    } else {
      setDoctorID(doctorId);
    }
  }, []);

  useEffect(() => {
    if (doctorID) {
      axios.get(`${doctorAPIConfig.getDoctorbyId}/${doctorID}`, {
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
          // setSchedular(response.data.data.scheduler);
          // setSelectedLanguages(_.size(response.data.data.language) > 0 && response.data.data.language[0].split(','));
          setIsLoaded(true);
          setSelectedSpecialization(response.data.data.specialization);
          setSymptoms(response.data.data.subSpecialization);
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
    }
  }, [doctorID]);

  if (!isLoaded) {
    return <FuseLoading />;
  }


  return (
    <FormProvider {...methods}>
      {isLoaded &&
        <FusePageCarded
          // header={<DoctorFormHead schedular={schedular} selectedLanguages={selectedLanguages} />}
          header={<DoctorFormHead/>}


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
                <Tab className="h-64" label="Specification" />
                <Tab className="h-64" label="Documentation" />
                {/* <Tab className="h-64" label="Category" /> */}
                {/* <Tab className="h-64" label="Scheduler" />
                <Tab className="h-64" label="Bank Details " />
                <Tab className="h-64" label="Languages " />
                <Tab className="h-64" label="About " /> */}

              </Tabs>
              <div className="p-16 sm:p-24 max-w-3xl">
                <div className={tabValue !== 0 ? 'hidden' : ''}>
                  <BasicInfoTab />
                </div>

                <div className={tabValue !== 1 ? 'hidden' : ''}>
                  <Specification selectedSpecialization={selectedSpecialization} symptoms={symptoms} />
                </div>

                <div className={tabValue !== 2 ? 'hidden' : ''}>
                  <Documentation />
                </div>

                {/* <div className={tabValue !== 3 ? 'hidden' : ''}>
                  <Category />
                </div> */}


                {/* <div className={tabValue !== 4 ? 'hidden' : ''}>
                  <Scheduler setSchedular={setSchedular} schedular={schedular} />
                </div>

                <div className={tabValue !== 5 ? 'hidden' : ''}>
                  <BankDetails />
                </div>

                <div className={tabValue !== 6 ? 'hidden' : ''}>
                  <Languages selectedLanguages={selectedLanguages} setSelectedLanguages={setSelectedLanguages} />
                </div>

                <div className={tabValue !== 7 ? 'hidden' : ''}>
                  <AboutTab />
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

export default DoctorForm;
