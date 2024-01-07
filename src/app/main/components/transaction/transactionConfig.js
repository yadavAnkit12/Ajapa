import { lazy } from 'react';
const Transaction = lazy(() => import("./Transaction"));

const TransactionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/transaction/',
      element: <Transaction />,
      auth: ["admin", "employee"]
    },
  ],
};

export default TransactionConfig;