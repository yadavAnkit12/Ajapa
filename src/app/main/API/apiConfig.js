const key = process.env.REACT_APP_URL;

export const userAPIConfig = {
    getPermissions: key + '/api/role/list/permission',
    profileUpdate: key +'/api/user/edit',
    list:key+'/user/list',
    changeStatus:key+'/changeStatus',
    getUserById:key+'/getUser',
    updateUser:key + '/updateUser',
    updateUserWithImage: key + '/updateUserWithImage',
    userReport:key + "/report/user/list",
    userReportPDF: key + "/reportPdf/user/list",
    // getUserByFamily: key + '/getUsersByFamilyId',
    changeHead:key + '/changeHead',
    getUserByFamily: key + '/getApprovedUsersByFamilyId',
    myRegistration: key + '/event/registration/family/list',
    sendSMS: key +'/sendCusmtomSMS',
    smsTemplate: key + '/groupSMS/list'
}
export const eventAPIConfig = {
    create: key + '/saveEvent',
    createWithImage:key + "/saveEventWithImage",
    list:key + '/event/list',
    getById:key +'/event',
    delete:key+ '/event/status',
    view:key + '/event',
    changeBookingStatus:key +'/event/booking',
    changeEventStatus:key+'/event/status',
    userEventRegistration:key+'/event/registration/save',
    allEventRegistrationList: key + '/event/registration/list',
    allEventList:key + '/event/all/list',
    checkEventRegistration: key + '/event/registration/family/event/list',
    myRegistration:key+'/event/registration',
    registrationDelete: key +'/event/registration/delete',
    fetchRegisterUserByEvent: key + '/event/registrations',
    sendRoomBookingStatus: key + '/bookingStatus/send' ,
    saveOneAttendance: key + '/attendance/save/one',
    eventReport:key + "/reportExcel/event/registration/list",
    eventReportPdf:key + "/reportPDF/event/registration/list",
    cancelAllRegistration:key + '/eventRegistrations/delete',
}

export const attendanceAPIConfig = {
    attendanceReport: key + "/reportExcel/event/registrations",
    attendancePdf: key + "/reportPdf/event/registrations"
}

export const foodAPIConfig = {
    saveFood: key + '/saveFoodDetails',
    getFoodCheck : key + '/getFoodDetail',
    getFoodDetails: key + '/getFoodDetails'
}

export const reportAPIConfig = {
   report1arrival: key + '/report1/arrival/event/registrations',
   report1departure : key +'/report1/departure/event/registrations',
   report2arrival : key +'/report2/arrival/event/registrations',
   report2departure : key +'/report2/departure/event/registrations'
}


export const cardAPIConfig = {
    carddetails: key + '/getCardsDetails'
 }




export const doctorAPIConfig = {
    register: key + '/api/doctor/RegisterDoctor',
    getDoctorList: key + '/api/doctor/ListDoctors',
    deleteDoctorById: key + '/api/doctor/DeleteDoctor',
    getDoctorbyId: key + '/api/doctor/GetDoctorDetails',
    updateDoctorbyId: key + '/api/doctor/EditDoctor',
    fetchQualification: key + '/api/doctor/QualificationList',
    changeStatus: key + '/api/doctor/changeStatus',
    getProfile: key + '/api/doctor/profile',
    pay: key + '/api/web/doctor/pay',
    updateFee: key + '/api/doctor/web/updateFee',
    doctorAppointment: key + '/api/doctor/appointment',
    doctorEarning: key + '/api/doctor/earning/list',
    fetchLanguages: key + '/api/util/languages',
    block:key+'/api/doctor/BlockDoctor'

};

export const caseAPIConfig = {
   list:key+'/api/case/ListCases',
   register:key+'/api/case/RegisterCase',
   edit:key+'/api/case/EditRegisteredCase',
   getCaseByID:key+'/api/case/GetSingleCase',
   delete:key+'/api/case/DeleteSingleCase',
   fileUpload:key+'/api/user/UploadSingleFile'
}

export const employeeAPIConfig = {
    register: key + '/api/user/RegisterEmployee',
    fetch: key + '/api/role/list',
    getUser: key + '/api/user/GetEmployeeDetails',
    edit: key + '/api/user/EditUser',
    changeStatus: key + '/api/user/changeStatus',
    list: key + '/api/user/ListEmployees',
    delete: key + '/api/user/DeleteEmployee',
    block:key+'/api/user/BlockUser'
};

export const attachmentAPIConfig = {
    list:key+'/api/attachment/attachmentList',
    edit:key+'/api/attachment/editAttachment',
    delete:key+'/api/attachment/deleteAttachment',
    getById:key+'/api/attachment/getAttachmentByCaseType',
    
};

