'use strict';

module.exports = async () => {
  console.log("I RAN ATLEAST")
  const orders = await strapi.query('order').find();

  for (const order of orders) {
    const { customer_name, products } = order;

    for (const product of products) {
      const { img, desc, price, title } = product;

      await strapi.query('purchase').create({
        customer_name,
        img,
        desc,
        price,
        title,
      });
    }
  }
};