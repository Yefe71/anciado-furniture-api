"use strict";

const axios = require('axios');
const { createCoreController } = require("@strapi/strapi").factories;


module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products } = ctx.request.body;

    const lineItems = products.map((product) => ({
      amount: Math.round(product.price * 100),
      currency: "PHP",
      description: product.desc,
      // images: [product.image],
      name: product.title,
      quantity: product.quantity,
    }));


    console.log(lineItems, "line items btihc")
    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/checkout_sessions',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic c2tfdGVzdF9Tc1FMZWplUlZEZlZza1pldldxNER0a3U6'
      },
      data: {
        data: {
          attributes: {
            billing: {address: {country: 'PH'}},
            line_items: lineItems,
            payment_method_types: ['card', 'gcash'],
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
            cancel_url: 'http://localhost:5173/',
            success_url: 'http://localhost:5173/',
            description: 'string'
          }
        }
      }
    };


    try {
      const response = await axios.request(options);
      const source = response.data;
      console.log(source, "HAHAHHAHAHHA");
     
      console.log(source.data.id, "hhaha")
      await strapi
      .service("api::order.order")
      .create({ data: {  products, paymongo_checkout_id: source.data.id } });
      ctx.send({ source });
    } catch (error) {
      console.log(lineItems)
      console.error(error, "heheheh");
      console.error(error.response.data, "AHHAHAH"); // Print the API response data
      ctx.badRequest(error);
    }
  },
}));


