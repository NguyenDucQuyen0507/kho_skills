---
name: session-handoff
description: Lưu và khôi phục tiến độ dự án giữa các phiên làm việc. Dùng khi phiên sắp đầy ngữ cảnh, khi người dùng nói lưu tiến độ / bàn giao / kết thúc phiên, hoặc khi bắt đầu phiên mới trong dự án có file HANDOFF.md.
---

# Session handoff

Mục tiêu: phiên sau tiếp tục đúng chỗ phiên trước dừng, mà không phải đọc lại cả cuộc trò chuyện hay dò lại toàn bộ code. Tiết kiệm token bằng cách ghi lại những gì quan trọng một lần, ngắn gọn.

## Khi bắt đầu phiên

1. Nếu thư mục gốc dự án có `HANDOFF.md`, đọc nó TRƯỚC mọi việc khác.
2. Tóm tắt cho người dùng trong 3–5 dòng: đang làm gì, xong đến đâu, bước tiếp theo.
3. Chỉ mở những file được nêu trong mục "Đang dở" và "Bước tiếp theo". Không quét lại toàn bộ dự án.
4. Nếu HANDOFF.md có vẻ cũ hơn code (ví dụ file nó nhắc tới đã đổi tên), báo người dùng thay vì đoán.

## Khi lưu tiến độ

Làm khi: người dùng nói "lưu tiến độ", "handoff", "kết thúc phiên", "sắp hết session"; hoặc khi phiên đã rất dài và sắp bị nén ngữ cảnh; hoặc sau khi xong một phần việc lớn.

Ghi (ghi đè, không nối thêm vô hạn) file `HANDOFF.md` ở thư mục gốc dự án theo đúng mẫu dưới. Tổng độ dài dưới 80 dòng.

```markdown
# Handoff: <tên dự án>
Cập nhật: <YYYY-MM-DD HH:mm>

## Mục tiêu
<1–2 câu: đang xây gì, cho ai>

## Đã xong
- <việc> (<file chính>)

## Quyết định quan trọng
- <quyết định>: <lý do ngắn>. Không đổi lại nếu không có lý do mới.

## Đang dở
- <việc dở> tại `<đường dẫn file>` (<hàm/khu vực>): <còn thiếu gì>

## Bước tiếp theo (theo thứ tự)
1. <bước cụ thể, làm được ngay>

## Lệnh hay dùng
- Chạy: `<lệnh>`
- Test: `<lệnh>`

## Bẫy đã gặp
- <lỗi đã gặp và cách xử lý, để không lặp lại>
```

Quy tắc khi viết:
- Chỉ ghi điều KHÔNG suy ra được từ code: quyết định, lý do, việc dở, bẫy. Không chép code vào file.
- Dùng đường dẫn file cụ thể thay vì mô tả chung chung.
- Xóa mục đã lỗi thời thay vì để lại.
- Không ghi mật khẩu, token, khóa API.
- Nếu dự án có `CLAUDE.md`, thêm một dòng vào đó (nếu chưa có): `Đọc HANDOFF.md khi bắt đầu phiên để biết tiến độ.`

Sau khi ghi, báo người dùng một dòng: đã lưu ở đâu và bước tiếp theo là gì. Gợi ý họ có thể mở phiên mới (hoặc dùng /clear) để bắt đầu lại với ngữ cảnh gọn.
