//https://github.com/ipinfo/node 

const { IPinfoWrapper } = require('node-ipinfo');

const token = '2ed0f4f9986711';
const ipinfo = new IPinfoWrapper(token);

const getGeolocation = async (ip) => {
  console.log('using IP:', ip)
  const details = await ipinfo.lookupIp(ip);
  // Ver que detaller serán necesarios
  console.log('Obtained Geolocation details:', details);
  return details;
}

module.exports = { getGeolocation };
