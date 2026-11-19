# Kho Skill

[English](README.md) · **Tiếng Việt**

Trang web: **https://kho-skills.vercel.app**

Danh mục **AI Skills (SKILL.md)** cho Claude và các AI agent, mô tả bằng tiếng Việt, kèm cách cài và giấy phép đã kiểm tra.

- 67 mục: 19 skill chính thức của Anthropic, 46 mục cộng đồng, 2 skill Kho Skill tự viết (session-handoff, khoi-dong-du-an)
- Tìm kiếm không dấu, lọc theo nhóm và nguồn
- Mỗi skill có trang riêng (tốt cho SEO): khi nào dùng, lệnh cài (nút sao chép), giấy phép, link GitHub
- Trang hướng dẫn "Skill là gì?"
- Xuất ra trang tĩnh, có chế độ tối, chạy tốt trên điện thoại

## Chạy trên máy

```bash
npm install
npm run dev      # http://localhost:3000 (chỉ máy này truy cập được, có tab "Duyệt")
npm run dev:lan  # mở cho điện thoại cùng mạng Wi-Fi để thử giao diện (tab "Duyệt" bị tắt)
npm run build    # xuất trang tĩnh vào thư mục out/ (không có tab "Duyệt")
```

Token GitHub (cho `npm run stars` và nút lấy skill mới) đặt trong file `.env` ở thư mục gốc, một dòng `GITHUB_TOKEN=...` không có khoảng trắng. File này đã nằm trong `.gitignore`.

## Số sao tự cập nhật hằng tuần

GitHub Action `.github/workflows/update-stars.yml` chạy 8 giờ sáng thứ Hai (giờ Việt Nam): lấy số sao mới, có thay đổi thì commit `src/data/stars.json` lên `main`, Vercel tự deploy lại. Không cần cài token: Action dùng token tạm GitHub tự cấp. Muốn chạy ngay: tab **Actions** trên GitHub → **Cập nhật số sao** → **Run workflow**.

Vì máy chủ GitHub cũng commit vào `main`, nhớ `git pull` trước khi làm tiếp trên máy.

## Deploy miễn phí lên Vercel

1. Đẩy thư mục này lên một repo GitHub.
2. Vào vercel.com, chọn **Add New → Project**, chọn repo, bấm **Deploy** (Vercel tự nhận Next.js).

## Chọn skill cho dự án (trang /goi-y/)

Trang `/goi-y/`: người dùng mô tả dự án (ví dụ "trang admin quản lý bán hàng bằng React, có đăng nhập, biểu đồ, xuất Excel"), trang nhận ra các nhu cầu và gợi ý skill nên cài kèm lý do, nút chép lệnh cài gộp, và câu lệnh nhờ AI chọn kỹ hơn bằng `skills.json`. Chạy hoàn toàn trên trình duyệt, không cần máy chủ hay API.

- Bảng nhu cầu → skill nằm trong `src/data/needs.ts`: từ khóa viết không dấu, `weak` là từ khóa yếu (chỉ tính nửa điểm), mỗi skill kèm lý do. Slug sai làm build báo lỗi.
- Có thể dẫn link từ dự án khác sang, kết quả mở sẵn: `/goi-y/?mo-ta=<mô tả>`; thêm `&them=admin,excel` để chọn sẵn nhu cầu, `&bo=security` để bỏ nhu cầu (dùng `id` trong `needs.ts`).

## Nút "Gửi skill" (trang /de-xuat/)

Trang `/de-xuat/` cho người dùng gửi link repo skill họ biết. Trang báo ngay nếu repo đã có trong Kho Skill; nếu chưa, bấm gửi sẽ mở trang tạo **GitHub Issue** đã điền sẵn trên repo của Kho Skill.

Điền repo GitHub của Kho Skill vào `SITE_REPO` trong `src/data/site.ts` (ví dụ `'ten-ban/kho-skill'`). Khi còn để trống, trang và các nút dẫn tới nó chỉ hiện lúc `npm run dev`; bản deploy ẩn hẳn.

## Thêm hoặc sửa skill

Toàn bộ dữ liệu nằm trong `src/data/skills.ts`. Thêm một mục mới vào mảng `SKILLS`:

