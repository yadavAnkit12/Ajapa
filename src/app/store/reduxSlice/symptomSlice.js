import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import store from '../index'
import axios from 'axios';
import { symptomAPIConfig } from 'src/app/main/API/apiConfig';

export const getSymptoms = createAsyncThunk('app/getSymptoms', async () => {
  const response = await axios.get(symptomAPIConfig.list, {
    headers: {
      'Content-type': 'multipart/form-data',
      authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
    },
  });
  const data = await response.data.data;
  const symptomList = data.map((item) => {
    return { id: item._id, ...item }
  })
  return symptomList;
});

export const removeSymptom = createAsyncThunk(
  'app/remove/symptom',
  async (productIds, { dispatch, getState }) => {
    await axios.delete('/api/ecommerce/products', { data: productIds });

    return productIds;
  }
);

const symptomsAdapter = createEntityAdapter({});

export const { selectAll: selectSymptoms, selectById: selectSymptomById } =
  symptomsAdapter.getSelectors((state) => state.symptoms);

const symptomsSlice = createSlice({
  name: 'app/symptoms/list/data',
  initialState: symptomsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setSymptomsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {
    [getSymptoms.fulfilled]: symptomsAdapter.setAll,
    [removeSymptom.fulfilled]: (state, action) =>
      symptomsAdapter.removeMany(state, action.payload),
  },
});

export const { setSymptomsSearchText } = symptomsSlice.actions;
export const selectSymptomsSearchText = ({ symptoms }) => symptoms.searchText;
export default symptomsSlice.reducer;
