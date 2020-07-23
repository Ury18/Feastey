const stripe = require('stripe')("sk_test_51H7jFNHesZkxfUDSxvwv2mB4CnKVVwp9zpJHt2wduwvZHPZdmPEsUGLsK8RZHHcrbBfFBSsE81CKvmRTjBDwLs4a00LdaLOOgd")

const stripeHelper = {

    createSubscriber(email) {
        return stripe.customers.create({
            email
        })
    },
    async createSubscription(customerId, paymentMethodId, priceId) {
        try {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customerId,
            });
        } catch ({ message}) {
            throw Error(message)
        }

        // Change the default invoice settings on the customer to the new payment method
        await stripe.customers.update(
            customerId,
            {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            }
        );

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            expand: ['latest_invoice.payment_intent'],
        });

        return subscription
    }
}

module.exports = stripeHelper
