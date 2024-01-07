const key = process.env.REACT_APP_URL;
const jwtServiceConfig = {
  signIn: key + '/login',
  signUp: key + '/signup',
  country:key + '/countries',
  state:key + '/states',
  city:key + '/cities',
  otpSent:key + '/verifyMobileNumberEmail',
  otpVerify:key +'/verifyMobileNumberEmailUsingOTP',
  accessToken: key + '/loginUsingToken',
  updateUser: key + 'api/auth/user/update',
  getPermissions: key + '/api/role/list/permission',
  forgotPassword:key+'/api/user/ForgetPassword',
  resetPassword:key+'/api/user/ResetPassword',
  sentOTPForLogin:key +'/sendOTPForLogin',
  verifyOTPlogin:key + '/loginUsingOTP'
};

export default jwtServiceConfig;
