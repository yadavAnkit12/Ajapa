import AdminProfile from './AdminProfile'

const AdminConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/profile/:userId',
            element: <AdminProfile />,
            auth: ["Super",'User','Member','Admin']

        }
    ],
};

export default AdminConfig;