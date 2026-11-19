import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SuggestForm from '@/components/SuggestForm';
import { SUGGEST_ENABLED } from '@/data/site';

export const metadata: Metadata = {
  title: 'Gửi skill',
  description: 'Gửi skill hay mà Kho Skill chưa có. Mỗi đề xuất được kiểm tra trước khi thêm vào danh mục.',
};

export default function SuggestPage() {
  if (!SUGGEST_ENABLED) notFound();
  return (
    <div className="container">
      <article className="prose">
        <span className="eyebrow">Góp ý</span>
        <h1 style={{ marginTop: 16 }}>Gửi skill cho Kho Skill</h1>
        <p className="lead">
          Biết một skill hay mà Kho Skill chưa có? Gửi link repo, Kho Skill sẽ đọc, kiểm tra rồi viết mô tả tiếng Việt trước khi thêm vào
          danh mục.
        </p>

        <h2>Skill được ưu tiên thêm khi</h2>
        <ul>
          <li>
            Repo có file <code>SKILL.md</code> (skill dùng được cho Claude hoặc agent khác), không phải phần mềm chỉ kèm theo skill.
          </li>
          <li>Có giấy phép rõ ràng (MIT, Apache-2.0…), để người dùng biết được phép dùng tới đâu.</li>
          <li>Còn được tác giả cập nhật trong khoảng một năm gần đây.</li>
          <li>Giải quyết một việc cụ thể, nói được ngắn gọn &quot;dùng khi nào&quot;.</li>
        </ul>

        <h2>Gửi đề xuất</h2>
        <SuggestForm />
      </article>
    </div>
  );
}
