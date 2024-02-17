
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
      auth: ["Super"]
    },


  ],
};

export default AttendanceConfig;