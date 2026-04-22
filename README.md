# Google Drive Folder Copier

## 1. Hướng dẫn cài đặt
- Truy cập script.google.com và tạo dự án mới.
- Dán mã nguồn xử lý vào tệp Code.gs.
- Tạo tệp index.html để chứa mã giao diện người dùng và logic điều phối máy khách.
- Chọn Deploy > New deployment > Web App.
- Phê duyệt quyền truy cập dữ liệu Google Drive khi được yêu cầu.

## 2. Giới hạn hệ thống
- Thời gian thực thi (Execution Timeout): Tối đa 6 phút (360 giây) cho mỗi lần thực thi hàm.
- Hạn mức sao chép dữ liệu: 750 GB/ngày/tài khoản.
- Kích thước tệp tin đơn lẻ tối đa: 5 TB.
- Tổng thời gian chạy trong ngày: 90 phút (tài khoản cá nhân) hoặc 6 giờ (tài khoản Workspace).

## 3. Đặc điểm kỹ thuật về Timeout
Hệ thống Google Apps Script sẽ tự động ngắt kết nối và dừng mọi tác vụ ngay lập tức khi thời gian chạy đạt ngưỡng 6 phút. Trong trường hợp quá trình chuyển thư mục kéo dài 10 phút, tập lệnh sẽ bị đóng tại phút thứ 6 và báo lỗi "Exceeded maximum execution time". Các tệp tin còn lại trong danh sách chưa kịp xử lý sẽ không được sao chép và không được bảo lưu trạng thái. Để hoàn thành việc chuyển dữ liệu lớn, danh sách tệp phải được chia nhỏ thành các lô (batch) để thực thi trong nhiều lần gọi hàm độc lập.
## Liên hệ

| Kênh | Link |
|------|------|
| GitHub | [nguyenngocphung2000](https://github.com/nguyenngocphung2000) |
| Telegram | [@nothing3272](https://t.me/nothing3272) |
| Facebook | [Nguyễn Ngọc Phụng](https://www.facebook.com/share/1Ayyxg5kjH/) |
| Email Form | [Google Form](https://forms.gle/5brLdS34QMQ3ei157) |
---
