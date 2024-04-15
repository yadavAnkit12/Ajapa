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
    auth: ["Super", "User", "Member"]
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
    url: 'app/users/Approved/All/All',
    auth: ["Super"]
  },
  {
    id: 'app-userevent',
    title: "Events",
    translate: "Events",
    type: 'item',
    icon: 'heroicons-outline:calendar',
    url: 'app/UserEvents/',
    auth: ["User", "Member"]
  },
  {
    id: 'app-event',
    title: "Events",
    translate: "Events",
    type: 'item',
    icon: 'heroicons-outline:calendar',
    url: 'app/event/On/On',
    auth: ["Super"]
  },
  {
    id: 'app-addMember',
    title: "Add Members",
    translate: "Add Members",
    type: 'item',
    icon: 'heroicons-outline:plus',
    url: 'app/addMembers/new',
    auth: ["User"]
  },
  {
    id: 'app-allEventRegistraion',
    title: "Event Registrations",
    translate: "Event Registrations",
    type: 'item',
    icon: 'heroicons-outline:calendar',
    url: 'app/allRegistrationDetails',
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
    url: 'app/manageFamily',
    auth: ["User", "Member"]
  },

  {
    id: 'myRegisteration-component',
    title: "My Registrations",
    translate: "My Registrations",
    type: 'item',
    icon: 'heroicons-outline:clipboard-check',
    url: 'app/myregistration',
    auth: ["User", "Member"]
  },
  {
    id: 'food-component',
    title: "Food",
    translate: "Food",
    type: 'item',
    icon: 'heroicons-outline:clipboard-check',
    url: 'app/food',
    auth: ["Super"]
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
    id: 'app-report',
    title: "Report",
    translate: "Report",
    type: 'collapse',
    icon: 'heroicons-outline:clipboard-check',
    auth: ["Super"],
    children: [

      {
        id: 'app-report1-component',
        title: "Report 1",
        translate: "Report 1",
        type: 'item',
        url: 'app/report1/',
        auth: ["Super"],
      },
      {
        id: 'app-report2-component',
        title: "Report 2",
        translate: "Report 2",
        url: 'app/report2/',
        type: 'item',
        auth: ["Super"],
      },
      {
        id: 'app-report3-component',
        title: "Report 3",
        translate: "Report 3",
        url: 'app/report3/',
        type: 'item',
        auth: ["Super"],
      }

    ],
  },
  {
    id: 'sms-component',
    title: "SMS",
    translate: "SMS",
    type: 'item',
    icon: 'heroicons-outline:clipboard-check',
    url: '/sms',
    auth: ["Super"]
  },
  {
    id: 'admin-component',
    title: "Admin",
    translate: "Admin",
    type: 'item',
    icon: 'heroicons-outline:clipboard-check',
    url: 'app/admin',
    auth: ["Super"]
  },
  {
    id: 'app-permissions',
    title: "Permission",
    translate: "Permission",
    type: 'collapse',
    icon: 'heroicons-outline:clipboard-check',
    auth: ["Super"],
    children: [

      {
        id: 'app-rootLevel-component',
        title: "Root Level",
        translate: "Root Level",
        type: 'item',
        url: 'app/rootLevelPermission/',
        auth: ["Super"],
      },
      {
        id: 'app-eventLevel-component',
        title: "Event Level",
        translate: "Event Level",
        url: 'app/eventLevelPermission/',
        type: 'item',
        auth: ["Super"],
      },

    ],
  },
  {
    id: 'myprofile-component',
    title: "My Profile",
    translate: "My Profile",
    type: 'item',
    icon: 'heroicons-outline:user-circle',
    url: `apps/profile/S9fJd8GcN2rP6vW3xZ5mQ1lO7tA4hE0bXuYiK`,
    auth: ["Super", "User", "Member"]
  },

  {
    id: 'logout-component',
    title: "Logout",
    translate: "Logout",
    type: 'item',
    icon: 'heroicons-outline:logout',
    url: '/sign-out',
    auth: ["Super", "User", "Member"]
  },

];

export default navigationConfig;