'use strict';

/**
 * testimony service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::testimony.testimony');
