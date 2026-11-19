/**
 * Danh mục AI Skills. Mỗi mục đã được kiểm tra trực tiếp trên GitHub
 * (repo tồn tại, có SKILL.md, đọc file license) vào ngày CHECKED_AT.
 * Mô tả tiếng Việt do Kho Skill tự viết; không sao chép nội dung skill.
 */

export const CHECKED_AT = '2026-11-19';

export type Source = 'official' | 'community' | 'kho-skill';

export type CategoryId =
  | 'van-phong'
  | 'thiet-ke'
  | 'lap-trinh'
  | 'du-lieu'
  | 'bao-mat'
  | 'noi-dung'
  | 'tao-skill'
  | 'tri-nho';

export const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: 'van-phong', label: 'Văn phòng & tài liệu', emoji: '📄' },
  { id: 'thiet-ke', label: 'Thiết kế & giao diện', emoji: '🎨' },
  { id: 'lap-trinh', label: 'Lập trình & kiểm thử', emoji: '💻' },
  { id: 'du-lieu', label: 'Dữ liệu & khoa học', emoji: '📊' },
  { id: 'bao-mat', label: 'Bảo mật', emoji: '🛡️' },
  { id: 'noi-dung', label: 'Viết & học tập', emoji: '✍️' },
  { id: 'tao-skill', label: 'Tạo skill & AI', emoji: '🧩' },
  { id: 'tri-nho', label: 'Trí nhớ & phiên làm việc', emoji: '🧠' },
];

export type License = 'Apache-2.0' | 'MIT' | 'CC-BY-4.0' | 'CC-BY-SA-4.0' | 'none' | 'check-repo';

export const LICENSE_INFO: Record<License, { label: string; note: string; ok: boolean }> = {
  'Apache-2.0': { label: 'Apache 2.0', note: 'Dùng tự do, kể cả thương mại; giữ thông báo bản quyền.', ok: true },
  MIT: { label: 'MIT', note: 'Dùng tự do, kể cả thương mại; giữ thông báo bản quyền.', ok: true },
  'CC-BY-4.0': {
    label: 'CC BY 4.0',
    note: 'Được dùng, sửa và chia sẻ, kể cả thương mại; chỉ cần ghi nguồn tác giả.',
    ok: true,
  },
  'CC-BY-SA-4.0': {
    label: 'CC BY-SA 4.0',
    note: 'Được dùng và sửa, nhưng phải ghi nguồn và chia sẻ bản sửa theo cùng giấy phép.',
    ok: true,
  },
  none: {
    label: 'Chưa có giấy phép',
    note: 'Repo chưa có file license: về mặt pháp lý chưa được phép dùng lại cho mục đích thương mại. Nên hỏi tác giả trước.',
    ok: false,
  },
  'check-repo': {
    label: 'Kiểm tra repo',
    note: 'Thư mục skill không kèm file license riêng. Xem giấy phép chung của repo trước khi dùng thương mại.',
    ok: false,
  },
};

export interface Skill {
  slug: string;
  name: string;
  title: string; // tên tiếng Việt ngắn
  source: Source;
  author: string;
  repo: string; // owner/name
  path?: string; // thư mục skill trong repo
  category: CategoryId;
  license: License;
  summary: string; // 1 câu
  useWhen: string[];
  install: { label: string; commands: string[] }[];
  includes?: string[]; // với bộ nhiều skill
  skillCount?: number;
  rawFile?: string; // với skill Kho Skill tự viết: đường dẫn trong public/
  tags: string[];
}

const OFFICIAL_INSTALL = (plugin: string) => [
  {
    label: 'Claude Code',
    commands: ['/plugin marketplace add anthropics/skills', `/plugin install ${plugin}@anthropic-agent-skills`],
  },
];

const official = (
  s: Omit<Skill, 'source' | 'author' | 'repo' | 'install' | 'license'> & {
    plugin: string;
    license?: License;
  },
): Skill => {
  const { plugin, license, ...rest } = s;
  return {
    ...rest,
    source: 'official',
    author: 'Anthropic',
    repo: 'anthropics/skills',
    path: `skills/${s.slug}`,
    license: license ?? 'Apache-2.0',
    install: OFFICIAL_INSTALL(plugin),
  };
};

