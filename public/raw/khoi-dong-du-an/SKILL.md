---
name: khoi-dong-du-an
description: Khởi động dự án phần mềm mới đúng quy trình trước khi viết code - hỏi rõ yêu cầu, chốt phạm vi MVP và tiêu chí nghiệm thu, chọn kiến trúc đơn giản, thiết kế dữ liệu và màn hình, lập lộ trình, làm từng phần kèm kiểm thử; có checklist kiểm thử, bảo mật và triển khai lần đầu. Dùng khi người dùng nói muốn xây dựng hoặc làm một website, web app, app di động, phần mềm mới; khi cần viết PRD, kế hoạch hay tài liệu yêu cầu cho dự án; khi cần kiểm thử toàn hệ thống trước khi giao; hoặc khi chuẩn bị deploy lần đầu.
---

# Khởi động dự án

Mục tiêu: hiểu đúng trước khi làm. Không viết code khi yêu cầu cốt lõi chưa rõ và kế hoạch chưa được người dùng xác nhận.

- Dự án đã có code hoặc tài liệu: đọc hiện trạng trước, chỉ bổ sung phần còn thiếu, không làm lại từ đầu.
- Phần không liên quan thì bỏ qua và nói lý do trong một dòng (ví dụ trang tĩnh thì không cần thiết kế database).
- Người dùng không chuyên: giải thích bằng tiếng Việt dễ hiểu, hạn chế thuật ngữ; khi buộc phải dùng thì giải thích ngắn.

## Bước 1. Hỏi rõ yêu cầu

Gom câu hỏi thành MỘT lượt, tối đa khoảng 8 câu, bỏ những câu người dùng đã trả lời:

1. Phần mềm giải quyết vấn đề gì, cho ai dùng?
2. Website, web app hay app di động?
3. Những tính năng bắt buộc phải có ở bản đầu tiên? Những gì để sau được?
4. Có cần đăng nhập, phân quyền (ai được xem, ai được sửa)?
5. Có lưu dữ liệu không? Có dữ liệu cá nhân, thanh toán không?
6. Dự kiến bao nhiêu người dùng lúc đầu?
7. Ngân sách hằng tháng và thời hạn mong muốn?
8. Đã có thiết kế, mẫu tham khảo, hoặc hệ thống cũ cần kết nối chưa?

Sau khi có câu trả lời, ghi `docs/YEU-CAU.md`:

```markdown
# Yêu cầu: <tên dự án>

## Vấn đề và người dùng
<2–3 câu>

## Loại sản phẩm
<website / web app / app di động>

## MVP (bắt buộc ở bản đầu)
- <tính năng>

## Để sau
- <tính năng>

## Tiêu chí nghiệm thu
<Mỗi tiêu chí phải kiểm tra được. Ví dụ: "Nhập sai mật khẩu 5 lần thì khóa đăng nhập 15 phút".>
- [ ] <tiêu chí>

## Ràng buộc
Người dùng dự kiến · ngân sách · thời hạn · dữ liệu nhạy cảm (có/không)

## Còn chưa rõ
- <câu hỏi mở>
```

DỪNG: đưa bản tóm tắt cho người dùng xác nhận. Còn điều cốt lõi chưa rõ thì chưa sang bước 2.

## Bước 2. Chọn kiến trúc

Chọn mức đơn giản nhất đủ dùng:

| Nhu cầu | Gợi ý |
|---|---|
| Chỉ hiển thị nội dung, không có tài khoản | Trang tĩnh (deploy miễn phí) |
| Có đăng nhập, dữ liệu vừa phải | Frontend + dịch vụ có sẵn database và đăng nhập (ví dụ Supabase) |
| Nghiệp vụ phức tạp, tích hợp nhiều hệ thống | Frontend + backend riêng + PostgreSQL |

Xác định từng phần: giao diện, xử lý nghiệp vụ/API, database, nơi lưu file (ảnh, video, tài liệu lưu ở dịch vụ lưu trữ, database chỉ giữ đường dẫn), đăng nhập, dịch vụ ngoài (AI, email, thanh toán).

Ghi `docs/KIEN-TRUC.md`: sơ đồ đơn giản (Mermaid hoặc gạch đầu dòng), công nghệ chọn kèm lý do, chi phí ước tính mỗi tháng. Không chọn công nghệ phức tạp khi chưa cần.

## Bước 3. Thiết kế dữ liệu (chỉ khi có lưu dữ liệu)

- Bảng, trường, kiểu dữ liệu, quan hệ, khóa chính và khóa ngoại, ràng buộc (không rỗng, duy nhất).
- Quyền truy cập: ai đọc, ai ghi bảng nào; kiểm tra ở backend hoặc bằng chính sách của database, không chỉ ẩn ở giao diện.
- Cách thay đổi cấu trúc (migration) và cách sao lưu.

Ghi vào `docs/KIEN-TRUC.md` (mục Dữ liệu).

## Bước 4. Màn hình và luồng thao tác

