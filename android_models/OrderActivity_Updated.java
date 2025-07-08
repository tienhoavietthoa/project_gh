// Trong OrderActivity.java, thay thế method placeOrder():

private void placeOrder() {
    String name = editName.getText().toString().trim();
    String phone = editPhone.getText().toString().trim();
    String detail = editDetailAddress.getText().toString().trim();

    String city = spinnerCity.getSelectedItem() != null ? spinnerCity.getSelectedItem().toString() : "";
    String ward = spinnerWard.getSelectedItem() != null ? spinnerWard.getSelectedItem().toString() : "";
    String address = detail + ", " + ward + ", " + city;

    if (name.isEmpty() || phone.isEmpty() || detail.isEmpty() || city.isEmpty() || ward.isEmpty()) {
        Toast.makeText(this, "Vui lòng nhập/chọn đủ thông tin giao hàng!", Toast.LENGTH_SHORT).show();
        return;
    }

    if (!phone.matches("^0\\d{9}$")) {
        Toast.makeText(this, "Số điện thoại phải đủ 10 số và bắt đầu bằng số 0!", Toast.LENGTH_SHORT).show();
        return;
    }

    RadioButton selectedPayment = findViewById(radioPayment.getCheckedRadioButtonId());
    String payment = selectedPayment.getText().toString();

    double total = 0;
    for (CartItem item : cartItemsToOrder) {
        total += (double) item.price * item.quantity;
    }

    int idLogin = getSharedPreferences("user_prefs", MODE_PRIVATE).getInt("id_login", -1);
    if (idLogin <= 0) {
        Toast.makeText(this, "Bạn chưa đăng nhập!", Toast.LENGTH_SHORT).show();
        return;
    }

    String productsJson = new Gson().toJson(cartItemsToOrder);
    
    // Gọi API tạo đơn hàng
    OrderApi orderApi = ApiClient.getClient().create(OrderApi.class);
    orderApi.createOrder(name, phone, address, payment, (int) total, idLogin, productsJson)
            .enqueue(new Callback<VNPayResponse>() {
                @Override
                public void onResponse(@NonNull Call<VNPayResponse> call, @NonNull Response<VNPayResponse> response) {
                    if (response.isSuccessful() && response.body() != null && response.body().success) {
                        VNPayResponse vnpayResponse = response.body();
                        
                        if (payment.equalsIgnoreCase("VNPAY")) {
                            // Mở VNPayActivity để thanh toán
                            Intent intent = new Intent(OrderActivity.this, VNPayActivity.class);
                            intent.putExtra("vnpayUrl", vnpayResponse.vnpayUrl);
                            intent.putExtra("orderId", vnpayResponse.orderId);
                            startActivityForResult(intent, 1001);
                        } else {
                            // Thanh toán COD thành công
                            Toast.makeText(OrderActivity.this, "Đặt hàng thành công!", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                    } else {
                        Toast.makeText(OrderActivity.this, "Đặt hàng thất bại!", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(@NonNull Call<VNPayResponse> call, @NonNull Throwable t) {
                    Toast.makeText(OrderActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
}

@Override
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == 1001) {
        if (resultCode == RESULT_OK) {
            Toast.makeText(this, "Thanh toán VNPay thành công!", Toast.LENGTH_SHORT).show();
            finish();
        } else {
            Toast.makeText(this, "Thanh toán VNPay thất bại!", Toast.LENGTH_SHORT).show();
        }
    }
}
