import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { connect } from 'react-redux'

import CardSection from '../CardSection';

function CheckoutForm(props) {
    const stripe = useStripe();
    const elements = useElements();

    function createSubscription({ customerId, paymentMethodId, priceId }) {
        return (
            fetch(`${process.env.FEASTEY_API_URL}/stripe/create-subscription`, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                    "Authorization": `Bearer ${props.user.token || ""}`
                },
                body: JSON.stringify({
                    customerId,
                    paymentMethodId,
                    priceId,
                }),
            })
                .then((response) => {
                    return response.json();
                })
                // If the card is declined, display an error to the user.
                .then((result) => {
                    if (result.error) {
                        // The card had an error when trying to attach it to a customer.
                        throw result;
                    }
                    return result;
                })
                // Normalize the result to contain the object returned by Stripe.
                // Add the additional details we need.
                .then((result) => {
                    return {
                        paymentMethodId: paymentMethodId,
                        priceId: priceId,
                        subscription: result,
                    };
                })
                // Some payment methods require a customer to be on session
                // to complete the payment process. Check the status of the
                // payment intent to handle these actions.
                // .then(handlePaymentThatRequiresCustomerAction)
                // // If attaching this card to a Customer object succeeds,
                // // but attempts to charge the customer fail, you
                // // get a requires_payment_method error.
                // .then(handleRequiresPaymentMethod)
                // // No more actions required. Provision your service for the user.
                // .then(onSubscriptionComplete)
                // .catch((error) => {
                //     // An error has happened. Display the failure to the user here.
                //     // We utilize the HTML element we created.
                //     showCardError(error);
                // })
        );
    }

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // If a previous payment was attempted, get the latest invoice
        const latestInvoicePaymentIntentStatus = localStorage.getItem(
            'latestInvoicePaymentIntentStatus'
        );

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[createPaymentMethod error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            const paymentMethodId = paymentMethod.id;
            if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
                // Update the payment method and retry invoice payment
                const invoiceId = localStorage.getItem('latestInvoiceId');
                retryInvoiceWithNewPaymentMethod({
                    customerId,
                    paymentMethodId,
                    invoiceId,
                    priceId,
                });
            } else {
                // Create the subscription
                createSubscription({ customerId: "cus_HhXCf0R70DvHz5", paymentMethodId, priceId:"price_1H7jXCHesZkxfUDSo4o2xLrL" });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{"width":"20em","maxWidth":"initial !important","display":"block"}}>
            <CardSection />
            <button disabled={!stripe}>Confirm order</button>
        </form>
    );
}


const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(CheckoutForm)
