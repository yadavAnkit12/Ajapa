import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import store from '../index'
import axios from 'axios';
import { doctorAPIConfig } from 'src/app/main/API/apiConfig';

export const getDoctors = createAsyncThunk('app/getDoctors', async () => {
  const response = await axios.get(doctorAPIConfig.getDoctorList, {
    headers: {
      'Content-type': 'multipart/form-data',
      authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
    },
  });
  const data = await response.data.data;
  const doctorList = data.map((item) => {
    return { id: item._id, ...item }
  })
  return doctorList;
});

export const removeDoctor = createAsyncThunk(
  'app/remove/employee',
  async (productIds, { dispatch, getState }) => {
    await axios.delete('/api/ecommerce/products', { data: productIds });

    return productIds;
  }
);

const doctorsAdapter = createEntityAdapter({});

export const { selectAll: selectDoctors, selectById: selectDoctorsById } =
  doctorsAdapter.getSelectors((state) => state.doctors);

const doctorsSlice = createSlice({
  name: 'app/doctor/list/data',
  initialState: doctorsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setDoctorsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {
    [getDoctors.fulfilled]: doctorsAdapter.setAll,
    [removeDoctor.fulfilled]: (state, action) =>
      doctorsAdapter.removeMany(state, action.payload),
  },
});

export const { setDoctorsSearchText } = doctorsSlice.actions;
export const selectDoctorsSearchText = ({ doctors }) => doctors.searchText;
export default doctorsSlice.reducer;
