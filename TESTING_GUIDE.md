# 🧪 HƯỚNG DẪN TESTING VÀ DEMO FLOW THANH TOÁN VNPAY

## 📋 Tổng Quan
Dự án này hỗ trợ nhiều phương pháp test flow thanh toán VNPay, đặc biệt tối ưu cho **demo và học tập** khi sandbox VNPay không ổn định.

## 🎯 Các Phương Pháp Test

### 1. **FAKE PAYMENT** (Khuyến nghị cho demo)
✅ **Hiện tại đang sử dụng**
- **Mục đích**: Demo flow hoàn chỉnh mà không cần VNPay thật
- **URL**: `http://localhost:3000/vnpay-test` (desktop) hoặc `http://10.0.2.2:3000/vnpay-test` (emulator)
- **Cách sử dụng**:
  1. Mở trang test
  2. Nhập Order ID (ví dụ: 22)
  3. Chọn trạng thái: Success/Failed
  4. Click "Update Order Status"
  5. App Android sẽ nhận được kết quả qua polling

### 2. **MOCK PAYMENT** (Giao diện đẹp cho demo)
✅ **Đã cấu hình và sửa lỗi**
- **Mục đích**: Hiển thị giao diện giống VNPay thật
- **URL**: `http://10.0.2.2:3000/order/mock-payment` (tự động chuyển từ app)
- **Tính năng**:
  - Hiển thị số tiền, mã đơn hàng
  - QR code mock (không thật)
  - Nút "Thanh toán thành công" / "Thanh toán thất bại"
  - Giao diện đẹp giống VNPay
  - **Đã sửa lỗi**: Sau khi nhấn nút, redirect đúng và app nhận kết quả chính xác

### 3. **VNPAY SANDBOX** (Test thật với VNPay)
⚠️ **Không ổn định**
- **Mục đích**: Test với VNPay sandbox
- **Thẻ test**: Xem file `VNPAY_SANDBOX_GUIDE.md`
- **Cách bật**: Sửa `vnpayConfig.js` đổi `vnp_Url` thành sandbox

### 4. **VNPAY PRODUCTION** (Chính thức)
🚫 **Không dùng cho test**
- **Mục đích**: Môi trường thật với tiền thật
- **Yêu cầu**: Domain thật, SSL, tài khoản VNPay được duyệt

## 🔧 Cấu Hình Hiện Tại

### Backend (vnpayConfig.js):
```javascript
vnp_Url: "http://10.0.2.2:3000/order/mock-payment", // Mock payment
vnp_ReturnUrl: "http://10.0.2.2:3000/order/vnpay/return",
vnp_IpnUrl: "http://10.0.2.2:3000/order/vnpay/ipn",
```

### Tại sao dùng 10.0.2.2?
- `localhost` → chỉ hoạt động trên máy tính
- `10.0.2.2` → emulator Android có thể truy cập backend trên máy host

## 🐛 Lỗi Đã Sửa

### VẤN ĐỀ 1: App báo "Thanh toán thất bại" khi nhấn "Thanh toán thành công"
**Giải pháp**: ✅ Đã sửa mock-payment.html và vnpay-result.html

### VẤN ĐỀ 2: Nội dung thanh toán không khớp với đơn hàng
**Vấn đề**: Đặt hàng 270,000 VNĐ nhưng mock-payment hiển thị 120,000 VNĐ
**Nguyên nhân**: Mock-payment không đọc đúng tham số VNPay (vnp_Amount, vnp_TxnRef, vnp_OrderInfo)
**Giải pháp**: ✅ Đã sửa mock-payment.html để đọc tham số VNPay chuẩn

### Cách mock-payment hoạt động:
1. **VNPay Helper** tạo URL: `http://10.0.2.2:3000/order/mock-payment?vnp_TxnRef=25&vnp_Amount=27000000&vnp_OrderInfo=Thanh%20toan%20don%20hang%2025`
2. **Mock-payment.html** đọc:
   - `vnp_TxnRef` → Order ID
   - `vnp_Amount` → Amount (chia 100 để hiển thị)
   - `vnp_OrderInfo` → Order description
3. **Hiển thị chính xác**: Số tiền và mã đơn hàng khớp với đơn hàng thật

