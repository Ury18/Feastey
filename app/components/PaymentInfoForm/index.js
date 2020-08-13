import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { connect } from 'react-redux'

import CardSection from '../../stripe/CardSection';

function PaymentInfoForm(props) {
    const stripe = useStripe();
    const elements = useElements();

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

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[createPaymentMethod error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            const paymentMethodId = paymentMethod.id;
            // Return the payment method
            props.onSubmit(paymentMethodId);
        }
    };

    return (
        <div className="stripeCardContainer">
            <CardSection />
            <button style={{marginBottom:"1em"}} disabled={!stripe} onClick={handleSubmit}>Confirmar metodo de pago</button>
        </div>
    );
}


const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(PaymentInfoForm)
