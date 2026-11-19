'use client';

import { useEffect, useState } from 'react';
import CopyCode from './CopyCode';

/**
 * Câu lệnh mẫu cho Claude, điền sẵn địa chỉ trang hiện tại.
 * Trang là trang tĩnh deploy ở đâu cũng được, nên lấy địa chỉ từ trình duyệt sau khi tải trang.
 */
export default function AiPrompt() {
  const [origin, setOrigin] = useState('https://<địa chỉ trang>');
  useEffect(() => setOrigin(window.location.origin), []);
  return (
    <CopyCode
      wrap
      code={`Đọc danh sách skill tại ${origin}/skills.json, xem dự án hiện tại và đề xuất những skill nên cài, kèm lý do.`}
    />
  );
}
