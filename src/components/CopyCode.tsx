'use client';

import { useState } from 'react';

export default function CopyCode({ code, wrap = false }: { code: string; wrap?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (http, iframe); the code is still selectable by hand.
    }
  };

  return (
    <div className={wrap ? 'code wrap' : 'code'}>
      {code}
      <button className="copy" onClick={copy} aria-label="Sao chép lệnh">
        {copied ? 'Đã chép ✓' : 'Sao chép'}
      </button>
    </div>
  );
}
