"use strict";

const sdk = require("api")("@paymongo/v2#5u9922cl2759teo");
/**
 * order controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products } = ctx.request.body;
    const lineItems = products.map((product) => ({
      amount: Math.round(product.price * 100),
      currency: "PHP",
      description: product.desc,
      // images: [product.image],
      name: product.name,
      quantity: product.quantity,
    }));
    const data = {
      attributes: {
        cancel_url: "http://example.com/cancel",
        billing: {
          address: {
            line1: "123 Main St.",
            line2: "Suite 1",
            city: "Makati",
            state: "Metro Manila",
            postal_code: "1234",
            country: "PH",
          },
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+639123456789",
        },
        description: "My order",
        line_items: lineItems,
        payment_method_types: ["card"],
        reference_number: "123456",
        send_email_receipt: false,
        show_description: true,
        show_line_items: true,
        success_url: "http://example.com/success",
        statement_descriptor: "My Business",
      },
    };
    try {
      sdk.auth("sk_test_SsQLejeRVDfVskZevWq4Dtku");
      const response = await sdk.createACheckout({ data: data });
      const checkout = response.data;
      await strapi.services.order.create({
        paymongo_checkout_id: checkout.data.id,
        products,
      });
      ctx.send({ checkout });
    } catch (error) {
      console.error(error);
      ctx.badRequest(error);
    }
  },
}));
