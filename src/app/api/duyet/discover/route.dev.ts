/** API nút "Lấy skill mới từ GitHub": chạy scripts/discover-skills.mjs và báo tiến trình. Chỉ có khi `npm run dev`. */
import { discoverStatus, startDiscover } from '@/lib/candidates.server';
import { json, rejectIfDisabled, rejectUnsafeWrite } from '../guard';

export const dynamic = 'force-dynamic';

export function GET() {
  return rejectIfDisabled() ?? json(discoverStatus());
}

export function POST(req: Request) {
  return rejectUnsafeWrite(req) ?? json(startDiscover());
}
