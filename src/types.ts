export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  color: string; // Pastel color
  avatar: string; // Emoji
}

export interface ScheduleCategory {
  id: string;
  name: string;
  color: string; // Pastel color badge
  textColor: string;
  borderColor: string;
  emoji: string;
}

export interface ScheduleItem {
  id: string;
  memberId: string;
  categoryId: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  memo?: string;
}

export type ViewMode = 'week' | 'month';
