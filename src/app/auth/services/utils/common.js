export const setPermissions = (permissions) => {
    sessionStorage.setItem('userPermission', JSON.stringify(permissions));
}

export const getPermissions = () => {
    const menuSelected = _.split(window.location.pathname, '/')[2];
    return _.find(JSON.parse(sessionStorage.getItem('userPermission')), permission=> permission.permission.toLowerCase()=== menuSelected);
}

export const getLoggedInPartnerId = () => {
    return sessionStorage.getItem('id');
}

export const getUserRoles = () => {
    return sessionStorage.getItem('userRole');
}

export const getRootLevelPermissions = () => {
    return JSON.parse(sessionStorage.getItem('permission'))?.root_permission;
}
export const getEventLevelPermissions = () => {
    return JSON.parse(sessionStorage.getItem('permission'))?.event_level_permission;
}