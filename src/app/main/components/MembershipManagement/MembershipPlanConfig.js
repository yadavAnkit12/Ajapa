import Membership from './MembershipPlan';

const MembershipPlanConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/membership/',
      element: <Membership />,
      auth: ["admin", "employee"]
    }
  ],
};

export default MembershipPlanConfig;