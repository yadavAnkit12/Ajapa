import Admin from "./Admin";
import AdminForm from "./AdminForm";

const AdminConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/admin/',
      element: <Admin />,
      auth: ["Super"]
    },


    {
      path: 'app/addAdmin/',
      element: <AdminForm />,
      auth: ["Super"]
    }
    // {
    //     path: 'app/vehicleView',
    //     element: <VehicleView/>,
    //     auth: ["admin", "employee"]
    //   }

  ],
};

export default AdminConfig;
