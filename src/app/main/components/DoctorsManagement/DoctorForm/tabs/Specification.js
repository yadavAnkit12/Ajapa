import { Controller, useFormContext } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';
import { doctorAPIConfig, specializationAPIConfig } from '../../../../API/apiConfig';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

import axios from 'axios';
import { _ } from 'core-js';

function Specification(props) {

  const dispatch = useDispatch();
  const methods = useFormContext();
  const { control,formState } = methods;
  const {errors}=formState
  const [specializationList, setSpecializationList] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [symptomList, setSymptomList] = useState([]);
  const [qualificationList, setQualificationList] = useState([]);

  useEffect(() => {
    axios.get(specializationAPIConfig.fetchSpecialization, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        const spedata = (response.data.data).map((data) => data.specialization);
        setSpecializationList(spedata);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }, []);



  useEffect(() => {
    axios.get(doctorAPIConfig.fetchQualification, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 201) {
        const qualificationdata = (response.data.data).map((data) => data.qualification);
        setQualificationList(qualificationdata);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }, [])

  useEffect(() => {

    if (symptomList.length > 0) {
      methods.setValue('subSpecialization', symptomList);
    }
  }, [symptomList]);

  useEffect(() => {
   
      axios.get(`${specializationAPIConfig.fetch}`, {
        headers: {
          'Content-type': 'multipart/form-data',
          authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          const symptomdata = response.data.data.map((data) => data.subSpecialization);
          // if (props.selectedSpecialization === methods.getValues('specialization')) {
          //   setSymptomList(props.symptoms);
          // } else {
          //   setSymptomList(symptomdata);
          // }
          setSymptomList(symptomdata)
        } else {
          dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
        }
      })
  
  }, [specialization]);



  return (
    <div>
      <Controller
        name="qualifications"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            disablePortal
            options={qualificationList}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            id="combo-box-demo"

            renderInput={(field) => (
              <TextField
                {...field}
                label="Qualification"
              />
            )}
          />
        )}
      />

      <Controller
        name="specialization"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            disablePortal
            value={value}
            onChange={(event, newValue) => {
              setSpecialization(newValue);
              onChange(newValue);
            }}
            id="combo-box-demo"
            options={specializationList}
            renderInput={(field) => (
              <TextField
                {...field}
                label="Specialization"
              />
            )}
          />
        )}
      />

      <Controller
        name="subSpecialization"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            id="size-small-outlined-multi"
            size="medium"
            options={symptomList} 
            getOptionLabel={(option) => option}
            value={Array.isArray(value) ? value : []}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            freeSolo
            renderInput={(field) => (
              <TextField
                {...field}
                placeholder="Select multiple SubSpecialization"
                label="Sub Specialization"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      />
      <Controller
        name="experience"
        control={control}
        render={({ field }) => (
          <TextField
            className="mt-8 mb-16"
            {...field}
            label="Total Experience"
            id="experience"
            type="number"
            step="0.0"
            variant="outlined"
            autoFocus
            fullWidth
            value={field.value}
            onChange={(e) => {
              if (e.target.value < 0)
                return;
              field.onChange(e);
            }}
          />
        )}
      />

    </div>
  );
}

export default Specification;