/** API tab "Duyệt": đọc danh sách ứng viên, chọn/bỏ chọn repo. Chỉ có khi `npm run dev`. */
import { hasCandidates, readCandidates, setSelected } from '@/lib/candidates.server';
import { json, rejectIfDisabled, rejectUnsafeWrite } from './guard';

export const dynamic = 'force-dynamic';

export function GET() {
  const denied = rejectIfDisabled();
  if (denied) return denied;
  if (!hasCandidates()) return json({ generatedAt: null, candidates: [], selected: [] });
  return json(readCandidates());
}

export async function POST(req: Request) {
  const denied = rejectUnsafeWrite(req);
  if (denied) return denied;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Dữ liệu không hợp lệ' }, 400);
  }
  const { repo, selected } = (body ?? {}) as { repo?: unknown; selected?: unknown };
  if (typeof repo !== 'string' || typeof selected !== 'boolean') return json({ error: 'Dữ liệu không hợp lệ' }, 400);
  if (!hasCandidates() || !setSelected(repo, selected)) {
    return json({ error: `Không thấy ${repo} trong danh sách. Thử bấm "Lấy skill mới" lại.` }, 404);
  }
  return json({ ok: true, selected: readCandidates().selected });
}