export const patientAPIConfig = {
    register: key + '/api/patient/RegisterPatient',
    getPatientbyId: key + '/api/patient/getPatient',
    edit: key + '/api/patient/EditPatient',
    getPatientList: key + '/api/patient/ListPatient',
    getPatientByMobile: key + '/api/patient/fetchByMobile',
    getProfile: key + '/api/patient/profile',
    updateAppoinment: key + '/api/patient/updateAppointment',
    patientAppointment: key + '/api/patient/appointmentList',
    patientEhr: key + '/api/patient/ehrList',
    otpVerify: key + '/api/patient/otpVerify',
    sendOTP: key + '/api/patient/sendOTP',
    fetchMobile: key + '/api/patient/fetchMobile',
    getAccount: key + '/api/wallet/web/get/account',
    fetchTransaction: key + '/api/wallet/fetch/transaction',
    walletPonit: key + '/api/wallet/web/point',
    checkPatient:key +'/api/patient/fetchByMobile',
    patientListForClinic:key+'/api/patient/PatientListForClinic'

};
export const clinicAPIConfig = {
    list:key + '/api/clinic/ListClinics',
    register:key + '/api/clinic/RegisterClinic',
    getById:key+'/api/clinic/GetClinicDetails',
    delete:key+'/api/clinic/DeleteClinic',
    update:key+'/api/clinic/EditClinic',
    block:key+'/api/clinic/BlockClinic'
    
};

export const partnerAPIConfig = {
    register: key + '/api/partner/signUp',
    getById: key + '/api/partner/fetch',
    list: key + `/api/partner/list`,
    updatepartnerbyId: key + '/api/partner/web/edit',
    deletePartnerById: key + '/api/partner/web/delete',
    changeStatus: key + '/api/partner/changeStatus',
    getProfile: key + '/api/partner/view',
    partnerEarning: key + '/api/partner/earning/list'
};

export const appointmentAPIConfig = {
    bookAppointment: key + '/api/appointment/web/book',
    getSlots: key + '/api/appointment/web/get/slots',
    appointmentsList: key + `/api/appointment/web/fetch/list`,
    appointmentByID: key + `/api/appointment/web/get/appointment`,
    getWeekEvents: key + '/api/appointment/web/get/week/events/list',
    getAllEvents: key + `/api/appointment/web/get/events/list`,
    appointmentView: key + '/api/appointment/web/view',
    rescheduleAppointment: key + "/api/appointment/web/reschedule",
    cancelAppointment: key + "/api/appointment/web/canceled"
};

export const specializationAPIConfig = {
    fetchSpecialization: key + '/api/specialization/specializationList',
    fetchSymptom: key + '/api/symptom/list',
    fetch: key + '/api/specialization/SubspecializationList'
};

export const membershipAPIConfig = {
    list: key + '/api/membership/list',
    getPlan: key + '/api/membership/planById',
    edit: key + '/api/membership/edit',
    delete: key + '/api/membership/delete',
    create: key + '/api/membership/create',
    changeStatus: key + '/api/membership/changeStatus',
    activePlan: key + '/api/membership/activePlan'
};

export const transactionAPIConfig = {
    transactionList: key + '/api/transaction/web/list',
    transactionView: key + '/api/transaction/web/view'
};

export const subscriptionAPIConfig = {
    subscribe: key + '/api/subscription/takeSubscription',
    list: key + '/api/subscription/list',
    getSubscription: key + '/api/subscription/get'
};

export const paymentModeAPIConfig = {
    list: key + '/api/pay/list'
}

export const couponAPIConfig = {
    list: key + '/api/coupon/list',
    create: key + '/api/coupon/createCoupon',
    edit: key + '/api/coupon/edit',
    delete: key + '/api/coupon/delete',
    fetch: key + '/api/coupon/fetch',
    changeStatus: key + '/api/coupon/changeStatus'
};

export const bannerAPIConfig = {
    list: key + '/api/banner/list',
    create: key + '/api/banner/uploadBanner',
    edit: key + '/api/banner/edit',
    fetch: key + '/api/banner/fetch',
    delete: key + '/api/banner/delete',
    activeCouponList: key + '/api/coupon/active/list'
};

export const symptomAPIConfig = {
    list: key + '/api/symptom/list',
    addSymptom: key + '/api/symptom/addSymptom',
    fetch: key + '/api/symptom/fetch',
    edit: key + '/api/symptom/edit',
    delete: key + '/api/symptom/delete'
};

export const labPartnerAPIConfig = {
    list: key + '/api/pathology/web/fetch/list',
    create: key + '/api/pathology/web/create',
    fetch: key + '/api/pathology/web/get',
    edit: key + '/api/pathology/web/edit',
    delete: key + '/api/pathology/web/delete',
    changeStatus: key + '/api/pathology/web/update/status',
    serviceView: key + '/api/pathology/web/view',
    fetchSample: key + '/api/util/lab/test/sample'
};

export const ProductAPIConfig = {
    productList: key + '/api/product/list',
    productView: key + '/api/product/get',
};

export const OrderAPIConfig = {
    list: key + '/api/productOrder/web/list',
    view: key + '/api/productOrder/web/get'
}


export const LabOrderAPIConfig = {
    list: key + '/api/pathologyOrder/web/fetch/list',
    view: key + '/api/pathologyOrder/web/get',
    uploadEHR: key + '/api/pathologyOrder/web/uplode/documents',
    getEHRList: key + '/api/pathologyOrder/web/ehr/list',
    setSampleCollected: key + '/api/pathologyOrder/web/sample/collect',
    paymentStatus: key + '/api/pathologyOrder/web/payment/status'
}

export const ConfigurationAPIConfig = {
    fetchConfiguration: key + '/api/setting/fetch',
    create: key + '/api/setting/configuration'
}

export const NotificationAPIConfig = {
    fetchNotification: key + '/api/notification/list',
    dismiss: key + '/api/notification/view'
}