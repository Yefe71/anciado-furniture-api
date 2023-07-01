
module.exports = {
    routes: [
      { 
        method: 'POST',
        path: '/orders/webhook',
        handler: 'order.handleWebhook',
      }
    ]
  }