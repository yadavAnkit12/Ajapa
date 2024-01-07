import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';


const appointmentsAdapter = createEntityAdapter({});

export const { selectAll: selectAppointments, selectById: selectAppointmentsById } =
  appointmentsAdapter.getSelectors((state) => state.patients);

const appointmentsSlice = createSlice({
  name: 'app/appointments/List/data',
  initialState: appointmentsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setAppointmentsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event?.target?.value || '' }),
    },
  },
  extraReducers: {}
});

export const { setAppointmentsSearchText } = appointmentsSlice.actions;

export const selectAppointmentsSearchText = ({ appointments }) => appointments.searchText;

export default appointmentsSlice.reducer;  
