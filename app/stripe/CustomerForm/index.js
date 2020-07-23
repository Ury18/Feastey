import React, { useState } from 'react';
import { connect } from 'react-redux'

function CreateCustomerForm(props) {
    const [email, setEmail] = useState('');
    const [customer, setCustomer] = useState(null);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        return fetch(`${process.env.FEASTEY_API_URL}/stripe`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${props.user.token || ""}`
            },
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                setCustomer(result.customer);
            });
    };

    return (
        <form id="signup-form" onSubmit={handleSubmit}>
            <div>
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                />
            </div>

            <button id="email-submit" type="submit">
                <span id="button-text">Sign up</span>
            </button>
        </form>
    );
}

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}

export default connect((state => state), mapDispatchToProps)(CreateCustomerForm)
