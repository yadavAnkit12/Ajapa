import MemberView from "../ManageFamily/MemberView";
import AddMembersForm from "./AddMembersForm";

const AddMembersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/app/addMembers/:id/*',
      element: <AddMembersForm/>,
      auth: ["Super", "User"]
    },

  ],
};

export default AddMembersConfig;