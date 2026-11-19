/**
 * Nhu cầu dự án → skill nên dùng. Dùng cho trang "Gợi ý skill cho dự án" (/goi-y/).
 *
 * - `keywords`: viết thường, KHÔNG DẤU (so khớp sau khi bỏ dấu), có thể là cụm từ. Cụm dài được khớp trước
 *   cụm ngắn, nên "react native" không bị tính thành "react". Chữ "AI" viết hoa được hiểu là "tri tue nhan tao".
 * - `skills`: [slug, lý do ngắn vì sao skill hợp với nhu cầu này]. Thứ tự = độ ưu tiên. Slug sai làm build báo lỗi.
 */
import { SKILLS } from './skills';

export interface Need {
  id: string;
  label: string;
  emoji: string;
  keywords: string[];
  /** Từ khóa yếu (hay gặp, dễ nhầm): mỗi từ chỉ tính nửa điểm, cần thêm tín hiệu khác mới nhận nhu cầu. */
  weak?: string[];
  /** Hệ số điểm cho skill của nhu cầu này (mặc định 1). Dùng cho nhu cầu nên làm trước mọi việc khác. */
  boost?: number;
  skills: [slug: string, why: string][];
}

export const NEEDS: Need[] = [
  {
    id: 'new-project',
    label: 'Bắt đầu dự án mới',
    emoji: '🚀',
    keywords: ['du an moi', 'bat dau du an', 'khoi dong du an', 'tu con so 0', 'tu dau', 'len ke hoach', 'ke hoach du an', 'chua biet bat dau', 'vibe coding', 'mvp', 'prd', 'tai lieu yeu cau'],
    weak: ['xay dung', 'lam moi', 'y tuong'],
    boost: 2, // dự án mới thì khởi động đúng quy trình trước khi chọn skill giao diện, backend…
    skills: [
      ['khoi-dong-du-an', 'hỏi rõ yêu cầu, chốt MVP và kiến trúc trước khi code'],
      ['planning-with-files', 'giữ kế hoạch trong file để làm qua nhiều phiên'],
      ['superpowers', 'quy trình lên kế hoạch, TDD, review khi bắt tay vào code'],
    ],
  },
  {
    id: 'web-ui',
    label: 'Giao diện web',
    emoji: '🌐',
    keywords: ['web', 'website', 'web app', 'webapp', 'trang web', 'react', 'nextjs', 'next js', 'vue', 'nuxt', 'angular', 'svelte', 'frontend', 'front end', 'giao dien', 'ui', 'ux', 'tailwind', 'shadcn', 'spa'],
    skills: [
      ['frontend-design', 'dựng giao diện có chủ đích, tránh kiểu "rập khuôn AI"'],
      ['ui-ux-pro-max', 'chọn màu, font, design system hợp với loại sản phẩm'],
      ['impeccable', 'rà lại giao diện, sửa chỗ xấu và chỗ khó dùng'],
      ['webapp-testing', 'tự mở trình duyệt kiểm tra tính năng sau khi code'],
    ],
  },
  {
    id: 'admin',
    label: 'Trang quản trị / dashboard',
    emoji: '🛠️',
    keywords: ['admin', 'quan tri', 'trang quan tri', 'quan ly', 'he thong quan ly', 'dashboard', 'back office', 'backoffice', 'cms', 'crm', 'erp', 'noi bo', 'bang dieu khien'],
    skills: [
      ['ui-ux-pro-max', 'bảng, form, bộ lọc và design system thống nhất cho nhiều màn hình'],
      ['frontend-design', 'giao diện quản trị gọn, dễ đọc dữ liệu'],
      ['claude-d3js-skill', 'biểu đồ thống kê trên dashboard'],
      ['xlsx', 'xuất và nhập dữ liệu bằng file Excel'],
      ['webapp-testing', 'kiểm thử các luồng thêm, sửa, xóa trên trình duyệt'],
    ],
  },
  {
    id: 'landing',
    label: 'Website giới thiệu / landing page',
    emoji: '✨',
    keywords: ['landing', 'landing page', 'website gioi thieu', 'trang gioi thieu', 'portfolio', 'website cong ty', 'trang ban hang', 'blog'],
    skills: [
      ['taste-skill', 'website doanh nghiệp có gu, không đại trà'],
      ['ui-ux-pro-max', 'bố cục và phong cách hợp ngành nghề'],
      ['web-asset-generator', 'favicon, icon và ảnh chia sẻ mạng xã hội'],
      ['marketing-skills', 'nội dung, SEO và lời kêu gọi hành động'],
    ],
  },
  {
    id: 'backend',
    label: 'Backend / API / cơ sở dữ liệu',
    emoji: '🗄️',
    keywords: ['backend', 'back end', 'api', 'rest', 'graphql', 'server', 'may chu', 'nestjs', 'express', 'nodejs', 'node js', 'laravel', 'django', 'spring', 'database', 'co so du lieu', 'csdl', 'sql', 'mysql', 'postgres', 'postgresql', 'mongodb', 'microservice', 'full stack', 'fullstack'],
    skills: [
      ['fullstack-dev-skills', 'hướng dẫn theo từng framework backend, API, DevOps'],
      ['addyosmani-agent-skills', 'thiết kế API, viết spec trước khi code'],
      ['superpowers', 'quy trình TDD và debug có hệ thống'],
    ],
  },
  {
    id: 'mobile',
    label: 'App di động',
    emoji: '📱',
    keywords: ['mobile', 'app di dong', 'ung dung di dong', 'dien thoai', 'ios', 'iphone', 'android', 'react native', 'expo', 'flutter', 'swift'],
    skills: [
      ['expo-skills', 'làm app React Native với Expo theo hướng dẫn chính chủ'],
      ['ios-simulator-skill', 'chạy và kiểm thử app trên máy ảo iOS'],
      ['emilkowalski-skills', 'hiệu ứng chuyển động mượt cho app'],
    ],
  },
  {
    id: 'testing',
    label: 'Kiểm thử tự động',
    emoji: '🧪',
    keywords: ['test', 'testing', 'kiem thu', 'kiem tra tu dong', 'e2e', 'end to end', 'playwright', 'qa', 'unit test', 'tdd'],
    skills: [
      ['webapp-testing', 'viết và chạy kiểm thử trên trình duyệt thật'],
      ['playwright-skill', 'tự động hóa trình duyệt, thử nhiều kích thước màn hình'],
      ['superpowers', 'viết test trước rồi mới code (TDD)'],
      ['khoi-dong-du-an', 'checklist kiểm thử trước khi giao: phân quyền, giao diện, lỗi, sao lưu'],
    ],
  },
  {
    id: 'process',
    label: 'Quy trình code chuẩn',
    emoji: '🧭',
    keywords: ['code review', 'review code', 'refactor', 'clean code', 'debug', 'sua loi', 'kien truc', 'architecture', 'chat luong code', 'best practice'],
    weak: ['typescript', 'quy trinh'],
    skills: [
      ['superpowers', 'lên kế hoạch, TDD, debug, review theo từng bước'],
      ['mattpocock-skills', 'review code, debug và thiết kế kiến trúc TypeScript'],
      ['addyosmani-agent-skills', 'quy trình kỹ sư cấp cao từ spec tới CI/CD'],
    ],
  },
  {
    id: 'long-project',
    label: 'Dự án dài, làm nhiều phiên',
    emoji: '🧠',
    keywords: ['du an lon', 'du an dai', 'dai ngay', 'nhieu ngay', 'nhieu tuan', 'nhieu thang', 'vai thang', 'nhieu phien', 'lau dai', 'dai han', 'tien do', 'ban giao', 'het token', 'het context'],
    weak: ['nhom', 'team', 'nhieu nguoi'],
    skills: [
      ['session-handoff', 'ghi tiến độ để phiên sau làm tiếp, không phải kể lại'],
      ['planning-with-files', 'kế hoạch lưu ra file, không mất khi hết phiên'],
      ['claude-mem', 'trí nhớ dài hạn về dự án giữa các phiên'],
      ['mex', 'trí nhớ chung cho cả nhóm, lưu ngay trong repo'],
    ],
  },
  {
    id: 'security',
    label: 'Bảo mật, đăng nhập, phân quyền',
    emoji: '🛡️',
    keywords: ['bao mat', 'security', 'dang nhap', 'login', 'xac thuc', 'auth', 'authentication', 'phan quyen', 'thanh toan', 'payment', 'ma hoa', 'owasp', 'lo hong', 'du lieu ca nhan'],
    weak: ['role', 'an toan'],
    skills: [
      ['trailofbits-skills', 'rà lỗ hổng trong code bằng công cụ của Trail of Bits'],
      ['superpowers', 'review code kỹ trước khi đưa lên'],
    ],
  },
  {
    id: 'pentest',
    label: 'Kiểm thử xâm nhập',
    emoji: '🐞',
    keywords: ['pentest', 'kiem thu xam nhap', 'bug bounty', 'red team', 'ctf', 'tim lo hong'],
    skills: [
      ['claude-bughunter', 'quy trình săn lỗi bảo mật trên hệ thống được phép kiểm thử'],
      ['ctf-skills', 'luyện kỹ năng qua đề thi CTF'],
    ],
  },
  {
    id: 'excel',
    label: 'Excel / bảng tính',
    emoji: '📊',
    keywords: ['excel', 'xlsx', 'bang tinh', 'spreadsheet', 'xuat excel', 'nhap excel', 'import excel', 'export excel', 'csv'],
    skills: [
      ['xlsx', 'đọc, tạo và sửa file Excel có công thức, định dạng'],
      ['csv-data-summarizer', 'tóm tắt nhanh file CSV'],
    ],
  },
  {
    id: 'word',
    label: 'Word / báo cáo',
    emoji: '📄',
    keywords: ['word', 'docx', 'bao cao', 'van ban', 'hop dong', 'cong van', 'bien ban', 'mau van ban', 'in an'],
    skills: [
      ['docx', 'tạo và sửa file Word đúng định dạng'],
      ['doc-coauthoring', 'cùng AI viết tài liệu dài có cấu trúc'],
      ['internal-comms', 'báo cáo, thông báo nội bộ theo mẫu'],
    ],
  },
  {
    id: 'pdf',
    label: 'PDF',
    emoji: '📑',
    keywords: ['pdf', 'hoa don', 'ocr', 'quet tai lieu', 'bieu mau', 'form pdf'],
    weak: ['scan'],
    skills: [['pdf', 'tạo, gộp, tách, điền biểu mẫu và đọc chữ trong PDF']],
  },
  {
    id: 'slides',
    label: 'Slide thuyết trình',
    emoji: '🎞️',
    keywords: ['slide', 'powerpoint', 'pptx', 'thuyet trinh', 'trinh chieu'],
    weak: ['pitch', 'deck'],
    skills: [
      ['pptx', 'tạo và sửa file PowerPoint'],
      ['frontend-slides', 'slide HTML có hiệu ứng, mở bằng trình duyệt'],
    ],
  },
  {
    id: 'charts',
    label: 'Biểu đồ, phân tích dữ liệu',
    emoji: '📈',
    keywords: ['bieu do', 'chart', 'thong ke', 'phan tich du lieu', 'visualization', 'truc quan', 'kpi'],
    weak: ['du lieu', 'data', 'doanh thu', 'phan tich'],
    skills: [
      ['claude-d3js-skill', 'biểu đồ tương tác bằng D3.js'],
      ['csv-data-summarizer', 'phân tích nhanh dữ liệu dạng bảng'],
      ['xlsx', 'xử lý số liệu trong Excel'],
    ],
  },
  {
    id: 'ai',
    label: 'Tích hợp AI / chatbot',
    emoji: '🤖',
    keywords: ['tri tue nhan tao', 'tich hop ai', 'chatbot', 'chat bot', 'llm', 'gpt', 'openai', 'gemini', 'rag', 'tro ly ao', 'mcp'],
    weak: ['agent', 'claude'],
    skills: [
      ['claude-api', 'gọi Claude API đúng cách, đúng tên model'],
      ['mcp-builder', 'xây MCP server để AI dùng được dữ liệu của bạn'],
      ['prompt-master', 'viết prompt rõ ràng cho các tính năng AI'],
    ],
  },
  {
    id: 'ml',
    label: 'Học máy / nghiên cứu AI',
    emoji: '🔬',
    keywords: ['machine learning', 'hoc may', 'deep learning', 'huan luyen', 'fine tune', 'finetune', 'model training', 'nghien cuu khoa hoc'],
    weak: ['mo hinh'],
    skills: [
      ['ai-research-skills', 'huấn luyện, tinh chỉnh và đánh giá mô hình'],
      ['scientific-agent-skills', 'công cụ nghiên cứu khoa học bằng Python'],
    ],
  },
  {
    id: 'cloud',
    label: 'Triển khai trên AWS',
    emoji: '☁️',
    keywords: ['aws', 'lambda', 'cdk', 'serverless', 'amazon'],
    skills: [['aws-skills', 'dựng hạ tầng AWS bằng CDK, serverless']],
  },
  {
    id: 'marketing',
    label: 'Marketing, SEO, bán hàng online',
    emoji: '📣',
    keywords: ['marketing', 'seo', 'quang cao', 'ban hang online', 'thuong mai dien tu', 'ecommerce', 'e commerce', 'shop', 'cua hang', 'mang xa hoi', 'tiktok', 'facebook', 'fanpage', 'email marketing'],
    skills: [
      ['marketing-skills', 'SEO, quảng cáo, email, tăng tỷ lệ chuyển đổi'],
      ['social-media-research', 'nghiên cứu đối thủ và xu hướng mạng xã hội'],
      ['web-asset-generator', 'ảnh chia sẻ và icon cho website'],
    ],
  },
  {
    id: 'brand',
    label: 'Thương hiệu, hình ảnh',
    emoji: '🎨',
    keywords: ['thuong hieu', 'brand', 'branding', 'logo', 'poster', 'banner', 'nhan dien'],
    weak: ['mau sac', 'font chu'],
    skills: [
      ['brand-guidelines', 'áp màu, font thương hiệu thống nhất'],
      ['theme-factory', 'bộ màu và font dùng lại cho nhiều sản phẩm'],
      ['canvas-design', 'poster, ảnh tĩnh'],
    ],
  },
  {
    id: 'docs',
    label: 'Tài liệu, đặc tả, sơ đồ',
    emoji: '🗺️',
    keywords: ['dac ta', 'spec', 'prd', 'so do', 'diagram', 'erd', 'flowchart', 'luong nghiep vu', 'kien truc he thong', 'huong dan su dung'],
    weak: ['yeu cau', 'tai lieu'],
    skills: [
      ['doc-coauthoring', 'viết đặc tả, tài liệu dài cùng AI'],
      ['archify', 'biến mã nguồn, ý tưởng thành sơ đồ kiến trúc'],
      ['diagram-design', 'sơ đồ đẹp theo màu thương hiệu'],
      ['pm-skills', 'PRD, mục tiêu, chiến lược sản phẩm'],
      ['khoi-dong-du-an', 'mẫu tài liệu yêu cầu và tài liệu kiến trúc cho dự án mới'],
    ],
  },
  {
    id: 'product',
    label: 'Quản lý sản phẩm',
    emoji: '🎯',
    keywords: ['quan ly san pham', 'product manager', 'startup', 'mvp', 'okr', 'roadmap', 'lo trinh'],
    skills: [
      ['pm-skills', 'PRD, OKR, lộ trình sản phẩm'],
      ['khoi-dong-du-an', 'chốt phạm vi MVP và tiêu chí nghiệm thu đo được'],
    ],
  },
  {
    id: 'research',
    label: 'Nghiên cứu, khảo sát',
    emoji: '🔎',
    keywords: ['nghien cuu', 'khao sat', 'thi truong', 'doi thu', 'research'],
    weak: ['so sanh'],
    skills: [
      ['deep-research-skills', 'nghiên cứu nhiều nguồn, có trích dẫn'],
      ['social-media-research', 'tìm hiểu đối thủ trên mạng xã hội'],
    ],
  },
  {
    id: 'google',
    label: 'Google Workspace',
    emoji: '📬',
    keywords: ['gmail', 'google sheets', 'google drive', 'google docs', 'google calendar', 'lich google'],
    weak: ['google'],
    skills: [['google-workspace-cli', 'đọc, gửi Gmail, làm việc với Drive, Sheets, Lịch']],
  },
  {
    id: 'microsoft',
    label: 'Power Platform / Microsoft',
    emoji: '🏢',
    keywords: ['power apps', 'power automate', 'sharepoint', 'dynamics', 'low code', 'microsoft 365'],
    skills: [['power-platform-skills', 'xây ứng dụng và luồng tự động trên Power Platform']],
  },
  {
    id: 'notes',
    label: 'Ghi chú, quản lý kiến thức',
    emoji: '🗒️',
    keywords: ['obsidian', 'ghi chu', 'second brain', 'quan ly kien thuc', 'wiki'],
    skills: [['obsidian-skills', 'làm việc với ghi chú, canvas Obsidian']],
  },
  {
    id: 'content',
    label: 'Viết nội dung',
    emoji: '✍️',
    keywords: ['viet bai', 'content', 'copywriting', 'bien tap', 'linkedin', 'ebook'],
    weak: ['noi dung', 'sach'],
    skills: [
      ['humanizer', 'văn bản tự nhiên, bớt "giọng AI"'],
      ['marketing-skills', 'viết nội dung bán hàng, email'],
      ['linkedin-skills', 'bài viết LinkedIn'],
      ['markdown-to-epub', 'xuất ebook từ Markdown'],
    ],
  },
  {
    id: 'learning',
    label: 'Học tập, giáo dục',
    emoji: '🎓',
    keywords: ['hoc tap', 'giao duc', 'khoa hoc online', 'e learning', 'elearning', 'bai giang', 'hoc sinh', 'sinh vien'],
    skills: [
      ['tapestry-skills', 'học từ video, bài viết thành ghi chú'],
      ['book-to-skill', 'biến tài liệu học thành skill'],
    ],
  },
  {
    id: 'motion',
    label: 'Hiệu ứng, chuyển động',
    emoji: '🌀',
    keywords: ['animation', 'hieu ung', 'chuyen dong', 'motion', 'micro interaction'],
    skills: [['emilkowalski-skills', 'hiệu ứng chuyển động tinh tế cho giao diện']],
  },
  {
    id: 'reverse',
    label: 'Đọc hiểu phần mềm có sẵn',
    emoji: '🧩',
    keywords: ['dich nguoc', 'reverse engineering', 'decompile', 'phan mem cu', 'he thong cu', 'legacy', 'firmware'],
    skills: [['reverse-engineer-anything', 'tìm hiểu cách một ứng dụng có sẵn hoạt động']],
  },
  {
    id: 'cost',
    label: 'Tiết kiệm token, chi phí AI',
    emoji: '💸',
    keywords: ['tiet kiem token', 'tiet kiem chi phi', 'chi phi ai', 'ton token', 'ton nhieu token'],
    skills: [['caveman', 'AI trả lời ngắn gọn, tốn ít token hơn']],
  },
  {
    id: 'skills',
    label: 'Tự viết skill riêng',
    emoji: '🧰',
    keywords: ['tao skill', 'viet skill', 'skill rieng', 'skill noi bo', 'quy trinh noi bo'],
    skills: [
      ['skill-creator', 'tạo và đo chất lượng skill của riêng bạn'],
      ['skill-seekers', 'biến tài liệu nội bộ thành skill'],
      ['skillspector', 'quét bảo mật skill trước khi cài'],
    ],
  },
];

// Kiểm tra lúc build: slug phải có thật, id không trùng.
const known = new Set(SKILLS.map((s) => s.slug));
const ids = new Set<string>();
for (const n of NEEDS) {
  if (ids.has(n.id)) throw new Error(`needs.ts: id "${n.id}" bị trùng`);
  ids.add(n.id);
  for (const [slug] of n.skills) {
    if (!known.has(slug)) throw new Error(`needs.ts: nhu cầu "${n.id}" có slug "${slug}" không tồn tại trong skills.ts`);
  }
}