- `slug`: đường dẫn trang, chỉ dùng chữ thường, số và dấu gạch ngang
- `title`, `summary`, `useWhen`: mô tả tiếng Việt, **tự viết**, không chép nguyên văn từ repo gốc
- `license`: đọc file LICENSE của repo; không có file thì để `'none'` (trang sẽ hiện cảnh báo ⚠)
- `install`: lấy đúng lệnh trong README của tác giả

Nhớ cập nhật `CHECKED_AT` khi kiểm tra lại dữ liệu.

## Thêm skill mới

Việc tìm và duyệt skill mới làm trong tab **Duyệt** của chính trang Kho Skill khi chạy trên máy. Tab này **chỉ có khi `npm run dev`**: bản build để deploy không chứa tab, API hay đoạn mã nào của nó. Không có gì được tự thêm vào trang.

1. Chạy `npm run dev`, mở http://localhost:3000, bấm tab **Duyệt**.
2. Bấm **🔍 Lấy skill mới**: tìm repo trên GitHub (chạy `scripts/discover-skills.mjs`), có nhật ký tiến trình, xong thì danh sách tự tải lại.
   - Tìm bằng các truy vấn trong `QUERIES` đầu file script: nhóm chung (topic `claude-skills`, `agent-skills`…) và nhóm nhắm vào chủ đề còn ít skill (văn phòng, dữ liệu, bảo mật, trí nhớ). Muốn tìm thêm chủ đề nào thì thêm một dòng truy vấn vào đó.
   - Chỉ giữ repo có ≥ 100 sao, có license, cập nhật trong 12 tháng, có file `SKILL.md` và chưa có trong Kho Skill.
   - Nhãn **Phần mềm kèm skill** là gợi ý tự động: repo sản phẩm có kèm SKILL.md, không phải bộ skill dùng chung, nên xem kỹ.
   - Không có token thì GitHub chỉ cho 60 lượt gọi/giờ; hết lượt giữa chừng thì bấm lại sau, phần đã quét được giữ trong `data/discover-cache.json`.
3. Bấm **Chọn** ở repo muốn thêm (mở "Xem skill" để đọc mô tả gốc). Lựa chọn lưu ngay vào `data/candidates.md` (dòng đổi `[ ]` thành `[x]`) và được giữ lại khi lấy danh sách mới.
4. Bấm **Sao chép lệnh cho Claude Code** rồi dán vào Claude Code:

   > Thêm các skill được đánh dấu [x] trong data/candidates.md vào src/data/skills.ts

5. Kiểm tra trên http://localhost:3000, rồi deploy như bình thường.

Chạy bằng dòng lệnh vẫn được: `npm run discover` tạo `data/candidates.md`, sửa tay `[ ]` thành `[x]` ở dòng muốn thêm.

### Quy tắc khi thêm skill từ danh sách đã duyệt

Claude Code tự đọc các quy tắc này trong `CLAUDE.md`. Nếu thêm tay, làm theo đúng các bước:

1. Đọc `SKILL.md` gốc và README của repo. **Tự viết** `title`, `summary`, `useWhen` bằng tiếng Việt, không dịch nguyên văn.
2. `install`: lấy đúng lệnh cài trong README. Nếu README không có lệnh cài rõ ràng thì dùng cách cài thủ công:

   ```bash
   git clone https://github.com/<owner>/<repo>.git
   cp -r <repo>/<đường-dẫn-thư-mục-skill> ~/.claude/skills/
   ```

3. `category`: chọn một nhóm có sẵn trong `CATEGORIES`. Không hợp nhóm nào thì **hỏi lại**, không tự tạo nhóm mới.
4. `license`: lấy từ cột License. Nếu chưa có trong kiểu `License` và `LICENSE_INFO` thì thêm vào, kèm ghi chú tiếng Việt đúng nghĩa của giấy phép đó (ví dụ GPL/AGPL bắt buộc mở mã nguồn phần sửa đổi).
5. Repo nhiều skill: đặt `path` tới thư mục skill chính, hoặc dùng `includes` và `skillCount` nếu thêm cả bộ.
6. Cập nhật `CHECKED_AT`, rồi chạy `npm run stars` và `npm run build`; build phải không lỗi.

## Nguyên tắc

- Chỉ dẫn link tới mã nguồn gốc, không lưu mã nguồn của người khác.
- Không tự nhận liên kết với Anthropic hay tác giả các skill.
