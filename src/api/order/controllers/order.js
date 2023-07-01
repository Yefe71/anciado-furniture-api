'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    handleWebhook: async (ctx) => {
        try {
    
          const eventData = ctx.request.body;
          ctx.status = 200;
          ctx.body = 'Webhook event processed successfully';
          console.log(eventData)
        } catch (error) {
          // Handle any errors that occur during event processing
          console.error(error);
          ctx.throw(500, 'Error processing webhook event');
        }
      },
}) );
