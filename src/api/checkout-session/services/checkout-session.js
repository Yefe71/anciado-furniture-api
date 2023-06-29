'use strict';

/**
 * checkout-session service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::checkout-session.checkout-session');
