/**
 * Paystack Connector for OKOLEA CHAPCHAP Mobile App
 * This file handles the integration with Paystack's Inline Payment JS library.
 */

// Replace with your actual live public key from the Paystack Dashboard
const PAYSTACK_PUBLIC_KEY = 'pk_live_639ef627c0703f04f9e1ced898b982ab104b9489';

/**
 * Initiates a Paystack payment for the commitment fee.
 * 
 * @param {number} amount - The amount to be paid in KES (Ksh).
 * @param {string} email - The user's email address (required by Paystack).
 * @param {string} reference - A unique reference for this transaction.
 * @param {function} onSuccess - Callback function to be executed upon successful payment.
 * @param {function} onError - Callback function to be executed if the payment fails or is closed.
 */
function payCommitmentFee(amount, email, reference, onSuccess, onError) {
    // Paystack expects the amount in the smallest currency unit (Kobo/Cents), 
    // so we multiply the KES amount by 100.
    const amountInKobo = amount * 100;

    // Check if the Paystack library is loaded
    if (typeof PaystackPop === 'undefined') {
        const errorMsg = 'Paystack library not loaded. Please check your internet connection.';
        console.error(errorMsg);
        if (typeof onError === 'function') {
            onError(errorMsg);
        } else {
            alert(errorMsg);
        }
        return;
    }

    // Initialize the Paystack handler
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amountInKobo,
        currency: 'KES',
        ref: reference,
        label: `Loan Commitment Fee: Ksh ${amount}`,
        metadata: {
            custom_fields: [
                {
                    display_name: "Payment Type",
                    variable_name: "payment_type",
                    value: "Loan Commitment Fee"
                }
            ]
        },
        callback: function(response) {
            // Payment was successful
            console.log('Payment successful. Reference:', response.reference);
            if (typeof onSuccess === 'function') {
                onSuccess(response);
            }
        },
        onClose: function() {
            // User closed the payment window
            const cancelMsg = 'Transaction was not completed. Please try again to submit your application.';
            console.log(cancelMsg);
            if (typeof onError === 'function') {
                onError(cancelMsg);
            }
        }
    });

    // Open the Paystack payment iframe
    handler.openIframe();
}

/**
 * Generates a random commitment fee from a predefined list.
 * @returns {number} A fee of either 100, 150, or 250.
 */
function generateCommitmentFee() {
    const fees = [100, 150, 250];
    const randomIndex = Math.floor(Math.random() * fees.length);
    return fees[randomIndex];
}

// Export functions if using a module system (optional for this project)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        payCommitmentFee,
        generateCommitmentFee,
        PAYSTACK_PUBLIC_KEY
    };
}
