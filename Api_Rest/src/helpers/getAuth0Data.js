const axios = require('axios');

const getAuth0Data = async (token) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://dev-52dssjpzymdnahmc.us.auth0.com/userinfo',
      headers: { authorization: `Bearer ${token}` },
    };
    
    const response = await axios.request(options);
    console.log('auth0 user data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getAuth0Data:', error);
    throw error; // Re-throw the error if needed
  }
};



module.exports = { getAuth0Data };