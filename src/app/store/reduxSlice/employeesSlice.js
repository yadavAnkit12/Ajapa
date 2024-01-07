import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { employeeAPIConfig } from 'src/app/main/API/apiConfig';

export const getEmployees = createAsyncThunk('app/getEmployees', async () => {
  const response = await axios.get(employeeAPIConfig.list, {
    headers: {
      'Content-type': 'multipart/form-data',
      authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
    },
  });
  if (_.get(response, 'data.data')) {
    return response.data.data.map((item) => {
      return { id: item._id, ...item }
    })
  }
  return [];
});

export const removeEmployees = createAsyncThunk(
  'app/remove/user',
  async (productIds, { dispatch, getState }) => {
    await axios.delete('/api/ecommerce/products', { data: productIds });

    return productIds;
  }
);

const employeesAdapter = createEntityAdapter({});

export const { selectAll: selectEmployees, selectById: selectEmployeesById } =
  employeesAdapter.getSelectors((state) => state.employees);

const employeesSlice = createSlice({
  name: 'app/user/List/data',
  initialState: employeesAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setEmployeesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {
    [getEmployees.fulfilled]: employeesAdapter.setAll,
    [removeEmployees.fulfilled]: (state, action) =>
      employeesAdapter.removeMany(state, action.payload),
  },
});

export const { setEmployeesSearchText } = employeesSlice.actions;

export const selectEmployeesSearchText = ({ employees }) => employees.searchText;

export default employeesSlice.reducer;
