import Layout from '../app/components/Layout'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateUserData } from '../app/redux/user/action'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../app/stripe/CheckoutForm'
import CustomerForm from '../app/stripe/CustomerForm'

const stripePromise = loadStripe("pk_test_51H7jFNHesZkxfUDSfJkBztrwFiLv7BnMbzJdhbleX9haB2ncM4RUjfWOazBen7aK3yW3x2BzDd26Z2wOq4BVkuni00vFmhfisR");

const Stripe = (props) => {

    return (
        <Layout contentClasses="centered">
            <Elements stripe={stripePromise}>
                <CustomerForm/>
                <CheckoutForm />
            </Elements>
        </Layout>
    )
}

Stripe.getInitialProps = async (ctx) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(Stripe)
