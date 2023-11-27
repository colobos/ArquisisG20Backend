const checkAdminToken = (token) => {
  const decodedAccessToken = JSON.parse(atob(token.split('.')[1]));
  if (decodedAccessToken['permissions'][0] === 'admin:uses') {
    console.log('Es admin!')
    return true;
  } else {
    console.log('No es admin!')
    return false
  }
}

module.exports = { checkAdminToken };