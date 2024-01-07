import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { patientAPIConfig } from '../../main/API/apiConfig';

export const getPatient = createAsyncThunk('app/getPatient', async () => {
  const response = await axios.get(patientAPIConfig.getPatientList, {
    headers: {
      'Content-type': 'multipart/form-data',
      authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
    },
  });
  const data = await response.data.data;
  const patientList = data.map((item) => {
    return { id: item._id, ...item }
  })
  return patientList;
});

const patientsAdapter = createEntityAdapter({});

export const { selectAll: selectPatients, selectById: selectPatientsById } =
  patientsAdapter.getSelectors((state) => state.patients);

const patientsSlice = createSlice({
  name: 'app/patient/List/data',
  initialState: patientsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setPatientsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {}
});

export const { setPatientsSearchText } = patientsSlice.actions;

export const selectPatientsSearchText = ({ patients }) => patients.searchText;

export default patientsSlice.reducer;     
