import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

import { bannerAPIConfig } from 'src/app/main/API/apiConfig';

export const getBannerPlans = createAsyncThunk('app/getBannerPlans', async () => {
  const response = await axios.get(bannerAPIConfig.list, {
    headers: {
      'Content-type': 'multipart/form-data',
      authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
    },
  });
  const data = await response.data.data;
  const bannerList = data.map((item) => {
    return { id: item._id, ...item }
  })
  return bannerList;
});

const bannerAdapter = createEntityAdapter({});

export const { selectAll: selectBanners, selectById: selectBannersById } =
  bannerAdapter.getSelectors((state) => state.banners);

const bannerSlice = createSlice({
  name: '/app/banners/List/data',
  initialState: bannerAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setBannerSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {
    [getBannerPlans.fulfilled]: bannerAdapter.setAll,
  },
});

export const { setBannerSearchText } = bannerSlice.actions;

export const selectBannerSearchText = ({ banners }) => banners.searchText;

export default bannerSlice.reducer;
