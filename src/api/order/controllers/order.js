"use strict";

const axios = require('axios');
const { createCoreController } = require("@strapi/strapi").factories;

const populatePurchases = async () => {
  await strapi.db.query('api::order-item.order-item').deleteMany({});

  const orders = await strapi.service("api::order.order").find();
  const orderItemsList = await strapi.service("api::order-item.order-item").find();

  console.log(orderItemsList, "HIAHIIHAIHAIHAIHAIH")
  for (const order of orders.results) {
    const { customer_name, paymongo_checkout_id, products, createdAt } = order;

    console.log(createdAt, "CREATED AT")
    for (const product of products) {
      const { img, desc, price, title } = product;
      await strapi
        .service("api::order-item.order-item")
        .create({
          data: {
            customer_name,
            img,
            desc,
            price,
            title,
            paymongo_checkout_id,
            createdAt
          },
        });
    }
  }

  console.log("Populating purchases...");
};

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, user } = ctx.request.body;
    const lineItems = products.map((product) => ({
      amount: Math.round(product.price * 100),
      currency: "PHP",
      description: product.desc.substring(0, 249),
      name: product.title,
      quantity: product.quantity,
    }));

    console.log(user, "HAHAH")

    
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
            description: `Anciado Furniture`,
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
      .create({ data: {  products, paymongo_checkout_id: source.data.id, customer_name: `${user.first_name} ${user.last_name}`} });
      
      await populatePurchases()
      
      ctx.send({ source });
    } catch (error) {
      console.log(lineItems)
      console.error(error, "heheheh");
      console.error(error.response.data, "AHHAHAH"); // Print the API response data
      ctx.badRequest(error);
    }
  },
}));


