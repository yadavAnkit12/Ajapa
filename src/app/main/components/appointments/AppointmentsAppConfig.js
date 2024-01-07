import { lazy } from 'react';

const AppointmentsApp = lazy(() => import('./AppointmentsApp'));
const Appointments = lazy(() => import('./appointmentList/Appointments'));

const AppointmentsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'apps/appointment',
      element: <Appointments />,
      auth: ["admin", "employee"]
    },
    {
      path: 'apps/book/appointment/:appointmentId/:type',
      element: <AppointmentsApp />,
      auth: ["admin", "employee"]
    },

    {
      path: 'apps/book/appointment/:appointmentId/*',
      element: <AppointmentsApp />,
      auth: ["admin", "employee"]
    }
  ],
};

export default AppointmentsAppConfig;
