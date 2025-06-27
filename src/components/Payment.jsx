import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/Scrap_Collector/Payment.css'; // Assuming you have a separate CSS file

const Payment = () => {
    const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
    const { order_id, user } = useParams();
    const [amount, setAmount] = useState('');

    // Handle input change and dynamically update amount
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
    };

    const addPaymentStatus = async (transaction_id, username, owner_id, amount) => {

        try {
            const response = await fetch(`${backendUrl}payment-status/${order_id}/${username}/${owner_id}/${amount}/${transaction_id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            });

            if (response.ok) {
                alert("Payment Successful! ID: " + transaction_id);
            } else {
                const err = await response.json();
                console.log("Payment Status Error:", err);
                alert("Some error occured, Try again later!");
            }
        } catch (e) {
            alert("Some error occured");
            console.log("Error in addPaymentStatus", e.data);
        }
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        const amountInPaise = parseInt(amount) * 100;
        if (amountInPaise <= 0 || isNaN(amountInPaise)) {
            alert("Please enter a valid amount!");
            return;
        }

        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                alert("User not authenticated!");
                return;
            }


            const response = await fetch(backendUrl+'payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
                body: JSON.stringify({ amount: amountInPaise }),
            });
            if (response.ok) {
                const data = await response.json();
                const options = {
                    key: data.api_key,
                    amount: amountInPaise,
                    currency: "INR",
                    name: "ScrapBridge",
                    description: "Test Transaction",
                    image: "https://scrapbridge-api-r54n.onrender.com/static/logo.png",
                    order_id: data.payment_id,
                    handler: async function (response) {
                        await addPaymentStatus(data.payment_id, user, localStorage.getItem("user_id"), amount);
                        window.location.href = "/scrap-collector";
                    },
                    prefill: {
                        name: "Shivam Sharma",
                        email: "shivam@241980@example.com",
                        contact: "9953214480",
                    },
                    theme: {
                        color: "rgba(52,54,242,0.8)",
                    },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
                rzp1.on('payment.failed', function (response) {
                    console.error("Payment Failed:", response.error.description);
                    alert("Payment Failed: " + response.error.description);
                });
            } else {
                alert("Some error occured, please try again")
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
        }
    };


    // Get current date and time
    const currentDate = new Date().toLocaleString();

    return (
        <div className="payment-body">
            <div className="corner-design corner-top-left"></div>
            <div className="corner-design corner-bottom-right"></div>
            <div className="payment-container">
                <h2>Secure Payment</h2>
                <form onSubmit={handlePayment}>
                    <label>Payment from</label>
                    <input type="text" value={localStorage.getItem("username")} readOnly id='payment-inp' />

                    <label>Payment to</label>
                    <input type="text" value={user} readOnly id='payment-inp' />

                    <label>Amount</label>
                    <input
                        type="number"
                        placeholder="Enter amount*"
                        value={amount}
                        onChange={handleAmountChange}
                        id='payment-inp'
                    />
                    <div className="amount-display">
                        <p>
                            ₹ {amount ? amount : '0'} {/* Dynamic amount display */}
                        </p>
                    </div>
                    <button type="submit" id='paymentBtn'>Confirm Payment</button>
                </form>

                <div className="date-time">
                    <p>{currentDate}</p> {/* Display current date & time */}
                </div>

                <div className="terms-conditions">
                    <h4>Terms & Conditions:</h4>
                    <ul>
                        <li>Payments are non-refundable.</li>
                        <li>Ensure you have sufficient balance before making a payment.</li>
                        <li>All transactions are secured with encryption.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Payment;
