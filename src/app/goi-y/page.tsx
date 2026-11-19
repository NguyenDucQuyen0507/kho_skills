import { pageMeta } from '@/lib/seo';
import ProjectAdvisor from '@/components/ProjectAdvisor';

export const metadata = pageMeta({
  title: 'Chọn skill cho dự án',
  description: 'Mô tả dự án bạn đang làm, Kho Skill gợi ý những AI skill nên cài kèm lý do và lệnh cài, không phải tự tìm từng skill.',
  path: '/goi-y/',
});

export default function SuggestForProjectPage() {
  return (
    <div className="container advisor-page">
      <span className="eyebrow">Gợi ý theo dự án</span>
      <h1>Dự án của bạn nên dùng skill nào?</h1>
      <p className="lead">
        Mô tả ngắn dự án bạn đang làm. Kho Skill nhận ra các nhu cầu trong đó (giao diện, đăng nhập, xuất Excel, app di động…) và
        gợi ý skill phù hợp kèm lý do, để bạn không phải tìm từng skill.
      </p>
      <ProjectAdvisor />
    </div>
  );
}
