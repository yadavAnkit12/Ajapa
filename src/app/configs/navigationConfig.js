import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import { getLoggedInPartnerId } from '../auth/services/utils/common';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);


const profileId = sessionStorage.getItem('id');
const url = profileId ? `apps/profile/${profileId}` : 'apps/profile';


const navigationConfig = [
  {
    id: 'home-component',
    title: "Home",
    translate: "Home",
    type: 'item',
    icon: 'heroicons-outline:home',
    url: '/',
    auth: ["Super", "User","Member"]
  },
  {
    id: 'dashboard-component',
    title: "Dashboard",
    translate: "Dashboard",
    type: 'item',
    icon: 'heroicons-outline:home',
    url: 'app/dashboard/',
    auth: ["Super"]
  },
  {
    id: 'Users-component',
    title: "Users",
    translate: "Users",
    type: 'item',
    icon: 'heroicons-outline:users',
    url: 'app/users/',
    auth: ["Super"]
  },
  {
    id: 'app-userevent',
    title: "User Events",
    translate: "User Events",
    type: 'item',
    icon: 'heroicons-outline:calendar',
    url:'app/UserEvents/',
    auth: ["User","Member"]
  },
  {
    id: 'app-event',
    title: "Events",
    translate: "Events",
    type: 'item',
    icon: 'heroicons-outline:calendar',
    url:'app/event/',
    auth: ["Super"]
  },
  {
    id: 'app-addMember',
    title: "Add Members",
    translate: "Add Members",
    type: 'item',
    icon: 'heroicons-outline:plus',
    url:'app/addMembers/new',
    auth: ["User"]
  },
  {
    id: 'app-allEventRegistraion',
    title: "Event Registrations",
    translate: "Event Registrations",
    type: 'item',
    icon: 'heroicons-outline:calendar',
    url:'app/allRegistrationDetails',
    auth: ["Super"]
  },
  {
    id: 'attendance',
    title: "Attendance",
    translate: "Attendance",
    type: 'item',
    icon: 'heroicons-outline:calendar',
    url:'/attendance',
    auth: ["Super"]
  },
  {
    id: 'app-manageFamily',
    title: "Manage Family",
    translate: "Manage Family",
    type: 'item',
    icon: 'heroicons-outline:user',
    url:'app/manageFamily',
    auth: ["User","Member"]
  },
    // children: [

    //   {
    //     id: 'app-employee-component',
    //     title: "Employee",
    //     type: 'item',
    //     url: 'app/user/',
    //     auth: ["admin", "employee"],
    //     end: true,
    //   },
    //   {
    //     id: 'app-doctor-component',
    //     title: "Doctor",
    //     type: 'item',
    //     url: '/app/doctor/',
    //     auth: ["admin", "employee"]
    //   },
    //   // {
    //   //   id: 'app-patient-component',
    //   //   title: "Patient",
    //   //   type: 'item',
    //   //   url: 'app/patient/',
    //   //   auth: ["admin", "employee","clinic","doctor"]
    //   // },
    // ],

  {
    id: 'myRegisteration-component',
    title: "My Registration",
    translate: "My Registration",
    type: 'item',
    icon: 'heroicons-outline:clipboard-check',
    url: 'app/myregistration',
    auth: ["User","Member"]
  },
  {
    id: 'foodDetails-component',
    title: "Food Details",
    translate: "Food Details",
    type: 'item',
    icon: 'heroicons-outline:clipboard-check',
    url: 'app/foodDetails',
    auth: ["Super"]
  },
  {
    id: 'myprofile-component',
    title: "My Profile",
    translate: "My Profile",
    type: 'item',
    icon: 'heroicons-outline:user-circle',
    url: `apps/profile/${sessionStorage.getItem('id')}`,
    auth: ["Super", "User","Member"]
  },
  {
    id: 'sms-component',
    title: "SMS",
    translate: "SMS",
    type: 'item',
    icon: 'heroicons-outline:logout',
    url: '/sms',
    auth: ["Super"]
  },
  {
    id: 'logout-component',
    title: "Logout",
    translate: "Logout",
    type: 'item',
    icon: 'heroicons-outline:logout',
    url: '/sign-out',
    auth: ["Super", "User","Member"]
  },
  {
    id: 'app-partner-component',
    title: "Clinic",
    translate: "Clinic",
    type: 'collapse',
    icon: 'material-outline:science',
    auth: ["admin", "employee","doctor","clinic"],

    children: [
      {
        id: 'app-patient-component',
        title: "Patient",
        type: 'item',
        url: 'app/patient/',
        auth: ["admin", "employee","clinic","doctor"]
      },
      {
        id: 'app-partner-component',
        title: "Clinic",
        type: 'item',
        url: '/app/clinic/',
        auth: ["admin", "employee"],
        end: true,
      },
      {
        id: 'app-ServicePlan-component',
        title: "Cases",
        type: 'item',
        url: '/app/case/',
        auth: ["admin", "employee","clinic"],
        end: true,
      }

      // {
      //   id: 'app-LabOrderPlan-component',
      //   title: "Lab Order",
      //   type: 'item',
      //   url: '/app/pathologyOrder/',
      //   auth: ["admin", "employee", "partner"],
      //   end: true,
      // },
    ],
  },

  // {
  //   id: 'app-appointment-component',
  //   title: "Appointments",
  //   translate: "Appointments",
  //   type: 'item',
  //   icon: 'heroicons-outline:calendar',
  //   url: 'apps/appointment/',
  //   auth: ["admin", "employee"]
  // },
  {
    id: 'app-caseReport-component',
    title: "Case Report",
    type: 'collapse',
    icon: 'material-outline:card_membership',
    auth: ["admin", "doctor"],
    children: [

      {
        id: 'app-caseReport-component',
        title: "New Request Case List",
        type: 'item',
        url: '/app/newRequestCaseList/',
        auth: ["admin", "doctor"],
        end: true,
      },
      {
        id: 'app-allCase-component',
        title: "All Cases",
        type: 'item',
        url: '/app/allCase/',
        auth: ["admin", "doctor"],
        end: true,
      },
      {
        id: 'app-finalCaseReport-component',
        title: "Final Sent Report",
        type: 'item',
        url: '/app/finalSentReport/',
        auth: ["admin", "doctor"],
        end: true,
      },
    ],

  },
  // {
  //   id: 'app-transactions-component',
  //   title: "Wallet",
  //   translate: "Wallet",
  //   type: 'collapse',
  //   icon: 'material-outline:account_balance_wallet',
  //   auth: ["admin", "employee"],

  //   children: [
  //     {
  //       id: 'app-transactions-component',
  //       title: "Transactions",
  //       type: 'item',
  //       url: '/app/transaction/',
  //       auth: ["admin", "employee"],
  //       end: true,
  //     },
  //     {
  //       id: 'app-Coupon-component',
  //       title: "Coupon",
  //       type: 'item',
  //       url: '/app/coupon/',
  //       auth: ["admin", "employee"],
  //       end: true,
  //     },
  //   ],
  // },
  // {
  //   id: 'app-symptom-component',
  //   title: "Symptom",
  //   translate: "Symptom",
  //   type: 'item',
  //   icon: 'material-outline:coronavirus',
  //   url: '/app/symptom/',
  //   auth: ["admin", "employee"]
  // },
  // {
  //   id: 'app-banner-component',
  //   title: "Banner",
  //   translate: "Banner",
  //   type: 'item',
  //   icon: 'material-outline:web',
  //   url: '/app/banner/',
  //   auth: ["admin", "employee"]
  // },
  // {
  //   id: 'app-ProductPlan-component',
  //   title: "E-Commerce",
  //   translate: "E-Commerce",
  //   type: 'collapse',
  //   icon: 'material-outline:shopping_cart',
  //   auth: ["admin", "employee", "partner"],

  //   children: [
  //     {
  //       id: 'app-ProductPlan-component',
  //       title: "Product",
  //       type: 'item',
  //       url: '/app/product/',
  //       auth: ["admin", "employee", "partner"],
  //       end: true,
  //     },
  //     {
  //       id: 'app-OrderPlan-component',
  //       title: "Order",
  //       type: 'item',
  //       url: '/app/productOrder/',
  //       auth: ["admin", "employee", "partner"],
  //       end: true,
  //     },

  //   ],

  // },
  // {
  //   id: 'Setting-component',
  //   title: "Settings",
  //   translate: "Settings",
  //   type: 'item',
  //   icon: 'heroicons-outline:cog',
  //   url: '/app/setting/Configuration',
  //   auth: ["admin"]
  // }

];

export default navigationConfig;