export const SKILLS: Skill[] = [
  // ───────────── Chính thức: tài liệu ─────────────
  official({
    slug: 'docx',
    name: 'docx',
    title: 'Làm việc với file Word',
    category: 'van-phong',
    plugin: 'document-skills',
    summary: 'Tạo, đọc và chỉnh sửa tài liệu Word (.docx) với định dạng chuyên nghiệp.',
    useWhen: [
      'Cần xuất báo cáo, hợp đồng, công văn ra file Word',
      'Tài liệu cần mục lục, tiêu đề nhiều cấp, đánh số trang, tiêu đề thư (letterhead)',
      'Cần trích xuất hoặc sắp xếp lại nội dung từ file .docx có sẵn',
    ],
    tags: ['word', 'docx', 'bao cao', 'van ban'],
  }),
  official({
    slug: 'pdf',
    name: 'pdf',
    title: 'Xử lý file PDF',
    category: 'van-phong',
    plugin: 'document-skills',
    summary: 'Đọc, trích xuất, gộp, tách, điền form và nhận dạng chữ (OCR) cho file PDF.',
    useWhen: [
      'Lấy chữ hoặc bảng từ PDF',
      'Gộp nhiều PDF, tách trang, xoay trang, thêm watermark',
      'Điền form PDF, đặt hoặc gỡ mật khẩu',
      'Biến PDF scan thành PDF tìm kiếm được bằng OCR',
    ],
    tags: ['pdf', 'ocr', 'form', 'gop file'],
  }),
  official({
    slug: 'pptx',
    name: 'pptx',
    title: 'Tạo và sửa slide PowerPoint',
    category: 'van-phong',
    plugin: 'document-skills',
    summary: 'Tạo bài trình chiếu, đọc và chỉnh sửa file PowerPoint (.pptx).',
    useWhen: [
      'Làm slide thuyết trình, pitch deck',
      'Lấy nội dung từ file .pptx để tóm tắt hoặc dùng lại',
      'Sửa, gộp hoặc cập nhật bài trình chiếu có sẵn',
    ],
    tags: ['powerpoint', 'slide', 'thuyet trinh'],
  }),
  official({
    slug: 'xlsx',
    name: 'xlsx',
    title: 'Bảng tính Excel',
    category: 'van-phong',
    plugin: 'document-skills',
    summary: 'Mở, tạo, sửa bảng tính Excel/CSV: công thức, định dạng, biểu đồ, làm sạch dữ liệu.',
    useWhen: [
      'Thêm cột, tính toán bằng công thức, định dạng bảng',
      'Làm sạch dữ liệu lộn xộn, vẽ biểu đồ',
      'Chuyển đổi giữa .xlsx, .csv, .tsv',
    ],
    tags: ['excel', 'xlsx', 'csv', 'bang tinh'],
  }),
  official({
    slug: 'doc-coauthoring',
    name: 'doc-coauthoring',
    title: 'Cùng viết tài liệu',
    category: 'noi-dung',
    plugin: 'example-skills',
    license: 'check-repo',
    summary: 'Quy trình từng bước để cùng AI viết tài liệu, đề xuất, đặc tả kỹ thuật.',
    useWhen: [
      'Viết tài liệu kỹ thuật, đề xuất dự án, tài liệu ra quyết định',
      'Muốn AI hỏi đủ bối cảnh trước khi viết, rồi chỉnh sửa qua nhiều vòng',
      'Cần kiểm tra tài liệu có dễ hiểu với người đọc không',
    ],
    tags: ['tai lieu', 'spec', 'de xuat', 'viet'],
  }),
  official({
    slug: 'internal-comms',
    name: 'internal-comms',
    title: 'Truyền thông nội bộ',
    category: 'noi-dung',
    plugin: 'example-skills',
    summary: 'Viết báo cáo, thông báo nội bộ theo đúng định dạng công ty hay dùng.',
    useWhen: [
      'Báo cáo tiến độ, cập nhật cho lãnh đạo',
      'Bản tin công ty, FAQ, báo cáo sự cố',
      'Muốn mọi thông báo nội bộ có cùng một khuôn mẫu',
    ],
    tags: ['bao cao', 'noi bo', 'thong bao', 'newsletter'],
  }),
  // ───────────── Chính thức: thiết kế ─────────────
  official({
    slug: 'frontend-design',
    name: 'frontend-design',
    title: 'Thiết kế giao diện có chủ đích',
    category: 'thiet-ke',
    plugin: 'example-skills',
    summary: 'Định hướng thẩm mỹ, chữ và bố cục để giao diện không trông như mẫu đại trà.',
    useWhen: [
      'Dựng giao diện mới hoặc làm lại một màn hình',
      'Cần chọn phong cách, font chữ, màu sắc có cá tính',
      'Giao diện AI tạo ra trông “na ná nhau”, cần khác biệt',
    ],
    tags: ['ui', 'giao dien', 'frontend', 'typography'],
  }),
  official({
    slug: 'canvas-design',
    name: 'canvas-design',
    title: 'Poster và ảnh tĩnh',
    category: 'thiet-ke',
    plugin: 'example-skills',
    summary: 'Tạo poster, tranh, thiết kế tĩnh dạng PNG/PDF theo một triết lý thiết kế rõ ràng.',
    useWhen: ['Làm poster, ấn phẩm, ảnh minh họa tĩnh', 'Cần thiết kế nguyên bản, không sao chép tác phẩm có sẵn'],
    tags: ['poster', 'png', 'thiet ke'],
  }),
  official({
    slug: 'algorithmic-art',
    name: 'algorithmic-art',
    title: 'Nghệ thuật bằng code',
    category: 'thiet-ke',
    plugin: 'example-skills',
    summary: 'Tạo tranh tạo sinh (generative art) bằng p5.js, có tham số để tương tác.',
    useWhen: ['Làm hình nền, hiệu ứng nghệ thuật bằng code', 'Flow field, hệ hạt (particle), ngẫu nhiên có seed'],
    tags: ['p5js', 'generative', 'nghe thuat'],
  }),
  official({
    slug: 'theme-factory',
    name: 'theme-factory',
    title: 'Bộ chủ đề màu và font',
    category: 'thiet-ke',
    plugin: 'example-skills',
    summary: 'Áp 1 trong 10 chủ đề màu và font có sẵn cho slide, tài liệu, landing page, hoặc tạo chủ đề mới.',
    useWhen: ['Muốn slide hay tài liệu đồng bộ màu và font nhanh', 'Cần tạo chủ đề mới ngay tại chỗ'],
    tags: ['theme', 'mau sac', 'font'],
  }),
  official({
    slug: 'brand-guidelines',
    name: 'brand-guidelines',
    title: 'Áp nhận diện thương hiệu',
    category: 'thiet-ke',
    plugin: 'example-skills',
    summary: 'Áp màu và kiểu chữ thương hiệu của Anthropic. Mẫu tốt để tự làm skill thương hiệu cho công ty bạn.',
    useWhen: [
      'Học cách đóng gói bộ nhận diện thương hiệu thành skill',
      'Sao chép cấu trúc để làm skill cho thương hiệu riêng',
    ],
    tags: ['thuong hieu', 'brand', 'mau'],
  }),
  official({
    slug: 'slack-gif-creator',
    name: 'slack-gif-creator',
    title: 'GIF động cho Slack',
    category: 'thiet-ke',
    plugin: 'example-skills',
    summary: 'Tạo ảnh GIF động tối ưu dung lượng và kích thước cho Slack.',
    useWhen: ['Làm GIF vui cho nhóm chat', 'Cần GIF đúng giới hạn kích thước của Slack'],
    tags: ['gif', 'slack', 'hoat hinh'],
  }),
  // ───────────── Chính thức: lập trình ─────────────
  official({
    slug: 'web-artifacts-builder',
    name: 'web-artifacts-builder',
    title: 'Dựng artifact web phức tạp',
    category: 'lap-trinh',
    plugin: 'example-skills',
    summary: 'Dựng artifact HTML nhiều thành phần bằng React, Tailwind CSS và shadcn/ui.',
    useWhen: ['Artifact cần state, nhiều trang hoặc component shadcn/ui', 'Không dùng cho trang HTML đơn giản một file'],
    tags: ['react', 'tailwind', 'shadcn', 'artifact'],
  }),
  official({
    slug: 'webapp-testing',
    name: 'webapp-testing',
    title: 'Kiểm thử web app bằng Playwright',
    category: 'lap-trinh',
    plugin: 'example-skills',
    summary: 'Điều khiển trình duyệt để kiểm thử web chạy ở máy local: thao tác, chụp màn hình, đọc log.',
    useWhen: ['Kiểm tra chức năng frontend sau khi sửa', 'Gỡ lỗi giao diện, xem log trình duyệt'],
    tags: ['playwright', 'test', 'kiem thu'],
  }),
  official({
    slug: 'mcp-builder',
    name: 'mcp-builder',
    title: 'Xây MCP server',
    category: 'lap-trinh',
    plugin: 'example-skills',
    summary: 'Hướng dẫn xây MCP server chất lượng để AI dùng được API và dịch vụ bên ngoài.',
    useWhen: ['Kết nối AI với API của công ty bạn', 'Viết MCP server bằng Python (FastMCP) hoặc Node/TypeScript'],
    tags: ['mcp', 'api', 'python', 'typescript'],
  }),
  official({
    slug: 'claude-api',
    name: 'claude-api',
    title: 'Tra cứu Claude API',
    category: 'lap-trinh',
    plugin: 'claude-api',
    summary: 'Tài liệu tham chiếu Claude API và SDK: model, giá, tham số, streaming, tool use, caching.',
    useWhen: [
      'Viết ứng dụng gọi Claude API ở bất kỳ ngôn ngữ nào',
      'Cần thông tin model và giá chính xác, không đoán',
      'Gỡ lỗi streaming, tool call, token',
    ],
    tags: ['api', 'sdk', 'llm', 'anthropic'],
  }),
  // ───────────── Chính thức: tạo skill, học tập ─────────────
  official({
    slug: 'skill-creator',
    name: 'skill-creator',
    title: 'Tạo và cải thiện skill',
    category: 'tao-skill',
    plugin: 'example-skills',
    summary: 'Tạo skill mới, sửa skill có sẵn, chạy đánh giá (eval) và tối ưu phần mô tả để skill kích hoạt đúng lúc.',
    useWhen: [
      'Biến quy trình làm việc lặp lại thành skill',
      'Skill của bạn không được AI dùng đúng lúc',
      'Muốn đo xem skill có thật sự giúp kết quả tốt hơn',
    ],
    tags: ['skill', 'eval', 'prompt'],
  }),
  official({
    slug: 'academy-guide',
    name: 'academy-guide',
    title: 'Gợi ý khóa học Claude Academy',
    category: 'noi-dung',
    plugin: 'academy-guide',
    summary: 'Khi bạn hỏi cách dùng Claude, gợi ý khóa học, hướng dẫn phù hợp từ Claude Academy.',
    useWhen: ['Mới bắt đầu dùng Claude', 'Cần tài liệu đào tạo để triển khai Claude cho nhóm'],
    tags: ['hoc', 'khoa hoc', 'huong dan'],
  }),
  official({
    slug: 'discernment-nudge',
    name: 'discernment-nudge',
    title: 'Câu hỏi giúp tự kiểm tra',
    category: 'noi-dung',
    plugin: 'discernment-nudge',
    summary: 'Sau một câu trả lời quan trọng, thêm 2–3 câu hỏi giúp bạn kiểm tra lại dữ kiện và giả định.',
    useWhen: ['Bạn sắp dựa vào lời khuyên, kế hoạch hay số liệu do AI đưa ra', 'Muốn tránh tin AI một cách mù quáng'],
    tags: ['tu duy', 'kiem tra', 'phan bien'],
  }),


  // ───────────── Kho Skill tự viết ─────────────
  {
    slug: 'session-handoff',
    name: 'session-handoff',
    title: 'Nhớ tiến độ giữa các phiên làm việc',
    source: 'kho-skill',
    author: 'Kho Skill',
    repo: '',
    category: 'tri-nho',
    license: 'MIT',
    rawFile: '/raw/session-handoff/SKILL.md',
    summary:
      'Ghi tiến độ dự án ra file HANDOFF.md trước khi hết phiên, và tự đọc lại khi mở phiên mới: AI làm tiếp đúng chỗ, không phải đọc lại cả cuộc trò chuyện.',
    useWhen: [
      'Phiên làm việc sắp đầy ngữ cảnh mà việc còn dở',
      'Dự án kéo dài nhiều ngày, mỗi lần mở lại phải giải thích từ đầu',
      'Muốn tiết kiệm token: AI chỉ mở đúng file cần, không quét lại cả dự án',
    ],
    install: [
      {
        label: 'Claude Code',
        commands: ['mkdir -p ~/.claude/skills/session-handoff', '# Lưu nội dung SKILL.md bên dưới vào thư mục trên'],
      },
    ],
    tags: ['handoff', 'tien do', 'luu', 'nho', 'context', 'token', 'phien', 'session'],
  },
  {
    slug: 'khoi-dong-du-an',
    name: 'khoi-dong-du-an',
    title: 'Khởi động dự án đúng quy trình',
    source: 'kho-skill',
    author: 'Kho Skill',
    repo: '',
    category: 'lap-trinh',
    license: 'MIT',
    rawFile: '/raw/khoi-dong-du-an/SKILL.md',
    summary:
      'Trước khi code, AI hỏi rõ yêu cầu một lượt, viết tài liệu yêu cầu có tiêu chí nghiệm thu, chọn kiến trúc đơn giản nhất đủ dùng, thiết kế dữ liệu và màn hình, chờ bạn xác nhận lộ trình, rồi làm từng phần kèm kiểm thử.',
    useWhen: [
      'Bắt đầu làm một website, web app hoặc app di động mới',
      'AI hay lao vào code khi bạn chưa nói hết ý, làm xong lại phải sửa nhiều',
      'Cần tài liệu yêu cầu, kế hoạch MVP, hoặc checklist kiểm thử, bảo mật và deploy lần đầu',
    ],
    install: [
      {
        label: 'Claude Code',
        commands: ['mkdir -p ~/.claude/skills/khoi-dong-du-an', '# Lưu nội dung SKILL.md bên dưới vào thư mục trên'],
      },
    ],
    tags: ['quy trinh', 'du an moi', 'yeu cau', 'prd', 'mvp', 'ke hoach', 'kien truc', 'checklist', 'vibe coding'],
  },
  // ───────────── Cộng đồng: trí nhớ ─────────────
  {
    slug: 'session-log',
    name: 'session-log',
    title: 'Nhật ký phiên làm việc theo tuần',
    source: 'community',
    author: 'Michał Parkoła',
    repo: 'michalparkola/tapestry-skills-for-claude-code',
    path: 'session-log',
    category: 'tri-nho',
    license: 'MIT',
    summary: 'Tóm tắt phiên làm việc và ghi nối vào file nhật ký theo tuần, mỗi ngày một mục, đánh dấu các kết quả dùng lại được.',
    useWhen: [
      'Muốn lưu lại lịch sử đã làm gì, quyết định gì qua từng ngày',
      'Cần xem lại tuần trước đã làm những gì với AI',
    ],
    install: [
      {
        label: 'Cài thủ công',
        commands: [
          'git clone https://github.com/michalparkola/tapestry-skills-for-claude-code.git',
          'cp -r tapestry-skills-for-claude-code/session-log ~/.claude/skills/',
        ],
      },
    ],
    tags: ['log', 'nhat ky', 'tom tat', 'session', 'phien', 'nho'],
  },

  // ───────────── Cộng đồng ─────────────
  {
    slug: 'superpowers',
    name: 'superpowers',
    title: 'Bộ quy trình làm phần mềm chuẩn chỉnh',
    source: 'community',
    author: 'Jesse Vincent (obra)',
    repo: 'obra/superpowers',
    category: 'lap-trinh',
    license: 'MIT',
    skillCount: 15,
    summary: 'Bộ skill giúp AI làm việc như kỹ sư có kỷ luật: lên kế hoạch, viết test trước, debug có hệ thống, kiểm chứng trước khi báo xong.',
    useWhen: [
      'Dùng AI viết code cho dự án thật, không chỉ thử nghiệm',
      'AI hay báo “đã xong” khi chưa chạy thử',
      'Muốn quy trình: brainstorm → kế hoạch → làm → review',
    ],
    includes: [
      'brainstorming',
      'writing-plans',
      'executing-plans',
      'test-driven-development',
      'systematic-debugging',
      'verification-before-completion',
      'requesting-code-review',
      'receiving-code-review',
      'using-git-worktrees',
      'subagent-driven-development',
      'dispatching-parallel-agents',
      'finishing-a-development-branch',
      'writing-skills',
      'using-superpowers',
      'diagnosing-superpowers',
    ],
    install: [{ label: 'Claude Code', commands: ['/plugin install superpowers@claude-plugins-official'] }],
    tags: ['tdd', 'debug', 'code review', 'quy trinh', 'git'],
  },
  {
    slug: 'playwright-skill',
    name: 'playwright-skill',
    title: 'Tự động hóa trình duyệt',
    source: 'community',
    author: 'lackeyjb',
    repo: 'lackeyjb/playwright-skill',
    category: 'lap-trinh',
    license: 'MIT',
    summary: 'Điều khiển trình duyệt bằng Playwright: tự tìm dev server, viết script test, chụp màn hình, kiểm tra responsive và link hỏng.',
    useWhen: ['Kiểm tra web trên nhiều kích thước màn hình', 'Test luồng đăng nhập, tìm link hỏng'],
    install: [
      {
        label: 'Claude Code',
        commands: ['/plugin marketplace add lackeyjb/playwright-skill', '/plugin install playwright-skill@playwright-skill'],
      },
    ],
    tags: ['playwright', 'test', 'responsive'],
  },
  {
    slug: 'expo-skills',
    name: 'expo',
    title: 'Làm app với Expo',
    source: 'community',
    author: 'Expo (chính thức)',
    repo: 'expo/skills',
    category: 'lap-trinh',
    license: 'MIT',
    skillCount: 25,
    summary: 'Bộ skill chính thức của đội Expo cho làm app React Native: router, UI, animation, EAS build, đưa app lên store.',
    useWhen: ['Làm app di động bằng React Native và Expo', 'Đưa app lên App Store và Google Play bằng EAS'],
    includes: ['expo-router', 'expo-ui', 'expo-animation', 'expo-data-fetching', 'eas-app-stores', 'eas-update', 'expo-upgrade', '…'],
    install: [{ label: 'Claude Code', commands: ['/plugin install expo@claude-plugins-official'] }],
    tags: ['react native', 'expo', 'mobile', 'app'],
  },
  {
    slug: 'ios-simulator-skill',
    name: 'ios-simulator-skill',
    title: 'Chạy và test app iOS',
    source: 'community',
    author: 'Conor Luddy',
    repo: 'conorluddy/ios-simulator-skill',
    category: 'lap-trinh',
    license: 'MIT',
    summary: 'Build, chạy và thao tác app iOS trong Simulator bằng 31 script gọn nhẹ.',
    useWhen: ['Test app iOS tự động: chạm, gõ, vuốt', 'Build dự án Xcode và mở trên Simulator'],
    install: [
      {
        label: 'Claude Code',
        commands: ['/plugin marketplace add conorluddy/ios-simulator-skill', '/plugin install ios-simulator-skill@conorluddy'],
      },
    ],
    tags: ['ios', 'xcode', 'simulator', 'mobile'],
  },
  {
    slug: 'aws-skills',
    name: 'aws-skills',
    title: 'Phát triển trên AWS',
    source: 'community',
    author: 'Mengxin Zhu (zxkane)',
    repo: 'zxkane/aws-skills',
    category: 'lap-trinh',
    license: 'MIT',
    skillCount: 6,
    summary: 'Hạ tầng dưới dạng code với AWS CDK và SST, tối ưu chi phí, kiến trúc serverless hướng sự kiện.',
    useWhen: ['Viết hạ tầng AWS bằng CDK hoặc SST', 'Muốn giảm hóa đơn AWS'],
    includes: ['aws-cdk-development', 'aws-sst-development', 'aws-cost-operations', 'aws-serverless-eda', 'aws-agentic-ai', 'aws-mcp-setup'],
    install: [
      {
        label: 'Claude Code',
        commands: ['/plugin marketplace add zxkane/aws-skills', '/plugin install aws-iac@aws-skills'],
      },
    ],
    tags: ['aws', 'cdk', 'serverless', 'cloud'],
  },
  {
    slug: 'frontend-slides',
    name: 'frontend-slides',
    title: 'Slide HTML có animation',
    source: 'community',
    author: 'Zara Zhang',
    repo: 'zarazhangrui/frontend-slides',
    category: 'thiet-ke',
    license: 'MIT',
    summary: 'Tạo bài trình chiếu bằng HTML với nhiều hiệu ứng chuyển động, hoặc chuyển file PowerPoint sang web.',
    useWhen: ['Muốn slide đẹp mở được trên trình duyệt', 'Chuyển PPTX cũ thành trang web'],
    install: [
      {
        label: 'Claude Code',
        commands: [
          '/plugin marketplace add https://github.com/zarazhangrui/frontend-slides',
          '/plugin install frontend-slides@frontend-slides',
        ],
      },
    ],
    tags: ['slide', 'html', 'animation'],
  },
  {
    slug: 'ui-ux-pro-max',
    name: 'ui-ux-pro-max',
    title: 'Trợ lý thiết kế UI/UX chuyên sâu',
    source: 'community',
    author: 'nextlevelbuilder',
    repo: 'nextlevelbuilder/ui-ux-pro-max-skill',
    path: '.claude/skills',
    category: 'thiet-ke',
    license: 'MIT',
    skillCount: 7,
    summary:
      'Bộ skill kèm kho dữ liệu thiết kế (kiểu giao diện, bảng màu, cặp font, biểu đồ) giúp AI đề xuất cả một hệ thống thiết kế hợp với ngành của sản phẩm, rồi dựng giao diện theo đó.',
    useWhen: [
      'Bắt đầu một landing page hay app mới và chưa chọn được phong cách, màu, font',
      'Muốn giao diện hợp với ngành: spa, ngân hàng, y tế, SaaS…, tránh các lỗi thiết kế hay gặp',
      'Rà soát giao diện có sẵn: độ tương phản, trạng thái focus, hiển thị trên nhiều cỡ màn hình',
      'Cần thêm logo, banner, nhận diện thương hiệu hay slide HTML',
    ],
    includes: ['ui-ux-pro-max', 'design-system', 'ui-styling', 'design', 'brand', 'banner-design', 'slides'],
    install: [
      {
        label: 'Claude Code',
        commands: [
          '/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill',
          '/plugin install ui-ux-pro-max@ui-ux-pro-max-skill',
        ],
      },
      {
        label: 'Cursor, Codex, Gemini CLI và agent khác (qua CLI)',
        commands: ['npm install -g ui-ux-pro-max-cli', 'cd /duong-dan/du-an', 'uipro init --ai claude   # đổi claude thành cursor, codex, gemini…'],
      },
    ],
    tags: ['ui', 'ux', 'thiet ke', 'giao dien', 'design system', 'mau sac', 'font', 'tailwind', 'shadcn', 'landing page'],
  },
  {
    slug: 'web-asset-generator',
    name: 'web-asset-generator',
    title: 'Favicon, icon và ảnh chia sẻ',
    source: 'community',
    author: 'alonw0',
    repo: 'alonw0/web-asset-generator',
    path: 'skills/web-asset-generator',
    category: 'thiet-ke',
    license: 'MIT',
    summary: 'Tạo favicon, icon app (PWA) và ảnh Open Graph khi chia sẻ link lên Facebook, Zalo, LinkedIn.',
    useWhen: ['Website mới chưa có favicon', 'Link chia sẻ lên mạng xã hội chưa có ảnh xem trước'],
    install: [
      {
        label: 'Cài thủ công',
        commands: [
          'git clone https://github.com/alonw0/web-asset-generator.git',
          'cp -r web-asset-generator/skills/web-asset-generator ~/.claude/skills/',
        ],
      },
    ],
    tags: ['favicon', 'og image', 'seo', 'icon'],
  },
  {
    slug: 'claude-d3js-skill',
    name: 'claude-d3js-skill',
    title: 'Biểu đồ tương tác với D3.js',
    source: 'community',
    author: 'Chris von Csefalvay',
    repo: 'chrisvoncsefalvay/claude-d3js-skill',
    category: 'du-lieu',
    license: 'none',
    summary: 'Hướng dẫn AI vẽ biểu đồ, sơ đồ mạng lưới, bản đồ tương tác bằng D3.js.',
    useWhen: ['Cần biểu đồ tùy biến mà thư viện có sẵn không làm được', 'Vẽ bản đồ, sơ đồ quan hệ bằng SVG'],
    install: [
      {
        label: 'Cài thủ công',
        commands: ['git clone https://github.com/chrisvoncsefalvay/claude-d3js-skill.git ~/.claude/skills/claude-d3js-skill'],
      },
    ],
    tags: ['d3', 'bieu do', 'svg', 'visualization'],
  },
  {
    slug: 'csv-data-summarizer',
    name: 'csv-data-summarizer',
    title: 'Tóm tắt dữ liệu CSV',
    source: 'community',
    author: 'coffeefuelbump',
    repo: 'coffeefuelbump/csv-data-summarizer-claude-skill',
    category: 'du-lieu',
    license: 'none',
    summary: 'Phân tích file CSV, đưa ra số liệu thống kê và vẽ biểu đồ nhanh bằng Python pandas.',
    useWhen: ['Nhận một file CSV và cần nắm nhanh nội dung', 'Muốn thống kê và biểu đồ mà không viết code'],
    install: [
      {
        label: 'Cài thủ công',
        commands: [
          'git clone https://github.com/coffeefuelbump/csv-data-summarizer-claude-skill.git ~/.claude/skills/csv-data-summarizer',
        ],
      },
    ],
    tags: ['csv', 'pandas', 'thong ke'],
  },
  {
    slug: 'scientific-agent-skills',
    name: 'scientific-agent-skills',
    title: 'Bộ skill nghiên cứu khoa học',
    source: 'community',
    author: 'K-Dense AI',
    repo: 'K-Dense-AI/scientific-agent-skills',
    category: 'du-lieu',
    license: 'MIT',
    skillCount: 177,
    summary: 'Hơn 170 skill cho nghiên cứu: thư viện và cơ sở dữ liệu khoa học chuyên ngành, chuyển tài liệu sang Markdown.',
    useWhen: ['Làm nghiên cứu, luận văn cần công cụ chuyên ngành', 'Xử lý tài liệu khoa học bằng AI'],
    install: [{ label: 'Mọi agent (skills CLI)', commands: ['npx skills add K-Dense-AI/scientific-agent-skills'] }],
    tags: ['khoa hoc', 'nghien cuu', 'python'],
  },
  {
    slug: 'trailofbits-skills',
    name: 'trailofbits/skills',
    title: 'Bộ skill bảo mật Trail of Bits',
    source: 'community',
    author: 'Trail of Bits',
    repo: 'trailofbits/skills',
    category: 'bao-mat',
    license: 'CC-BY-SA-4.0',
    skillCount: 99,
    summary: 'Gần 100 skill bảo mật từ công ty kiểm toán Trail of Bits: phân tích tĩnh với Semgrep và CodeQL, review code, rủi ro chuỗi cung ứng.',
    useWhen: ['Rà soát bảo mật code trước khi phát hành', 'Viết rule Semgrep, kiểm tra thư viện phụ thuộc'],
    includes: ['static-analysis', 'semgrep-rule-creator', 'supply-chain-risk-auditor', 'insecure-defaults', 'property-based-testing', 'differential-review', '…'],
    install: [{ label: 'Claude Code', commands: ['/plugin marketplace add trailofbits/skills'] }],
    tags: ['bao mat', 'semgrep', 'codeql', 'audit'],
  },
  {
    slug: 'reverse-engineer-anything',
    name: 'reverse-engineer-anything',
    title: 'Dịch ngược ứng dụng để hiểu tính năng',
    source: 'community',
    author: 'morluto',
    repo: 'morluto/rea',
    path: '.agents/skills/reverse-engineer-anything',
    category: 'bao-mat',
    license: 'MIT',
    summary:
      'Cho AI mổ xẻ phần mềm không có mã nguồn (file chạy, app Electron/JavaScript, .NET, firmware, website) để giải thích một tính năng hoạt động ra sao, kèm bằng chứng cho từng kết luận.',
    useWhen: [
      'Thấy tính năng hay ở một app khác và muốn biết nó được làm thế nào khi không có mã nguồn',
      'Cần dịch ngược file chạy hoặc firmware, dùng kèm Ghidra, IDA hay Hopper',
      'So sánh hành vi giữa hai phiên bản của cùng một ứng dụng',
    ],
    install: [
      {
        label: 'Claude Code, Codex, Cursor, Gemini CLI',
        commands: ['npx rea-agents setup', '# Chọn agent, duyệt thay đổi rồi khởi động lại agent'],
      },
    ],
    tags: ['dich nguoc', 'reverse engineering', 'decompile', 'ghidra', 'electron', 'firmware', 'mcp'],
  },
  {
    slug: 'skill-seekers',
    name: 'Skill Seekers',
    title: 'Biến tài liệu thành skill',
    source: 'community',
    author: 'Yusuf Karaaslan',
    repo: 'yusufkaraaslan/Skill_Seekers',
    category: 'tao-skill',
    license: 'MIT',
    summary: 'Tự động tạo skill từ website tài liệu, repo GitHub, PDF hoặc video.',
    useWhen: ['Muốn AI hiểu sâu một thư viện hay sản phẩm mới', 'Đóng gói tài liệu nội bộ thành skill'],
    install: [{ label: 'Python', commands: ['pip install skill-seekers'] }],
    tags: ['tao skill', 'tai lieu', 'pdf'],
  },
  {
    slug: 'tapestry-skills',
    name: 'tapestry-skills',
    title: 'Học từ video và bài viết',
    source: 'community',
    author: 'Michał Parkoła',
    repo: 'michalparkola/tapestry-skills-for-claude-code',
    category: 'noi-dung',
    license: 'MIT',
    skillCount: 7,
    summary: 'Lấy transcript YouTube, trích bài viết từ web, rồi biến kiến thức thành kế hoạch hành động.',
    useWhen: ['Học từ video YouTube mà không xem hết', 'Lưu bài viết hay và biến thành việc cần làm'],
    includes: ['youtube-transcript', 'article-extractor', 'ship-learn-next', 'learn-this', 'session-log', 'scrum-sage', 'unblock-action'],
    install: [
      {
        label: 'Cài thủ công',
        commands: [
          'git clone https://github.com/michalparkola/tapestry-skills-for-claude-code.git',
          'cp -r tapestry-skills-for-claude-code/youtube-transcript ~/.claude/skills/',
        ],
      },
    ],
    tags: ['youtube', 'hoc tap', 'transcript'],
  },
  {
    slug: 'markdown-to-epub',
    name: 'markdown-to-epub',
    title: 'Chuyển Markdown thành ebook',
    source: 'community',
    author: 'Scott Smerchek',
    repo: 'smerchek/claude-epub-skill',
    path: 'markdown-to-epub',
    category: 'noi-dung',
    license: 'MIT',
    summary: 'Chuyển tài liệu Markdown hoặc bản tóm tắt cuộc trò chuyện thành ebook EPUB, đọc được trên Kindle.',
    useWhen: ['Gom ghi chú thành sách điện tử', 'Đọc lại nội dung dài trên máy đọc sách'],
    install: [
      {
        label: 'Cài thủ công',
        commands: [
          'git clone https://github.com/smerchek/claude-epub-skill.git',
          'cp -r claude-epub-skill/markdown-to-epub ~/.claude/skills/',
        ],
      },
    ],
    tags: ['epub', 'kindle', 'ebook', 'markdown'],
  },
  // ───────────── Cộng đồng: đợt bổ sung 18/11/2026 ─────────────
  {
    slug: 'mattpocock-skills',
    name: 'mattpocock/skills',
    title: 'Bộ skill kỹ sư của Matt Pocock',
    source: 'community',
    author: 'Matt Pocock',
    repo: 'mattpocock/skills',
    category: 'lap-trinh',
    license: 'MIT',
    skillCount: 39,
    summary:
      'Các skill nhỏ, dễ sửa mà Matt Pocock dùng hằng ngày để làm phần mềm thật: review code, tìm lỗi, thiết kế miền nghiệp vụ, cải thiện kiến trúc.',
    useWhen: [
      'Muốn AI review thay đổi theo chuẩn của chính repo, không theo khẩu vị chung chung',
      'Đang săn một lỗi khó và cần quy trình chẩn đoán có hệ thống',
      'Cần làm rõ mô hình nghiệp vụ hoặc sắp xếp lại kiến trúc trước khi code tiếp',
    ],
    includes: ['code-review', 'diagnosing-bugs', 'domain-modeling', 'codebase-design', 'improve-codebase-architecture', 'implement-spec', 'ask-matt', '…'],
    install: [
      {
        label: 'Claude Code',
        commands: ['claude plugin install mattpocock-skills@claude-plugins-official', '# Sau đó chạy /setup-matt-pocock-skills một lần cho mỗi repo'],
      },
      { label: 'Cursor, OpenCode, Windsurf và agent khác', commands: ['npx skills@latest add mattpocock/skills'] },
    ],
    tags: ['review code', 'debug', 'kien truc', 'domain', 'typescript'],
  },
  {
    slug: 'addyosmani-agent-skills',
    name: 'addyosmani/agent-skills',
    title: 'Quy trình kỹ sư cấp cao của Addy Osmani',
    source: 'community',
    author: 'Addy Osmani',
    repo: 'addyosmani/agent-skills',
    category: 'lap-trinh',
    license: 'MIT',
    skillCount: 25,
    summary:
      'Đóng gói cách làm của kỹ sư nhiều kinh nghiệm thành skill cho từng chặng: viết đặc tả, lập kế hoạch, code, test, review và phát hành, kèm 9 lệnh tắt như /spec, /plan, /ship.',
    useWhen: [
      'Muốn AI đi đủ các bước từ ý tưởng đến phát hành thay vì nhảy thẳng vào code',
      'Thiết kế API hay ranh giới module cần ổn định lâu dài',
      'Muốn review code theo nhiều tiêu chí trước khi merge, hoặc ép làm theo TDD',
    ],
    includes: ['api-and-interface-design', 'code-review-and-quality', 'test-driven-development', 'browser-testing-with-devtools', 'ci-cd-and-automation', 'context-engineering', '…'],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add addyosmani/agent-skills', '/plugin install agent-skills@addy-agent-skills'] },
      { label: 'Agent khác (Cursor, Codex, Copilot…)', commands: ['npx skills add addyosmani/agent-skills'] },
    ],
    tags: ['quy trinh', 'spec', 'tdd', 'review code', 'api', 'ci cd'],
  },
  {
    slug: 'wshobson-agents',
    name: 'wshobson/agents',
    title: 'Kho plugin, agent và skill đa ngôn ngữ',
    source: 'community',
    author: 'Seth Hobson',
    repo: 'wshobson/agents',
    category: 'lap-trinh',
    license: 'MIT',
    skillCount: 185,
    summary:
      'Hơn 90 plugin gom agent, skill và lệnh theo từng mảng: Python, JavaScript/TypeScript, review code, test, hạ tầng, bảo mật, trợ năng. Cài plugin nào dùng plugin đó.',
    useWhen: [
      'Cần bộ công cụ sẵn cho một ngôn ngữ hay framework cụ thể mà không muốn tự viết',
      'Muốn kiểm tra trợ năng (WCAG, trình đọc màn hình) hoặc rà soát bảo mật phụ thuộc',
      'Dùng nhiều công cụ AI khác nhau nhưng muốn chung một bộ skill',
    ],
    includes: ['python-development', 'javascript-typescript', 'developer-essentials', 'security-scanning', 'accessibility-compliance', 'unit-testing', '…'],
    install: [
      {
        label: 'Claude Code (cài theo plugin, ví dụ Python)',
        commands: ['/plugin marketplace add wshobson/agents', '/plugin install python-development@claude-code-workflows'],
      },
      { label: 'Chỉ cài một skill (mọi agent)', commands: ['npx skills add wshobson/agents --skill python-testing-patterns'] },
    ],
    tags: ['plugin', 'python', 'javascript', 'typescript', 'test', 'tro nang', 'wcag'],
  },
  {
    slug: 'caveman',
    name: 'caveman',
    title: 'Bắt AI nói ngắn, tiết kiệm token',
    source: 'community',
    author: 'JuliusBrussee',
    repo: 'JuliusBrussee/caveman',
    category: 'lap-trinh',
    license: 'Apache-2.0',
    summary:
      'Bắt agent trả lời cụt ngủn kiểu "người tiền sử" nhưng vẫn giữ code chính xác; bản đầy đủ còn rút gọn log, kết quả test trước khi đưa cho mô hình đọc để bớt tốn token.',
    useWhen: [
      'Thấy AI trả lời dài dòng, tốn token mà ý chính chỉ vài dòng',
      'Phiên làm việc đọc nhiều log, JSON, kết quả test và hay chạm giới hạn',
      'Muốn viết commit message ngắn gọn đúng chuẩn Conventional Commits',
    ],
    includes: ['caveman', 'caveman-commit', 'caveman-compress', 'caveman-explore', 'cavecrew', '…'],
    install: [
      { label: 'Claude Code (chỉ skill)', commands: ['/plugin marketplace add JuliusBrussee/caveman', '/plugin install caveman@caveman'] },
      { label: 'Bản đầy đủ: skill và proxy rút gọn đầu vào (cần Node.js 22.13+)', commands: ['npx @caveman-ai/cli@latest'] },
    ],
    tags: ['tiet kiem token', 'ngan gon', 'commit', 'chi phi'],
  },
  {
    slug: 'fullstack-dev-skills',
    name: 'fullstack-dev-skills',
    title: '67 chuyên gia cho lập trình full-stack',
    source: 'community',
    author: 'Jeffallan',
    repo: 'Jeffallan/claude-skills',
    category: 'lap-trinh',
    license: 'MIT',
    skillCount: 67,
    summary:
      'Mỗi skill đóng vai một chuyên gia theo công nghệ (Angular, NestJS, React, cloud, DevOps, API…), tự kích hoạt theo yêu cầu và nạp đúng tài liệu tham khảo cần thiết.',
    useWhen: [
      'Làm dự án nhiều công nghệ và muốn AI có kiến thức sâu riêng cho từng framework',
      'Thiết kế API REST/GraphQL hoặc kiến trúc hệ thống mới',
      'Cần chuỗi việc trọn gói: thiết kế, code, test, triển khai',
    ],
    includes: ['api-designer', 'architecture-designer', 'angular-architect', 'cloud-architect', 'code-reviewer', 'chaos-engineer', '…'],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add jeffallan/claude-skills', '/plugin install fullstack-dev-skills@fullstack-dev-skills'] },
    ],
    tags: ['full stack', 'react', 'angular', 'nestjs', 'devops', 'api'],
  },
  {
    slug: 'impeccable',
    name: 'impeccable',
    title: 'Từ vựng thiết kế cho AI, chống giao diện "rập khuôn"',
    source: 'community',
    author: 'pbakaus',
    repo: 'pbakaus/impeccable',
    category: 'thiet-ke',
    license: 'Apache-2.0',
    summary:
      'Cho bạn những lệnh rõ nghĩa để chỉnh giao diện (polish, bolder, simplify…) và hai vai trò review: critique chấm theo nguyên tắc dễ dùng, audit kiểm tra trợ năng, hiệu năng, responsive.',
    useWhen: [
      'Giao diện AI làm ra trông na ná nhau: gradient tím, thẻ lồng thẻ, font Inter khắp nơi',
      'Muốn ra lệnh cụ thể kiểu "làm phần bảng giá nổi bật hơn" thay vì "làm cho đẹp"',
      'Cần một lượt review thiết kế có xếp hạng việc nên sửa trước',
    ],
    install: [
      {
        label: 'Claude Code, Cursor, Codex, Copilot và agent khác',
        commands: ['npx impeccable install', '# Tải lại công cụ, rồi chạy /impeccable init trong agent'],
      },
    ],
    tags: ['thiet ke', 'giao dien', 'review ui', 'tro nang', 'anti slop'],
  },
  {
    slug: 'taste-skill',
    name: 'design-taste-frontend',
    title: 'Gu thẩm mỹ cho website doanh nghiệp',
    source: 'community',
    author: 'Leonxlnx',
    repo: 'Leonxlnx/taste-skill',
    path: 'skills/taste-skill',
    category: 'thiet-ke',
    license: 'MIT',
    summary:
      'Giúp AI dựng website công ty có định hướng nghệ thuật rõ ràng: chữ viết tự nhiên, ảnh tham chiếu thật có ghi nguồn, và tự mở trình duyệt kiểm tra trước khi giao.',
    useWhen: [
      'Làm trang giới thiệu công ty, sản phẩm mà muốn tránh kiểu landing page đại trà',
      'Cần AI tự chọn phong cách và ảnh minh họa có chủ đích',
      'Muốn AI tự kiểm tra trang trên trình duyệt trước khi báo xong',
    ],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add Leonxlnx/taste-skill', '/plugin install taste-skill@taste-skill'] },
      { label: 'Agent khác', commands: ['npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"'] },
    ],
    tags: ['website', 'landing page', 'thiet ke', 'tham my'],
  },
  {
    slug: 'emilkowalski-skills',
    name: 'emilkowalski/skills',
    title: 'Hiệu ứng chuyển động và tinh chỉnh UI',
    source: 'community',
    author: 'emilkowalski',
    repo: 'emilkowalski/skills',
    category: 'thiet-ke',
    license: 'MIT',
    skillCount: 20,
    summary:
      'Kinh nghiệm thiết kế và làm animation của Emil Kowalski (từng làm ở Vercel, Linear): có nên chuyển động không, chuyển động thế nào cho tự nhiên, và giữ cho mượt.',
    useWhen: [
      'Thêm animation cho web hoặc React Native/Expo mà không biết bắt đầu từ đâu',
      'Animation bị giật, cần tối ưu hiệu năng',
      'Muốn giao diện có cảm giác chỉn chu kiểu sản phẩm của Apple',
    ],
    includes: ['animate', 'animate-expo', 'animation-performance', 'animation-vocabulary', 'apple-design', 'break-ui', '…'],
    install: [{ label: 'Claude Code, Cursor, Codex và agent khác', commands: ['npx skills@latest add emilkowalski/skills'] }],
    tags: ['animation', 'chuyen dong', 'react native', 'expo', 'ui'],
  },
  {
    slug: 'archify',
    name: 'archify',
    title: 'Biến ý tưởng, mã nguồn thành sơ đồ tương tác',
    source: 'community',
    author: 'tt-a1i',
    repo: 'tt-a1i/archify',
    path: 'archify',
    category: 'thiet-ke',
    license: 'Apache-2.0',
    summary:
      'Vẽ sơ đồ kiến trúc, luồng xử lý, sequence, ERD, dòng thời gian… thành một file HTML tương tác: phóng to, lọc, trình chiếu và chia sẻ được.',
    useWhen: [
      'Cần hiểu nhanh kiến trúc một codebase lạ',
      'Trình bày kế hoạch hay hệ thống cho người khác bằng hình thay vì chữ',
      'Muốn sơ đồ bấm vào được, không chỉ là ảnh tĩnh',
    ],
    install: [
      {
        label: 'Claude Code (cài thủ công)',
        commands: ['git clone https://github.com/tt-a1i/archify.git', 'cp -r archify/archify ~/.claude/skills/'],
      },
      {
        label: 'Cursor',
        commands: ['npx -y skills@latest add https://archify.si --skill archify --agent cursor --global --copy --yes'],
      },
    ],
    tags: ['so do', 'kien truc', 'diagram', 'erd', 'sequence', 'html'],
  },
  {
    slug: 'diagram-design',
    name: 'diagram-design',
    title: 'Sơ đồ đẹp theo màu thương hiệu',
    source: 'community',
    author: 'cathrynlavery',
    repo: 'cathrynlavery/diagram-design',
    path: 'skills/diagram-design',
    category: 'thiet-ke',
    license: 'MIT',
    summary:
      'Vẽ hơn 45 loại sơ đồ (kiến trúc, flowchart, sequence, ma trận ưu tiên…) thành một file HTML + SVG gọn gàng, có thể lấy màu và font từ website của bạn.',
    useWhen: [
      'Cần sơ đồ cho tài liệu, slide hay bài blog trông chuyên nghiệp',
      'Muốn mọi sơ đồ cùng màu sắc, font chữ với thương hiệu',
      'Thấy sơ đồ Mermaid mặc định quá thô',
    ],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add cathrynlavery/diagram-design', '/plugin install diagram-design@diagram-design'] },
      { label: 'Agent khác', commands: ['npx skills add cathrynlavery/diagram-design'] },
    ],
    tags: ['so do', 'diagram', 'svg', 'flowchart', 'thuong hieu'],
  },
  {
    slug: 'claude-mem',
    name: 'claude-mem',
    title: 'Trí nhớ dài hạn giữa các phiên',
    source: 'community',
    author: 'thedotmack',
    repo: 'thedotmack/claude-mem',
    category: 'tri-nho',
    license: 'Apache-2.0',
    summary:
      'Ghi lại những gì agent làm trong mỗi phiên, nén bằng AI rồi tự đưa phần liên quan vào phiên sau; dữ liệu lưu trên máy bạn và tìm kiếm lại được.',
    useWhen: [
      'Mở phiên mới là AI quên hết bối cảnh dự án hôm trước',
      'Muốn tìm lại "lần trước mình đã sửa lỗi này thế nào"',
      'Dùng nhiều công cụ (Claude Code, Codex, Gemini…) và muốn chung một trí nhớ',
    ],
    install: [
      {
        label: 'Claude Code',
        commands: ['/plugin marketplace add thedotmack/claude-mem', '/plugin install claude-mem'],
      },
      {
        label: 'Mọi agent được hỗ trợ',
        commands: ['npx claude-mem install', '# Thống kê ẩn danh bật sẵn; tắt bằng: npx claude-mem telemetry disable'],
      },
    ],
    tags: ['tri nho', 'memory', 'ngu canh', 'phien lam viec', 'context'],
  },
  {
    slug: 'planning-with-files',
    name: 'planning-with-files',
    title: 'Kế hoạch lưu ra file, không mất khi hết phiên',
    source: 'community',
    author: 'OthmanAdi',
    repo: 'OthmanAdi/planning-with-files',
    path: 'skills/planning-with-files',
    category: 'tri-nho',
    license: 'MIT',
    summary:
      'Bắt agent ghi kế hoạch, phát hiện và tiến độ vào ba file Markdown trong dự án; mỗi lượt đều được nhắc lại kế hoạch, nên vẫn làm tiếp đúng hướng sau khi xóa hội thoại hay nén ngữ cảnh.',
    useWhen: [
      'Việc nhiều bước kéo dài, AI hay "quên" mục tiêu giữa chừng',
      'Hay phải xóa hội thoại (/clear) và không muốn mất kế hoạch',
      'Muốn có bản ghi tiến độ đọc được để kiểm tra AI đã làm tới đâu',
    ],
    install: [
      { label: 'Claude Code, Cursor, Codex và agent khác', commands: ['npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g'] },
    ],
    tags: ['ke hoach', 'tien do', 'phien lam viec', 'context', 'markdown'],
  },
  {
    slug: 'mex',
    name: 'mex',
    title: 'Trí nhớ chung cho cả nhóm, lưu trong repo',
    source: 'community',
    author: 'mex-memory',
    repo: 'mex-memory/mex',
    category: 'tri-nho',
    license: 'MIT',
    summary:
      'Lưu hiểu biết về dự án (vì sao có ràng buộc này, lịch sử gỡ lỗi, trường hợp đặc biệt) thành Markdown trong thư mục .mex/, đi theo Git để cả người lẫn AI trong nhóm cùng dùng.',
    useWhen: [
      'Kiến thức dự án chỉ nằm trong đầu một người hoặc trong một phiên chat',
      'Nhóm nhiều người cùng dùng AI và muốn chia sẻ những gì AI đã tìm ra',
      'Cần giải thích một luồng phức tạp bằng sơ đồ trạng thái đã được kiểm tra',
    ],
    includes: ['mex-statechart'],
    install: [{ label: 'Cài bằng dòng lệnh', commands: ['npx mex-agent@0.8.5 setup'] }],
    tags: ['tri nho', 'nhom', 'git', 'tai lieu', 'kien thuc du an'],
  },
  {
    slug: 'book-to-skill',
    name: 'book-to-skill',
    title: 'Biến sách, tài liệu thành skill',
    source: 'community',
    author: 'virgiliojr94',
    repo: 'virgiliojr94/book-to-skill',
    category: 'tao-skill',
    license: 'MIT',
    summary:
      'Chuyển sách kỹ thuật và tài liệu (PDF, EPUB, DOCX, HTML, Markdown…) thành một skill có cấu trúc, để vừa học vừa tra cứu ngay trong lúc làm việc với AI.',
    useWhen: [
      'Đang học một cuốn sách kỹ thuật và muốn AI trả lời dựa đúng trên sách đó',
      'Có bộ tài liệu nội bộ cần biến thành kiến thức AI dùng được',
      'Muốn gộp nhiều nguồn tài liệu thành một skill thống nhất',
    ],
    install: [
      { label: 'Claude Code (cài thủ công)', commands: ['git clone https://github.com/virgiliojr94/book-to-skill.git ~/.claude/skills/book-to-skill'] },
      { label: 'Agent khác', commands: ['npx skills add virgiliojr94/book-to-skill'] },
    ],
    tags: ['sach', 'pdf', 'epub', 'tai lieu', 'tao skill', 'hoc tap'],
  },
  {
    slug: 'prompt-master',
    name: 'prompt-master',
    title: 'Viết prompt chuẩn cho mọi công cụ AI',
    source: 'community',
    author: 'nidhinjs',
    repo: 'nidhinjs/prompt-master',
    category: 'tao-skill',
    license: 'MIT',
    summary:
      'Khi bạn nhờ viết hoặc sửa prompt, skill này soạn prompt khớp với đặc điểm của từng công cụ đích: ChatGPT, Gemini, Cursor, Midjourney, Sora… để ra kết quả đúng ngay lần đầu.',
    useWhen: [
      'Cần prompt cho một công cụ AI khác (tạo ảnh, video, code) mà hay phải thử đi thử lại',
      'Muốn chuyển một prompt từ công cụ này sang công cụ khác',
      'Prompt hiện tại cho kết quả chưa ổn và cần sửa có lý do',
    ],
    install: [
      { label: 'Claude.ai', commands: ['# Tải repo dạng ZIP, rồi vào Customize → Skills → Upload a Skill'] },
      { label: 'Claude Code (cài thủ công)', commands: ['git clone https://github.com/nidhinjs/prompt-master.git ~/.claude/skills/prompt-master'] },
    ],
    tags: ['prompt', 'prompt engineering', 'midjourney', 'chatgpt', 'gemini'],
  },
  {
    slug: 'task-observer',
    name: 'task-observer',
    title: 'Skill tự cải thiện các skill khác',
    source: 'community',
    author: 'rebelytics',
    repo: 'rebelytics/one-skill-to-rule-them-all',
    path: 'skills/task-observer',
    category: 'tao-skill',
    license: 'CC-BY-4.0',
    summary:
      'Quan sát những lần bạn sửa AI, những việc lặp lại và các quyết định khó trong phiên làm việc, rồi đề xuất cập nhật nhỏ cho skill hiện có hoặc skill mới, kèm bằng chứng và lý do.',
    useWhen: [
      'Đã có nhiều skill và muốn chúng tốt dần lên qua mỗi lần dùng',
      'Hay phải nhắc AI cùng một điều và muốn biến điều đó thành skill',
      'Muốn biết nên viết skill mới nào dựa trên cách mình thực sự làm việc',
    ],
    install: [
      {
        label: 'Claude Code, Cursor và agent khác',
        commands: [
          'npx skills@1.8.1 add rebelytics/one-skill-to-rule-them-all --skill task-observer -g',
          '# Bật hook khởi động phiên theo references/environments.md trong repo',
        ],
      },
      { label: 'Claude.ai', commands: ['# Tải file .skill ở bản phát hành mới nhất, rồi tải lên trong Settings → Customize'] },
    ],
    tags: ['tao skill', 'cai thien', 'meta skill', 'tu dong hoa'],
  },
  {
    slug: 'skillspector',
    name: 'SkillSpector',
    title: 'Quét bảo mật skill trước khi cài',
    source: 'community',
    author: 'NVIDIA',
    repo: 'NVIDIA/SkillSpector',
    category: 'bao-mat',
    license: 'Apache-2.0',
    summary:
      'Công cụ của NVIDIA kiểm tra một skill có an toàn để cài không: tìm lỗ hổng, đoạn mã độc, prompt injection, hành vi gửi dữ liệu ra ngoài và rủi ro chuỗi cung ứng.',
    useWhen: [
      'Sắp cài skill từ nguồn lạ và muốn biết nó có làm gì nguy hiểm không',
      'Quản lý skill dùng chung cho cả nhóm, cần một bước kiểm duyệt trước khi cho cài',
      'Muốn AI tự rà skill giúp bạn bằng skill skill-inspector đi kèm',
    ],
    includes: ['skill-inspector'],
    install: [
      {
        label: 'Cài công cụ dòng lệnh (cần uv, Python 3.13)',
        commands: ['uv tool install --python 3.13 git+https://github.com/NVIDIA/skillspector.git'],
      },
    ],
    tags: ['bao mat', 'quet skill', 'prompt injection', 'chuoi cung ung', 'kiem duyet'],
  },
  {
    slug: 'claude-bughunter',
    name: 'claude-bughunter',
    title: 'Bộ skill săn lỗi bảo mật (bug bounty)',
    source: 'community',
    author: 'Sachin Sharma',
    repo: 'elementalsouls/Claude-BugHunter',
    category: 'bao-mat',
    license: 'MIT',
    skillCount: 83,
    summary:
      'Quy trình săn lỗi web, API, ứng dụng Android và hạ tầng đám mây, dựa trên hàng trăm báo cáo lỗ hổng đã công bố; kèm mẫu viết báo cáo cho các nền tảng bug bounty.',
    useWhen: [
      'Tham gia chương trình bug bounty và chỉ kiểm thử trong phạm vi được phép',
      'Kiểm thử xâm nhập ứng dụng của chính công ty mình',
      'Cần viết báo cáo lỗ hổng rõ ràng, đủ bằng chứng',
    ],
    includes: ['bug-bounty', 'bb-methodology', 'apk-redteam-pipeline', 'cloud-iam-deep', 'bugcrowd-reporting', '…'],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add elementalsouls/Claude-BugHunter', '/plugin install claude-bughunter@elementalsouls'] },
    ],
    tags: ['bao mat', 'bug bounty', 'pentest', 'kiem thu xam nhap', 'red team'],
  },
  {
    slug: 'ctf-skills',
    name: 'ctf-skills',
    title: 'Giải đề thi CTF bảo mật',
    source: 'community',
    author: 'ljagiello',
    repo: 'ljagiello/ctf-skills',
    category: 'bao-mat',
    license: 'MIT',
    skillCount: 12,
    summary:
      'Kỹ thuật cho từng dạng đề CTF: khai thác web, pwn, mật mã, dịch ngược, điều tra số (forensics), OSINT, mã độc và cả tấn công mô hình AI.',
    useWhen: [
      'Luyện tập hoặc thi CTF và cần gợi ý hướng giải theo dạng đề',
      'Học bảo mật qua các bài thực hành có lời giải',
      'Cần chuẩn bị sẵn bộ công cụ trước giờ thi',
    ],
    includes: ['ctf-web', 'ctf-pwn', 'ctf-crypto', 'ctf-reverse', 'ctf-forensics', 'ctf-osint', '…'],
    install: [{ label: 'Claude Code, Codex, Gemini CLI và agent khác', commands: ['npx skills add ljagiello/ctf-skills'] }],
    tags: ['bao mat', 'ctf', 'pwn', 'mat ma', 'forensics', 'osint'],
  },
  {
    slug: 'ai-research-skills',
    name: 'AI-Research-SKILLs',
    title: 'Thư viện skill nghiên cứu AI',
    source: 'community',
    author: 'Orchestra Research',
    repo: 'Orchestra-Research/AI-Research-SKILLs',
    category: 'du-lieu',
    license: 'MIT',
    skillCount: 98,
    summary:
      'Gần 100 skill chia 23 nhóm cho người làm nghiên cứu AI: kiến trúc mô hình, tokenizer, fine-tune, huấn luyện phân tán, đánh giá, và quy trình tự chạy thí nghiệm từ ý tưởng đến bài báo.',
    useWhen: [
      'Fine-tune hoặc huấn luyện lại mô hình ngôn ngữ (Axolotl, LLaMA-Factory, TRL…)',
      'Cần AI hỗ trợ thiết kế và chạy hàng loạt thí nghiệm',
      'Tìm hiểu nhanh một kiến trúc mô hình như Mamba, RWKV, nanoGPT',
    ],
    includes: ['autoresearch', 'fine-tuning', 'post-training', 'distributed-training', 'evaluation', 'model-architecture', '…'],
    install: [
      {
        label: 'Claude Code (cài theo nhóm, ví dụ fine-tune)',
        commands: ['/plugin marketplace add orchestra-research/AI-research-SKILLs', '/plugin install fine-tuning@ai-research-skills'],
      },
      { label: 'Cài bằng dòng lệnh', commands: ['npx @orchestra-research/ai-research-skills'] },
    ],
    tags: ['nghien cuu', 'ai', 'machine learning', 'fine tune', 'llm', 'huan luyen'],
  },
  {
    slug: 'deep-research-skills',
    name: 'deep-research-skills',
    title: 'Nghiên cứu chuyên sâu có kiểm soát',
    source: 'community',
    author: 'Weizhena',
    repo: 'Weizhena/Deep-Research-skills',
    category: 'du-lieu',
    license: 'MIT',
    skillCount: 5,
    summary:
      'Nghiên cứu theo hai bước: lập dàn ý các đối tượng và tiêu chí cần tìm, bạn duyệt và chỉnh, rồi AI mới đi tìm hiểu sâu từng mục và tổng hợp thành báo cáo.',
    useWhen: [
      'So sánh công nghệ, framework hay công cụ trước khi chọn',
      'Khảo sát đối thủ, xu hướng thị trường',
      'Tổng quan tài liệu, bài báo cho một chủ đề học thuật',
    ],
    includes: ['research', 'research-deep', 'research-report', 'research-add-items', 'research-add-fields'],
    install: [
      {
        label: 'Claude Code (cài thủ công)',
        commands: [
          'git clone https://github.com/Weizhena/deep-research-skills.git',
          'cd deep-research-skills',
          'cp -r skills/research-en/* ~/.claude/skills/',
          'cp -r agents/web-search-modules ~/.claude/agents/',
          'pip install pyyaml',
        ],
      },
    ],
    tags: ['nghien cuu', 'research', 'so sanh', 'thi truong', 'bao cao'],
  },
  {
    slug: 'social-media-research',
    name: 'social-media-research-skills',
    title: 'Nghiên cứu mạng xã hội và đối thủ',
    source: 'community',
    author: 'ScrapeCreators',
    repo: 'ScrapeCreators/social-media-research-skills',
    category: 'du-lieu',
    license: 'MIT',
    skillCount: 13,
    summary:
      'Tìm bài đăng nổi bật bất thường, khai thác bình luận, mổ xẻ đối thủ và thư viện quảng cáo trên TikTok, Instagram, YouTube, Reddit, X, LinkedIn… Cần API key của ScrapeCreators.',
    useWhen: [
      'Tìm ý tưởng nội dung từ những bài đăng đang chạy tốt bất thường',
      'Xem đối thủ đang chạy quảng cáo gì, nói gì với khách hàng',
      'Tìm hiểu khách hàng nghĩ gì qua bình luận, chọn người có ảnh hưởng để hợp tác',
    ],
    includes: ['outlier-post-finder', 'comment-mining', 'competitor-social-research', 'ad-library-teardown', 'influencer-prospecting', '…'],
    install: [
      {
        label: 'Claude Code, Cursor, Codex và agent khác',
        commands: [
          'npx skills add ScrapeCreators/social-media-research-skills',
          '# Đăng ký API key tại scrapecreators.com, rồi: export SCRAPECREATORS_API_KEY=sk_...',
        ],
      },
    ],
    tags: ['mang xa hoi', 'marketing', 'doi thu', 'tiktok', 'youtube', 'quang cao'],
  },
  {
    slug: 'google-workspace-cli',
    name: 'gws',
    title: 'Điều khiển Google Workspace bằng AI',
    source: 'community',
    author: 'googleworkspace',
    repo: 'googleworkspace/cli',
    category: 'van-phong',
    license: 'Apache-2.0',
    skillCount: 95,
    summary:
      'Công cụ dòng lệnh gws cho Drive, Gmail, Lịch, Sheets, Docs, Chat… kèm hàng chục skill để AI đọc lịch, gửi mail, tải file, ghi tài liệu giúp bạn. README ghi rõ đây không phải sản phẩm Google hỗ trợ chính thức.',
    useWhen: [
      'Nhờ AI xem lịch họp tuần này hoặc tạo sự kiện mới',
      'Tải file lên Drive, gửi email, ghi dữ liệu vào Sheets hay Docs từ dòng lệnh',
      'Quản trị viên cần xem nhật ký và báo cáo sử dụng của tổ chức',
    ],
    includes: ['gws-calendar', 'gws-gmail', 'gws-drive', 'gws-docs', 'gws-chat', 'gws-admin-reports', '…'],
    install: [
      {
        label: 'Bước 1: cài công cụ gws',
        commands: ['npm install -g @googleworkspace/cli', '# hoặc: brew install googleworkspace-cli'],
      },
      { label: 'Bước 2: cài skill (mọi agent)', commands: ['npx skills add https://github.com/googleworkspace/cli'] },
    ],
    tags: ['google', 'gmail', 'drive', 'lich', 'sheets', 'docs', 'van phong'],
  },
  {
    slug: 'obsidian-skills',
    name: 'obsidian-skills',
    title: 'Làm việc với ghi chú Obsidian',
    source: 'community',
    author: 'Obsidian',
    repo: 'obsidianmd/obsidian-skills',
    category: 'van-phong',
    license: 'MIT',
    skillCount: 7,
    summary:
      'Bộ skill do chính đội Obsidian làm, dạy AI dùng Obsidian CLI và các định dạng mở: Markdown kiểu Obsidian, Bases, JSON Canvas, cùng công cụ trích nội dung web thành Markdown sạch.',
    useWhen: [
      'Dùng Obsidian để ghi chú và muốn AI sắp xếp, tạo, sửa ghi chú cho đúng chuẩn',
      'Vẽ sơ đồ tư duy hay bảng ý tưởng bằng Canvas',
      'Lưu bài viết trên web về kho ghi chú dưới dạng Markdown gọn gàng',
    ],
    includes: ['obsidian-markdown', 'obsidian-cli', 'obsidian-bases', 'json-canvas', 'defuddle', '…'],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add obsidianmd/obsidian-skills', '/plugin install obsidian@obsidian-skills'] },
      { label: 'Agent khác', commands: ['npx skills add https://github.com/obsidianmd/obsidian-skills'] },
    ],
    tags: ['obsidian', 'ghi chu', 'markdown', 'canvas', 'quan ly kien thuc'],
  },
  {
    slug: 'power-platform-skills',
    name: 'power-platform-skills',
    title: 'Xây ứng dụng Power Platform của Microsoft',
    source: 'community',
    author: 'Microsoft',
    repo: 'microsoft/power-platform-skills',
    category: 'van-phong',
    license: 'MIT',
    skillCount: 135,
    summary:
      'Plugin của Microsoft giúp AI dựng ứng dụng trên Power Platform: Power Apps, Power Pages, Power Automate, Dataverse. Bạn mô tả bằng lời, AI hỏi lại, trình bày kế hoạch và xin phép trước khi chạy.',
    useWhen: [
      'Doanh nghiệp đang dùng Microsoft 365 và muốn làm app nội bộ nhanh',
      'Tạo trang web Power Pages hay luồng duyệt tự động với Power Automate',
      'Tìm nguyên nhân một luồng tự động bị lỗi',
    ],
    includes: ['power-pages', 'canvas-apps', 'model-apps', 'power-automate', 'dataverse', '…'],
    install: [
      {
        label: 'Claude Code (cài theo plugin, ví dụ Power Pages)',
        commands: ['/plugin marketplace add microsoft/power-platform-skills', '/plugin install power-pages@power-platform-skills'],
      },
    ],
    tags: ['microsoft', 'power apps', 'power automate', 'low code', 'doanh nghiep'],
  },
  {
    slug: 'humanizer',
    name: 'humanizer',
    title: 'Làm văn bản bớt "giọng AI"',
    source: 'community',
    author: 'blader',
    repo: 'blader/humanizer',
    category: 'noi-dung',
    license: 'MIT',
    summary:
      'Viết lại đoạn văn do AI soạn cho tự nhiên như người viết mà không đổi ý, dựa trên danh sách dấu hiệu văn AI mà Wikipedia tổng hợp.',
    useWhen: [
      'Bài đăng, email do AI viết nghe sáo rỗng, nhiều cảm thán và biểu tượng cảm xúc',
      'Biên tập bản nháp trước khi gửi khách hàng hay đăng lên mạng',
      'Muốn soát văn bản xem còn chỗ nào lộ rõ là AI viết',
    ],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add blader/humanizer', '/plugin install humanizer@humanizer'] },
      { label: 'Agent khác', commands: ["npx skills add blader/humanizer --global --agent '*'"] },
    ],
    tags: ['viet', 'bien tap', 'van ban', 'giong van', 'ai writing'],
  },
  {
    slug: 'marketing-skills',
    name: 'marketingskills',
    title: 'Bộ skill marketing tăng trưởng',
    source: 'community',
    author: 'Corey Haines',
    repo: 'coreyhaines31/marketingskills',
    category: 'noi-dung',
    license: 'MIT',
    skillCount: 53,
    summary:
      'Hơn 50 skill cho marketer và nhà sáng lập: tối ưu chuyển đổi, viết quảng cáo, SEO (kể cả cho công cụ tìm kiếm AI), A/B test, đo lường và giữ chân khách hàng.',
    useWhen: [
      'Viết lại trang bán hàng để tăng tỉ lệ chuyển đổi',
      'Lên nội dung quảng cáo, email tiếp cận khách hàng mới',
      'Đọc kết quả A/B test và quyết định phiên bản nào thắng',
    ],
    includes: ['copywriting', 'ab-testing', 'ai-seo', 'ad-creative', 'cold-email', 'churn-prevention', '…'],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add coreyhaines31/marketingskills', '/plugin install marketing-skills'] },
      { label: 'Agent khác', commands: ['npx skills add coreyhaines31/marketingskills'] },
    ],
    tags: ['marketing', 'seo', 'quang cao', 'chuyen doi', 'copywriting', 'email'],
  },
  {
    slug: 'pm-skills',
    name: 'pm-skills',
    title: 'Bộ skill cho quản lý sản phẩm',
    source: 'community',
    author: 'phuryn',
    repo: 'phuryn/pm-skills',
    category: 'noi-dung',
    license: 'MIT',
    skillCount: 72,
    summary:
      'Hơn 70 skill và quy trình nối tiếp cho người làm sản phẩm: khám phá nhu cầu, chiến lược, viết PRD, OKR, phân tích dữ liệu, ra mắt và tăng trưởng, chia thành 9 plugin.',
    useWhen: [
      'Có ý tưởng sản phẩm mới và cần kiểm chứng nhu cầu',
      'Viết PRD, user story hay đặt OKR cho quý',
      'Phân tích cohort, A/B test để ra quyết định sản phẩm',
    ],
    includes: ['pm-product-discovery', 'pm-product-strategy', 'pm-execution', 'pm-market-research', 'pm-data-analytics', '…'],
    install: [
      {
        label: 'Claude Code (cài theo plugin, ví dụ bộ công cụ chung)',
        commands: ['claude plugin marketplace add phuryn/pm-skills', 'claude plugin install pm-toolkit@pm-skills'],
      },
    ],
    tags: ['quan ly san pham', 'product', 'prd', 'okr', 'chien luoc'],
  },
  {
    slug: 'linkedin-skills',
    name: 'linkedin-skills',
    title: 'Viết bài và bình luận LinkedIn',
    source: 'community',
    author: 'sergebulaev',
    repo: 'sergebulaev/linkedin-skills',
    category: 'noi-dung',
    license: 'MIT',
    skillCount: 12,
    summary:
      'Soạn bài đăng, bình luận, trả lời trên LinkedIn theo giọng của bạn, bỏ dấu hiệu văn AI, lên lịch đăng đều đặn; mọi thứ đều chờ bạn duyệt trước khi đăng.',
    useWhen: [
      'Muốn đăng LinkedIn đều mà không có thời gian viết',
      'Cần bình luận dưới bài người khác sao cho được chú ý',
      'Lên kế hoạch nội dung và theo dõi ai đang tương tác với bạn',
    ],
    includes: ['linkedin-marketing', 'linkedin-content-planner', 'linkedin-comment-drafter', 'linkedin-humanizer', '…'],
    install: [
      { label: 'Claude Code', commands: ['/plugin marketplace add sergebulaev/linkedin-skills', '/plugin install linkedin-skills@linkedin-skills'] },
    ],
    tags: ['linkedin', 'mang xa hoi', 'viet bai', 'thuong hieu ca nhan'],
  },
];

export const skillUrl = (s: Skill) =>
  s.rawFile ? s.rawFile : s.path ? `https://github.com/${s.repo}/tree/main/${s.path}` : `https://github.com/${s.repo}`;

export const categoryOf = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

/** Bỏ dấu tiếng Việt để tìm kiếm "khong dau" vẫn ra kết quả. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
