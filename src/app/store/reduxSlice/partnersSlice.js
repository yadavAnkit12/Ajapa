import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import store from '../index'
import axios from 'axios';
import { partnerAPIConfig } from 'src/app/main/API/apiConfig';

export const getPartners = createAsyncThunk('app/getPartners', async () => {
  const response = await axios.get(partnerAPIConfig.list, {
    headers: {
      'Content-type': 'multipart/form-data',
      authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
    },
  });
  const data = await response.data.data;
  const partnerList = data.map((item) => {
    return { id: item._id, ...item }
  })
  return partnerList;
});

export const removePartner = createAsyncThunk(
  'app/remove/partner',
  async (productIds, { dispatch, getState }) => {
    await axios.delete('/api/ecommerce/products', { data: productIds });

    return productIds;
  }
);

const partnersAdapter = createEntityAdapter({});

export const { selectAll: selectPartners, selectById: selectPartnersById } =
  partnersAdapter.getSelectors((state) => state.partners);

const partnersSlice = createSlice({
  name: 'app/partner/list/data',
  initialState: partnersAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setPartnersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {
    [getPartners.fulfilled]: partnersAdapter.setAll,
    [removePartner.fulfilled]: (state, action) =>
      partnersAdapter.removeMany(state, action.payload),
  },
});

export const { setPartnersSearchText } = partnersSlice.actions;
export const selectPartnersSearchText = ({ partners }) => partners.searchText;
export default partnersSlice.reducer;