- Danh sách trang và luồng chính của người dùng (ví dụ: đăng nhập → danh sách → thêm mới → lưu).
- Mỗi màn hình có đủ trạng thái: đang tải, lỗi, không có dữ liệu.
- Chạy tốt trên điện thoại và máy tính.
- Màu, font, các thành phần dùng chung (nút, ô nhập, bảng).

## Bước 5. Lộ trình và khung dự án

1. Chia MVP thành các phần nhỏ, xếp theo thứ tự làm; mỗi phần ghi cách kiểm tra là xong.
2. Khung dự án: Git, README, `.gitignore`, `.env.example` (không chứa khóa thật), lint và format, thư mục tách theo chức năng.
3. Commit ở mỗi mốc ổn định.

DỪNG: chờ người dùng xác nhận lộ trình rồi mới bắt đầu code phần đầu tiên.

## Bước 6. Làm từng phần (sau khi lộ trình được duyệt)

Với mỗi phần trong lộ trình:

1. Nêu file sẽ tạo hoặc sửa, và ảnh hưởng tới phần đang chạy.
2. Viết code kèm test cho logic chính.
3. Chạy test, tự dùng thử luồng vừa làm, sửa lỗi.
4. Đối chiếu tiêu chí nghiệm thu trong `docs/YEU-CAU.md`.
5. Báo cáo, commit khi ổn định.

Không tự ý đổi kiến trúc, xóa dữ liệu hay viết lại phần đang chạy tốt.

## Checklist kiểm thử (trước khi giao hoặc deploy)

Code chạy được chưa có nghĩa là phần mềm đã xong. Chọn mục hợp với quy mô dự án; mục nào bỏ qua thì ghi lý do.

- [ ] Unit test: logic tính toán, kiểm tra dữ liệu, xử lý nghiệp vụ.
- [ ] Integration test: API với database, gọi dịch vụ ngoài (dùng môi trường thử hoặc dữ liệu giả).
- [ ] End-to-end: chạy hết các luồng chính theo tiêu chí nghiệm thu bằng trình duyệt tự động (ví dụ Playwright).
- [ ] Phân quyền: đăng nhập từng vai trò; truy cập trái phép (gọi API trực tiếp, đổi id trên URL) phải bị chặn.
- [ ] Giao diện: điện thoại (khoảng 360px) và máy tính; không tràn ngang; có trạng thái đang tải, lỗi, không có dữ liệu.
- [ ] Xử lý lỗi: mất mạng, nhập sai, dịch vụ ngoài lỗi thì báo lỗi rõ ràng, không mất dữ liệu.
- [ ] Hiệu năng: thử với lượng dữ liệu gần thực tế, các trang chính phản hồi nhanh.
- [ ] Sao lưu và khôi phục: thử khôi phục một bản sao lưu vào môi trường thử.

Ghi kết quả vào báo cáo: đã chạy những gì, bao nhiêu đạt và lỗi, lỗi còn tồn tại, đã đủ điều kiện deploy chưa. Không thử thao tác phá hủy trên dữ liệu thật.

## Checklist bảo mật (trước khi có người dùng thật)

- [ ] Không có API key, mật khẩu trong code; `.env` không lên GitHub.
- [ ] Quyền được kiểm tra ở backend hoặc database, theo nguyên tắc quyền tối thiểu.
- [ ] Kiểm tra dữ liệu đầu vào; chống SQL injection, XSS, CSRF khi liên quan.
- [ ] Đăng nhập, phiên đăng nhập, đặt lại mật khẩu an toàn; giới hạn số lần thử.
- [ ] Log không chứa mật khẩu, token, dữ liệu cá nhân.
- [ ] Thư viện và dịch vụ ngoài đáng tin, đã cập nhật.
- [ ] Có dữ liệu cá nhân: rà quy định bảo vệ dữ liệu cá nhân hiện hành tại Việt Nam, có chính sách quyền riêng tư, biết dữ liệu được lưu ở đâu.

## Checklist triển khai lần đầu

- [ ] Hosting phù hợp, tên miền, HTTPS.
- [ ] Biến môi trường production đã cấu hình, khác với môi trường thử.
- [ ] Database production, migration chạy có kiểm soát, đã bật sao lưu và thử khôi phục.
- [ ] Có log và cảnh báo lỗi.
- [ ] Biết cách quay lại bản trước (rollback).
- [ ] Kiểm thử lại các luồng chính sau khi deploy.
- [ ] Chỉ deploy production khi người dùng cho phép.

## Mẫu báo cáo sau mỗi bước

```
GIAI ĐOẠN: <tên>
1. Mục tiêu:
2. Đã thực hiện:
3. Kết quả kiểm tra (đã xác minh gì, bằng cách nào):
4. Vấn đề còn tồn tại:
5. Điều kiện để sang bước sau:
6. Bước tiếp theo:
7. Trạng thái: CHƯA BẮT ĐẦU / ĐANG THỰC HIỆN / CHỜ XÁC NHẬN / ĐÃ HOÀN THÀNH
```

Không đánh dấu ĐÃ HOÀN THÀNH khi chưa đạt điều kiện sang bước sau.
