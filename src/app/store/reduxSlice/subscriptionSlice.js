import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { subscriptionAPIConfig } from 'src/app/main/API/apiConfig';

export const getSubscriptionPlans = createAsyncThunk('app/getSubscriptionPlans', async () => {
    const response = await axios.get(subscriptionAPIConfig.list, {
        headers: {
            'Content-type': 'multipart/form-data',
            authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
    });
    const data = await response.data.data;
    const planList = data.map((item) => {
        return { id: item._id, ...item }
    })
    return planList;
});

export const removeSubscriptionPlans = createAsyncThunk(
    'app/remove/subscriptionPlan',
    async (productIds, { dispatch, getState }) => {
        await axios.delete('/api/ecommerce/products', { data: productIds });

        return productIds;
    }
);

const subscriptionPlansAdapter = createEntityAdapter({});

export const { selectAll: selectSubscriptionPlans, selectById: selectSubscriptionPlanById } =
    subscriptionPlansAdapter.getSelectors((state) => state.subscriptionPlans);

const subscriptionPlansSlice = createSlice({
    name: 'app/subscriptionPlans/List/data',
    initialState: subscriptionPlansAdapter.getInitialState({
        searchText: '',
    }),
    reducers: {
        setSubscriptionPlanSearchText: {
            reducer: (state, action) => {
                state.searchText = action.payload;
            },
            prepare: (event) => ({ payload: event?.target?.value || '' }),
        },
    },
    extraReducers: {
        [getSubscriptionPlans.fulfilled]: subscriptionPlansAdapter.setAll,
        [removeSubscriptionPlans.fulfilled]: (state, action) =>
            subscriptionPlansAdapter.removeMany(state, action.payload),
    },
});

export const { setSubscriptionPlanSearchText } = subscriptionPlansSlice.actions;

export const selectSubscriptionPlanSearchText = ({ subscriptionPlans }) => subscriptionPlans.searchText;

export default subscriptionPlansSlice.reducer;