### Test để verify:
```bash
# Test URL với dữ liệu thật
node test_vnpay_url.js

# Mở mock-payment với tham số VNPay
http://localhost:3000/order/mock-payment?vnp_TxnRef=25&vnp_Amount=27000000&vnp_OrderInfo=Thanh%20toan%20don%20hang%2025
```

## 📱 Flow Demo Android

### 1. **Tạo đơn hàng**
```
User click "Thanh toán" → App gửi request → Backend trả về vnpayUrl
```

### 2. **Mở WebView**
```
App mở WebView với vnpayUrl → Load mock-payment.html
```

### 3. **Tương tác thanh toán**
```
User click "Thanh toán thành công" → Chuyển về app → App bắt đầu polling
```

### 4. **Cập nhật trạng thái**
```
App polling mỗi 3s → Backend kiểm tra DB → Trả về trạng thái → App cập nhật UI
```

## 🎬 Hướng Dẫn Demo

### Chuẩn bị:
1. ✅ Backend chạy trên `localhost:3000`
2. ✅ Android emulator hoặc device
3. ✅ App Android đã cài đặt

### Các bước demo:
1. **Tạo đơn hàng**: Trong app, thêm sản phẩm vào giỏ hàng và checkout
2. **Mở thanh toán**: Click "Thanh toán VNPay" → WebView mở mock-payment
3. **Thanh toán**: Click "Thanh toán thành công" trong WebView
4. **Kết quả**: App tự động polling và hiển thị "Thanh toán thành công"

### Thay đổi kết quả:
- Dùng trang `http://10.0.2.2:3000/vnpay-test` để thay đổi trạng thái đơn hàng
- Hoặc click "Hủy thanh toán" trong mock-payment

## 🛠️ Troubleshooting

### Lỗi thường gặp:
1. **WebView không load**: Kiểm tra URL dùng `10.0.2.2` thay vì `localhost`
2. **Polling không hoạt động**: Kiểm tra backend có chạy không
3. **Trạng thái không cập nhật**: Kiểm tra database connection

### Debug:
```bash
# Kiểm tra server
curl http://localhost:3000/order/mock-payment

# Kiểm tra database
# Trong app: Check logcat để xem response polling

# Kiểm tra trạng thái đơn hàng
# Truy cập http://localhost:3000/vnpay-test
```

## 📊 Lợi Ích Từng Phương Pháp

| Phương pháp | Tốc độ | Độ ổn định | Giao diện | Phù hợp cho |
|-------------|--------|------------|-----------|-------------|
| Fake Payment | ⚡⚡⚡ | 🟢🟢🟢 | 🎨 | Demo nhanh, test logic |
| Mock Payment | ⚡⚡ | 🟢🟢🟢 | 🎨🎨🎨 | Demo đẹp, thuyết trình |
| VNPay Sandbox | ⚡ | 🟡🟡 | 🎨🎨🎨 | Test tích hợp thật |
| VNPay Production | ⚡ | 🟢🟢🟢 | 🎨🎨🎨 | Môi trường thật |

## 🎓 Kết Luận

Dự án này đã tối ưu cho **demo và học tập** với:
- Flow thanh toán hoàn chỉnh
- Giao diện mock đẹp giống VNPay thật
- Dễ dàng thay đổi kết quả test
- Không phụ thuộc vào sandbox VNPay

Phù hợp cho: **Báo cáo đồ án, demo sản phẩm, học tập Android development**
- Mở URL VNPay trong browser
- Sử dụng thông tin test card từ VNPay sandbox
- Kiểm tra callback return/ipn có được gọi không

## Thông tin VNPay Sandbox Test:
- **Tài khoản**: 9704198526191432198
- **Tên**: NGUYEN VAN A
- **Ngày phát hành**: 07/15
- **Mật khẩu**: 123456
- **OTP**: 123456 (hoặc bất kỳ số 6 chữ số nào)

## Troubleshooting:
- Nếu VNPay sandbox không hoạt động → Dùng fake payment
- Nếu callback không nhận được → Kiểm tra ngrok/public URL
- Nếu app crash → Kiểm tra WebView permissions

## Kết luận:
Backend đã hoàn thiện và sẵn sàng. Fake payment hoạt động tốt cho mục đích học tập.
