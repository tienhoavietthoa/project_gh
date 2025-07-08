document.getElementById('checkoutForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch('/order/checkout', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (response.ok) {
        alert('Order placed successfully! Order ID: ' + result.orderId);
        window.location.href = '/'; // Redirect to home or any other page
    } else {
        alert('Failed to place order: ' + result.message);
    }
});