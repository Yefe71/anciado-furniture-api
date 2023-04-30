"use strict";

const { createCoreController } = require("@strapi/strapi").factories;
const Paymongo = require("paymongo");
const paymongo = new Paymongo("sk_test_SsQLejeRVDfVskZevWq4Dtku");

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
      data: {
        attributes: {
          amount: lineItems.reduce((sum, item) => sum + item.amount * item.quantity, 0),
          currency: "PHP",
          type: "gcash",
          redirect: {
            success: "http://example.com/success",
            failed: "http://example.com/cancel",
          },
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
          statement_descriptor: "My Business",
        }
      }
    };



    try {
      const response = await paymongo.sources.create(data);
      const source = response.data;
      console.log(source, "HAHAHHAHAHHA");
     
      await strapi
      .service("api::order.order")
      .create({ data: {  products, paymongo_checkout_id: source.id } });

      ctx.send({ source });
    } catch (error) {
      console.error(error);
      ctx.badRequest(error);
    }
  },
}));
