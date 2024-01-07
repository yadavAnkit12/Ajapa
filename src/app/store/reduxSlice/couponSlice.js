import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

import { couponAPIConfig } from 'src/app/main/API/apiConfig';

export const getCouponPlans = createAsyncThunk('app/getCouponPlans', async () => {
    const response = await axios.get(couponAPIConfig.list, {
        headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
    });
    const data = await response.data.data;
    const couponList = data.map((item) => {
        return { id: item._id, ...item }
    })
    return couponList;
});

const couponAdapter = createEntityAdapter({});

export const { selectAll: selectCoupons, selectById: selectCouponsById } =
    couponAdapter.getSelectors((state) => state.couponPlan);

const couponSlice = createSlice({
    name: '/api/coupon/list/data',
    initialState: couponAdapter.getInitialState({
        searchText: '',
    }),
    reducers: {
        setCouponSearchText: {
            reducer: (state, action) => {
                state.searchText = action.payload;
            },
            prepare: (event) => ({ payload: event?.target?.value || '' }),
        },
    },
    extraReducers: {
        [getCouponPlans.fulfilled]: couponAdapter.setAll
    }
});

export const { setCouponSearchText } = couponSlice.actions;

export const selectCouponSearchText = ({ couponPlan }) => couponPlan.searchText;

export default couponSlice.reducer;