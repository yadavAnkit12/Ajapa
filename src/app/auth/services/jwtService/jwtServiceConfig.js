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
  resetPassword:key+'/changePassword',
  sentOTPForLogin:key +'/sendOTPForLogin',
  verifyOTPlogin:key + '/loginUsingOTP',
  otpVerifyForForgetPassword: key + '/verifyOTP'
};

export default jwtServiceConfig;
