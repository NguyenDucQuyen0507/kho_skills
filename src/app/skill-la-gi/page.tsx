import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import AiPrompt from '@/components/AiPrompt';
import CopyCode from '@/components/CopyCode';

export const metadata: Metadata = {
  title: 'Skill là gì? Hướng dẫn cài và tự viết skill',
  description: 'Giải thích AI Skill (SKILL.md) bằng tiếng Việt: cách hoạt động, cách cài vào Claude Code và Claude.ai, cách tự viết skill.',
};

const EXAMPLE = `---
name: bao-cao-tuan
description: Viết báo cáo tuần theo mẫu của công ty. Dùng khi người dùng nhờ viết báo cáo tuần, tổng kết công việc, hoặc báo cáo tiến độ.
---

# Báo cáo tuần

1. Hỏi người dùng 3 việc chính đã làm trong tuần, nếu họ chưa nói.
2. Viết theo đúng thứ tự: Kết quả, Khó khăn, Kế hoạch tuần sau.
3. Mỗi mục tối đa 5 gạch đầu dòng, câu ngắn, có số liệu nếu có.`;

const CLAUDE_CODE = `# Skill cá nhân (dùng cho mọi dự án)
mkdir -p ~/.claude/skills/bao-cao-tuan
# đặt file SKILL.md vào thư mục trên

# Skill riêng cho một dự án (chia sẻ cùng team qua git)
mkdir -p .claude/skills/bao-cao-tuan`;

/** Hai mẫu quy tắc làm việc, đọc lúc build từ public/raw/quy-trinh (cũng là file tải về). */
const RULES = [
  {
    file: '/raw/quy-trinh/co-kinh-nghiem.md',
    title: 'Bản rút gọn cho người đã có kinh nghiệm',
    note: 'Khoảng 1/3 độ dài bản đầy đủ: giữ nguyên tắc cốt lõi, phân loại việc nhỏ/vừa/lớn để việc nhỏ không phải đi đủ quy trình, thêm mẹo tiết kiệm token.',
  },
  {
    file: '/raw/quy-trinh/nguoi-moi.md',
    title: 'Bản đầy đủ cho người mới',
    note: 'Quy trình 10 giai đoạn từ phân tích yêu cầu tới bảo trì, giữ nguyên nội dung gốc được chia sẻ trong cộng đồng. AI giải thích dễ hiểu và xin xác nhận ở từng bước.',
  },
].map((r) => ({ ...r, content: readFileSync(path.join(process.cwd(), 'public', r.file), 'utf8') }));

