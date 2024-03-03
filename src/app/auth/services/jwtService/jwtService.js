import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';
import { setPermissions } from '../utils/common';

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        console.log(err)
        if (err.response.status === 401) {
          return new Promise((resolve, reject) => {
            this.emit('invalidValue', err.response.data.error_message);
          });
        } else {
          return err.response;
        }
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(jwtServiceConfig.signUp, data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
          this.emit('onLogin', response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = async (email, countryCode, mobileNumber, password) => {

    const formData = new FormData()
    formData.append('email', email)
    formData.append('countryCode', countryCode)
    formData.append('mobileNumber', mobileNumber)
    formData.append('password', password)
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.signIn, formData)
        .then((response) => {
          console.log(response)
          if (response.status !== 200) {
            reject(response?.data?.errorMessage)
          }
          else {
            localStorage.setItem('role',response.data.user.role)
            const userData = {
              user: {
                uuid: response.data.user.id,
                role: [response.data.user?.role],
                data: {
                  "name": response.data.user.name,
                  "email": response.data.user.email,
                  "photoURL": response.data.user?.profileImage,
                }
              },
              access_token: response.data.token
            }
            if (response.data.user) {

              sessionStorage.setItem('userRole', _.get(response, 'data.user.role'));
              sessionStorage.setItem('id', _.get(response, 'data.user.id'));
              sessionStorage.setItem('familyId', _.get(response, 'data.user.familyId'));
              this.setSession(userData.access_token);
              // this.getPermissions(_.get(response, 'data.user.roleID'));
              resolve(response.data.user);
              this.emit('onLogin', userData.user);
            } else {
              reject(response.data.error_message);
            }
          }

        }).catch((error) => {
          reject(error);
        })
    });
  };

  signInWithOTP = async (email, countryCode, mobileNumber, otp) => {

    const formData = new FormData()
    formData.append('email', email)
    formData.append('countryCode', countryCode)
    formData.append('mobileNumber', mobileNumber)
    formData.append('otp', otp)
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.verifyOTPlogin, formData)
        .then((response) => {
          if (response.status !== 200) {
            reject(response?.data?.errorMessage)
          }
          else {
            localStorage.setItem('role',response.data.user.role)
            const userData = {
              user: {
                uuid: response.data.user.id,
                role: [response.data.user?.role],
                data: {
                  "name": response.data.user.name,
                  "email": response.data.user.email,
                  "photoURL": response.data.user?.profileImage,
                }
              },
              access_token: response.data.token
            }
            if (response.data.user) {
              sessionStorage.setItem('userRole', _.get(response, 'data.user.role'));
              sessionStorage.setItem('id', _.get(response, 'data.user.id'));
              sessionStorage.setItem('familyId', _.get(response, 'data.user.familyId'));
              this.setSession(userData.access_token);
              // this.getPermissions(_.get(response, 'data.user.roleID'));
              resolve(response.data.user);
              this.emit('onLogin', userData.user);
            } else {
              reject(response.data.error_message);
            }
          }

        }).catch((error) => {
          reject(error);
        })
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(jwtServiceConfig.accessToken, {
          headers: {
            'Authorization': `Bearer ${this.getAccessToken()}`
          }
        })
        .then((response) => {
          localStorage.setItem('role',response.data.user.role)
          const userData = {
            user: {
              uuid: response.data.user.id,
              role: [response.data.user.role],
              data: {
                "name": response.data.user.name,
                "email": response.data.user.email,
                "photoURL": response.data.user?.profileImage
              }
            },
            access_token: response.data.token
          }
          if (response.data.user) {
            sessionStorage.setItem('userRole', _.get(response, 'data.user.role'));
            sessionStorage.setItem('id', _.get(response, 'data.user.id'));
            sessionStorage.setItem('familyId', _.get(response, 'data.user.familyId'));
            this.setSession(userData.access_token);
            // this.getPermissions(_.get(response, 'data.data.userDetails.roleID'));
            resolve(userData.user);
          } else {
            this.logout();
            reject(new Error('Failed to login with token.'));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Failed to login with token.'));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  getPermissions = (roleData) => {
    axios.get(`${jwtServiceConfig.getPermissions}/${roleData._id}`, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setPermissions(response.data.data);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    })
  }

  logout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('jwt_access_token')
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('familyId');
    this.setSession(null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };
}
const instance = new JwtService();

export default instance;
