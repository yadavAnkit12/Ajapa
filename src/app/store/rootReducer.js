import { combineReducers } from '@reduxjs/toolkit';

import fuse from './fuse';
import i18n from './i18nSlice';
import user from './userSlice';

import employees from './reduxSlice/employeesSlice'
import doctors from './reduxSlice/doctorsSlice'
import patients from './reduxSlice/patientsSlice'
import partners from './reduxSlice/partnersSlice'
import appointments from './reduxSlice/appointmentSlice'
import membershipPlans from './reduxSlice/membershipSlice'
import couponPlan from './reduxSlice/couponSlice'
import symptoms from './reduxSlice/symptomSlice'
import banners from './reduxSlice/bannerSlice'
import subscriptionPlans from './reduxSlice/subscriptionSlice'
import labPartnerPlans from './reduxSlice/labPartnerSlice'
import userPermissions from './reduxSlice/userSlice'

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    employees,
    doctors,
    patients,
    partners,
    appointments,
    membershipPlans,
    couponPlan,
    symptoms,
    subscriptionPlans,
    labPartnerPlans,
    banners,
    userPermissions,
    ...asyncReducers,
  });

  /*
  Reset the redux store when user logged out
   */
  if (action.type === 'user/userLoggedOut') {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;