export default function Guide() {
  return (
    <div className="container">
      <article className="prose">
        <span className="eyebrow">Hướng dẫn</span>
        <h1 style={{ marginTop: 16 }}>Skill là gì?</h1>
        <p className="lead">
          Skill là một thư mục chứa “sổ tay hướng dẫn” cho AI. Thay vì lần nào cũng phải dặn lại AI cách làm một việc,
          bạn viết cách làm một lần vào skill, và AI tự mở ra dùng khi gặp đúng việc đó.
        </p>

        <h2>Cấu tạo một skill</h2>
        <p>
          Trung tâm của skill là file <code>SKILL.md</code>. Phần đầu file có hai dòng quan trọng nhất:
        </p>
        <ul>
          <li>
            <code>name</code>: tên skill.
          </li>
          <li>
            <code>description</code>: mô tả <strong>khi nào</strong> nên dùng skill. AI chỉ đọc dòng này lúc đầu, và chỉ
            mở toàn bộ hướng dẫn khi thấy việc đang làm khớp với mô tả. Nhờ vậy cài nhiều skill cũng không làm AI chậm
            hay rối.
          </li>
        </ul>
        <p>
          Phần còn lại là hướng dẫn chi tiết. Skill có thể kèm thêm script, tài liệu tham khảo hoặc file mẫu trong cùng
          thư mục.
        </p>

        <h2>Ví dụ một skill đơn giản</h2>
        <CopyCode code={EXAMPLE} />

        <h2 id="cach-cai">Cách cài skill</h2>
        <p>
          <strong>Claude Code:</strong> nhiều skill trong kho được đóng gói thành plugin, cài bằng lệnh{' '}
          <code>/plugin</code> như ghi trên từng trang skill. Với skill dạng thư mục, chỉ cần đặt thư mục chứa{' '}
          <code>SKILL.md</code> vào đúng chỗ:
        </p>
        <CopyCode code={CLAUDE_CODE} />
        <p>
          <strong>Claude.ai:</strong> nén thư mục skill thành file .zip rồi tải lên trong phần Skills. Xem hướng dẫn
          chính thức:{' '}
          <a href="https://support.claude.com/en/articles/12512180-using-skills-in-claude" target="_blank" rel="noopener noreferrer">
            Using skills in Claude
          </a>
          .
        </p>
        <p>
          <strong>AI agent khác:</strong> Skill là một chuẩn mở, nhiều công cụ khác cũng đọc được thư mục{' '}
          <code>SKILL.md</code>. Xem đặc tả tại{' '}
          <a href="https://agentskills.io" target="_blank" rel="noopener noreferrer">
            agentskills.io
          </a>
          .
        </p>

        <div className="callout">
          <strong>⚠ An toàn trước khi cài:</strong> skill có thể chứa script chạy trên máy bạn. Chỉ cài skill từ nguồn bạn
          tin tưởng, đọc qua <code>SKILL.md</code> và các script đi kèm, và kiểm tra giấy phép trước khi dùng cho dự án
          thương mại. Kho Skill đánh dấu ⚠ những repo chưa có giấy phép rõ ràng.
        </div>

        <h2 id="claude-chon-skill">Để Claude chọn skill cho dự án</h2>
        <p>
          Kho Skill có file <a href="/skills.json">skills.json</a> chứa toàn bộ danh mục (mô tả, khi nào dùng, lệnh cài,
          giấy phép) và các <Link href="/">bộ skill theo dự án</Link>, viết cho AI đọc. Mở Claude Code trong
          thư mục dự án và dán câu lệnh sau:
        </p>
        <AiPrompt />
        <p>
          Claude sẽ xem code của bạn rồi gợi ý skill phù hợp. Trước khi cài, vẫn nên đọc trang từng skill để kiểm tra giấy
          phép và nguồn.
        </p>

        <h2>Tự viết skill của bạn</h2>
        <ol>
          <li>Chọn một việc bạn hay phải dặn AI đi dặn lại: định dạng báo cáo, quy tắc code của team, cách trả lời khách…</li>
          <li>
            Viết <code>description</code> thật cụ thể về <em>khi nào</em> dùng. Đây là phần quyết định AI có dùng skill đúng
            lúc không.
          </li>
          <li>Viết hướng dẫn ngắn gọn, đánh số từng bước, có ví dụ đầu ra mong muốn.</li>
          <li>Thử với vài yêu cầu thật, rồi sửa mô tả nếu AI không kích hoạt skill.</li>
        </ol>
        <p>
          Muốn làm nhanh hơn, dùng skill <Link href="/skills/skill-creator/">skill-creator</Link> của Anthropic để AI
          giúp bạn viết và chấm điểm skill.
        </p>

        <h2 id="mau-quy-tac">Mẫu quy tắc làm việc cho AI (CLAUDE.md)</h2>
        <p>
          Skill chỉ được AI mở ra khi gặp đúng việc. Còn những nguyên tắc bạn muốn AI <em>luôn</em> làm theo (hỏi rõ trước khi code,
          xin phép trước khi xóa dữ liệu, không nói &quot;xong&quot; khi chưa kiểm tra…) thì đặt trong <strong>quy tắc làm việc</strong>:
        </p>
        <ul>
          <li>
            Claude Code: file <code>CLAUDE.md</code> ở thư mục dự án (áp dụng cho dự án đó) hoặc <code>~/.claude/CLAUDE.md</code> (áp
            dụng cho mọi dự án).
          </li>
          <li>Claude.ai: phần Project Instructions của một Project.</li>
        </ul>
        <p>
          Quy tắc được đọc ở mọi câu trả lời nên càng ngắn càng tiết kiệm token. Phần dài chỉ cần khi bắt đầu dự án mới đã được tách
          thành skill <Link href="/skills/khoi-dong-du-an/">khoi-dong-du-an</Link>.
        </p>
        {RULES.map((r) => (
          <div className="rule-template" key={r.file}>
            <h3>{r.title}</h3>
            <p>{r.note}</p>
            <details>
              <summary>Xem và sao chép nội dung</summary>
              <CopyCode wrap code={r.content} />
            </details>
            <p className="rule-actions">
              <a className="btn ghost" href={r.file} download>
                Tải file .md
              </a>
            </p>
          </div>
        ))}

        <p style={{ marginTop: 40 }}>
          <Link className="btn" href="/">
            ← Xem danh mục skill
          </Link>
        </p>
      </article>
    </div>
  );
}
