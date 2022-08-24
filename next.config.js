const { withPlausibleProxy } = require('next-plausible');

module.exports = withPlausibleProxy({
  customDomain: 'https://analytics.cryptostats.community',
})({});
