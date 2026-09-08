import { TeamMember, ScheduleCategory, ScheduleItem } from '../types';

export const initialCategories: ScheduleCategory[] = [
  {
    id: 'cat-vacation',
    name: '휴가',
    color: '#ffdad6', // Pastel Pink
    textColor: '#8c2b24',
    borderColor: '#f4a39b',
    emoji: '🏖️',
  },
  {
    id: 'cat-night',
    name: '야간근무',
    color: '#d6e4ff', // Pastel Blue
    textColor: '#1d39c4',
    borderColor: '#91caff',
    emoji: '🌙',
  },
  {
    id: 'cat-biztrip',
    name: '출장',
    color: '#fff1b8', // Pastel Yellow
    textColor: '#874d00',
    borderColor: '#ffe58f',
    emoji: '✈️',
  },
  {
    id: 'cat-meeting',
    name: '사내회의',
    color: '#d9f7be', // Pastel Green
    textColor: '#237804',
    borderColor: '#b7eb8f',
    emoji: '📌',
  },
];

export const initialMembers: TeamMember[] = [
  {
    id: 'mem-1',
    name: '김다람',
    role: '팀장',
    department: '개발팀',
    color: '#ffc0cb',
    avatar: '🐿️',
  },
  {
    id: 'mem-2',
    name: '이토토리',
    role: '시니어 개발자',
    department: '개발팀',
    color: '#bae7ff',
    avatar: '🦊',
  },
  {
    id: 'mem-3',
    name: '박도토리',
    role: '디자이너',
    department: '디자인팀',
    color: '#fff1b8',
    avatar: '🐰',
  },
  {
    id: 'mem-4',
    name: '최상실',
    role: '기획자',
    department: '기획팀',
    color: '#d9f7be',
    avatar: '🐻',
  },
];

// Helper to get relative date string (YYYY-MM-DD)
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialSchedules: ScheduleItem[] = [
  {
    id: 'sch-1',
    memberId: 'mem-1',
    categoryId: 'cat-vacation',
    title: '여름 리프레시 휴가',
    startDate: getRelativeDate(-1),
    endDate: getRelativeDate(1),
    memo: '가족들과 제주도 여행 다녀오겠습니다!',
  },
  {
    id: 'sch-2',
    memberId: 'mem-2',
    categoryId: 'cat-night',
    title: '서버 긴급 패치 야간근무',
    startDate: getRelativeDate(0),
    endDate: getRelativeDate(0),
    memo: 'AWS 인프라 마이그레이션 모니터링',
  },
  {
    id: 'sch-3',
    memberId: 'mem-3',
    categoryId: 'cat-biztrip',
    title: '부산 지사 UI 디자인 미팅',
    startDate: getRelativeDate(2),
    endDate: getRelativeDate(4),
    memo: '신규 디자인 시스템 워크숍 진행',
  },
  {
    id: 'sch-4',
    memberId: 'mem-4',
    categoryId: 'cat-meeting',
    title: 'Q3 스프린트 기획 회의',
    startDate: getRelativeDate(1),
    endDate: getRelativeDate(1),
    memo: '신규 기능 요구사항 정의',
  },
  {
    id: 'sch-5',
    memberId: 'mem-1',
    categoryId: 'cat-biztrip',
    title: '판교 테크 컨퍼런스 참관',
    startDate: getRelativeDate(5),
    endDate: getRelativeDate(6),
    memo: 'AI 트렌드 세션 참석',
  },
];
