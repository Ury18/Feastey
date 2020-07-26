const stripe = require('stripe')("sk_test_51H7jFNHesZkxfUDSxvwv2mB4CnKVVwp9zpJHt2wduwvZHPZdmPEsUGLsK8RZHHcrbBfFBSsE81CKvmRTjBDwLs4a00LdaLOOgd")

const stripeHelper = {

    createSubscriber(email) {
        return stripe.customers.create({
            email
        })
    },

    changeSubscriberEmail(subscriberId, email) {
        return stripe.customers.update(
            subscriberId,
            { email }
        )
    },

    async deleteSubscriber(customerId) {
        return stripe.customers.del(customerId)
    },

    async createSubscription(customerId, paymentMethodId, priceId) {
        try {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customerId,
            });
        } catch ({ message}) {
            return({error:message})
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
        let subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            expand: ['latest_invoice.payment_intent'],
        });

        return subscription
    },

    async changeSubscriptionPrice(subscriptionId, priceId) {
        console.log(subscriptionId, priceId)
        const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
        )
        const updatedSubscription = await stripe.subscriptions.update(
            subscriptionId,
            {
                cancel_at_period_end: false,
                items:[
                    {
                        id: subscription.items.data[0].id,
                        price: priceId
                    }
                ]
            }
        )

        return updatedSubscription

    }

}

module.exports = stripeHelper
