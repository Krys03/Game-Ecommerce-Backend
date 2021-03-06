'use strict';
const stripe = require("stripe")("sk_test_51Kj29tIs20Xvy5SOKC5mF16GwR50EcUTNiH10AouDZIKjsr1JGYEmUXaaW7vhyhNtjRDhefgb4i4wqy0VxV9x8Mb00IPdDuy61");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 module.exports = {
    async create(ctx) {
      const { token, products, idUser, addressShipping } = ctx.request.body;
      let totalPayment = 0;
      products.forEach((product) => {
        totalPayment = totalPayment + product.price;
      });
  
      const charge = await stripe.charges.create({
        amount: totalPayment * 100,
        currency: "eur",
        source: token.id,
        description: `ID Usuario: ${idUser}`,
      });
  
      const createOrder = [];
      for await (const product of products) {
        const data = {
          game: product.id,
          user: idUser,
          totalPayment,
          idPayment: charge.id,
          addressShipping,
        };
        const validData = await strapi.entityValidator.validateEntityUpdate(
          strapi.models.order,
          data
        );
        const entry = await strapi.query("order").create(validData);
        createOrder.push(entry);
      }
      return createOrder;
    },
  };
