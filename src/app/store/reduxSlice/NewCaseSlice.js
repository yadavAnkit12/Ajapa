import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { labPartnerAPIConfig } from 'src/app/main/API/apiConfig';

export const getLabPartnerPlans = createAsyncThunk('app/getLabPartnerPlans', async () => {
    const response = await axios.get(labPartnerAPIConfig.list, {
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


export const removelabPartnerPlans = createAsyncThunk(
    'app/remove/labPartnerPlans',
    async (productIds, { dispatch, getState }) => {
        await axios.delete('/api/ecommerce/products', { data: productIds });

        return productIds;
    }
);

const labPartnerPlansAdapter = createEntityAdapter({});

export const { selectAll: selectLabPartnerPlans, selectById: selectLabPartnerPlanById } =
    labPartnerPlansAdapter.getSelectors((state) => state.labPartnerPlans);

const labPartnerPlansSlice = createSlice({
    name: 'app/labPartnerPlans/List/data',
    initialState: labPartnerPlansAdapter.getInitialState({
        searchText: '',
    }),
    reducers: {
        setLabPartnerPlanSearchText: {
            reducer: (state, action) => {
                state.searchText = action.payload;
            },
            prepare: (event) => ({ payload: event?.target?.value || '' }),
        },
    },
    extraReducers: {
        [getLabPartnerPlans.fulfilled]: labPartnerPlansAdapter.setAll,
        [removelabPartnerPlans.fulfilled]: (state, action) =>
            labPartnerPlansAdapter.removeMany(state, action.payload),
    },
});

export const { setLabPartnerPlanSearchText } = labPartnerPlansSlice.actions;

export const selectLabPartnerPlanSearchText = ({ labPartnerPlans }) => labPartnerPlans.searchText;

export default labPartnerPlansSlice.reducer;
