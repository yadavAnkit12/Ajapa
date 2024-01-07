import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { membershipAPIConfig } from 'src/app/main/API/apiConfig';

export const getMembershipPlans = createAsyncThunk('app/getMembershipPlans', async () => {
  const response = await axios.get(membershipAPIConfig.list, {
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

export const removeMembershipPlans = createAsyncThunk(
  'app/remove/membershipPlan',
  async (productIds, { dispatch, getState }) => {
    await axios.delete('/api/ecommerce/products', { data: productIds });

    return productIds;
  }
);

const membershipPlansAdapter = createEntityAdapter({});

export const { selectAll: selectMembershipPlans, selectById: selectMembershipPlanById } =
  membershipPlansAdapter.getSelectors((state) => state.membershipPlans);

const membershipPlansSlice = createSlice({
  name: 'app/membership/List/data',
  initialState: membershipPlansAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setMembershipPlanSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {
    [getMembershipPlans.fulfilled]: membershipPlansAdapter.setAll,
    [removeMembershipPlans.fulfilled]: (state, action) =>
      membershipPlansAdapter.removeMany(state, action.payload),
  },
});

export const { setMembershipPlanSearchText } = membershipPlansSlice.actions;

export const selectMembershipPlanSearchText = ({ membershipPlans }) => membershipPlans.searchText;

export default membershipPlansSlice.reducer;
