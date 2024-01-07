
import Symptom from './Symptom';

const SymptomConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/symptom/',
      element: <Symptom />,
      auth: ["admin", "employee"]
    }
  ],
};

export default SymptomConfig;