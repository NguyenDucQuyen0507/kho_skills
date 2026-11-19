# Kho Skill

Danh mục AI Skills tiếng Việt (Next.js, xuất trang tĩnh). Dữ liệu skill nằm trong `src/data/skills.ts`.

## Thêm skill từ danh sách đã duyệt

Khi được nhờ "thêm các skill được đánh dấu [x] trong data/candidates.md", chỉ thêm những dòng có `[x]` trong bảng của `data/candidates.md`. Với mỗi repo:

1. Đọc `SKILL.md` gốc và README của repo trên GitHub. Tự viết `title`, `summary`, `useWhen` bằng tiếng Việt, ngắn gọn, đúng ý. Không dịch nguyên văn, không chép mô tả gốc.
2. `install`: lấy đúng lệnh cài trong README của tác giả. Nếu README không có lệnh cài rõ ràng thì dùng cách cài thủ công: `git clone https://github.com/<owner>/<repo>.git` rồi `cp -r <repo>/<thư mục skill> ~/.claude/skills/`.
3. `category`: chọn trong `CATEGORIES` có sẵn. Nếu không hợp nhóm nào thì hỏi người dùng; không tự tạo nhóm mới.
4. `license`: theo cột License trong candidates.md (spdx_id của GitHub). Nếu giấy phép chưa có trong kiểu `License` và `LICENSE_INFO` thì thêm vào, kèm ghi chú tiếng Việt đúng nghĩa giấy phép đó.
5. Repo chứa nhiều skill: dùng `path` trỏ tới thư mục skill chính, hoặc `includes` + `skillCount` khi thêm cả bộ.
6. `slug` chỉ gồm chữ thường, số, dấu gạch ngang, không trùng slug đã có. `tags` viết không dấu để tìm kiếm.
7. Gắn skill mới vào nhu cầu phù hợp trong `src/data/needs.ts` (trang "Chọn skill cho dự án" `/goi-y/` chỉ đề xuất skill có trong đó), kèm lý do ngắn bằng tiếng Việt; thiếu nhu cầu hợp thì thêm nhu cầu mới với từ khóa không dấu.
8. Cập nhật `CHECKED_AT` thành ngày hôm nay, chạy `npm run stars` rồi `npm run build`; build phải không lỗi.
9. Báo lại: các skill đã thêm, category đã chọn, và repo nào bỏ qua kèm lý do (ví dụ không có lệnh cài, license không rõ, repo là phần mềm chứ không phải bộ skill).

## Tab "Duyệt" (công cụ quản trị, chỉ khi chạy trên máy)

- Các file `*.dev.tsx` / `*.dev.ts` (trang `/duyet` và API `/api/duyet`) chỉ được Next.js nạp khi `npm run dev` (xem `pageExtensions` trong `next.config.ts`); `npm run build` bỏ qua chúng. Không đổi tên chúng thành `.tsx`/`.ts` thường.
- `npm run dev` chỉ nghe ở 127.0.0.1; `npm run dev:lan` mở cho mạng LAN và tắt tab Duyệt (`KHO_SKILL_REVIEW=off`). Không đưa API ghi file vào bản build tĩnh.

## Quy tắc chung

- Không đổi nội dung mô tả skill đã có trong `src/data/skills.ts` nếu không được yêu cầu.
- Giao diện chỉ dùng biến màu có sẵn trong `src/app/globals.css`, không thêm mã màu mới.
- Chỉ dẫn link tới mã nguồn gốc, không lưu mã nguồn skill của người khác trong repo.
- Trang mới: khai báo metadata bằng `pageMeta()` trong `src/lib/seo.tsx` (có canonical và ảnh xem trước) và thêm đường dẫn vào `src/app/sitemap.ts`.
