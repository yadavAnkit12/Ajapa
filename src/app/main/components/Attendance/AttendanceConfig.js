
import Attendance from "./Attendance";


const AttendanceConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/attendance',
      element: <Attendance/>,
      auth: ["Super","Admin"]
    },


  ],
};

export default AttendanceConfig;