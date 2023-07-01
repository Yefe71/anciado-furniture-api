'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    handleWebhook: async (ctx) => {
        try {
    
          const eventData = ctx.request.body;
    
        //   // Process the event based on its type
        //   switch (eventData.data.attributes.type) {
        //     case 'payment.paid':
        //       // Logic to handle payment.paid event
        //       break;
        //     case 'payment.failed':
        //       // Logic to handle payment.failed event
        //       break;
        //     case 'source.chargeable':
        //       // Logic to handle source.chargeable event
        //       break;
        //     default:
        //       // Unknown event type
        //       break;
        //   }
    
          console.log(eventData, "PLEASE I RAN RIGHT?")
        //   // Send a successful response to PayMongo
        //   ctx.send({ received: true });

            // return ctx.request.body;
        } catch (error) {
        //   // Handle any errors that occur during event processing
        //   console.error(error);
        //   ctx.throw(500, 'Error processing webhook event');
        }
      },
}) );
