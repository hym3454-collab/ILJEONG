import { TeamMember, ScheduleCategory, ScheduleItem } from '../types';
import { Plus, Calendar, Sparkles } from 'lucide-react';

interface MonthlyViewProps {
  currentDate: Date;
  members: TeamMember[];
  categories: ScheduleCategory[];
  schedules: ScheduleItem[];
  onAddScheduleForDate: (dateStr: string) => void;
  onEditSchedule: (schedule: ScheduleItem) => void;
}

export function MonthlyView({
  currentDate,
  members,
  categories,
  schedules,
  onAddScheduleForDate,
  onEditSchedule,
}: MonthlyViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);
  const getMember = (memId: string) => members.find((m) => m.id === memId);

  const isScheduleOnDate = (schedule: ScheduleItem, dateStr: string) => {
    return dateStr >= schedule.startDate && dateStr <= schedule.endDate;
  };

  // Build calendar grid days
  const calendarDays = [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Previous month padding days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 12 : month;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum, isCurrentMonth: false, isToday: false });
  }

  // Current month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month padding days to fill 35 or 42 cells
  const remainingCells = 7 - (calendarDays.length % 7);
  if (remainingCells < 7) {
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      calendarDays.push({ dateStr, dayNum: i, isCurrentMonth: false, isToday: false });
    }
  }

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="sketch-card bg-[#fffefc] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗓️</span>
          <h2 className="text-xl font-bold font-sketch text-[#594a32]">월간 팀원 스케치북 캘린더</h2>
        </div>
        <div className="text-xs text-[#8c7853] bg-[#fcf8f0] px-3 py-1 rounded-full border border-[#e3d5b8]">
          ✨ 날짜를 클릭하면 새 일정을 등록할 수 있습니다.
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {dayNames.map((d, idx) => (
          <div
            key={d}
            className={`p-2 font-bold rounded-xl border border-[#d4c5ab] ${
              idx === 0 ? 'bg-[#ffe8a3] text-[#874d00]' : idx === 6 ? 'bg-[#d6e4ff] text-[#1d39c4]' : 'bg-[#f5ebd7] text-[#594a32]'
            }`}
          >
            {d}요일
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const daySchedules = schedules.filter((sch) => isScheduleOnDate(sch, day.dateStr));

          return (
            <div
              key={index}
              onClick={() => onAddScheduleForDate(day.dateStr)}
              className={`p-2 rounded-2xl border min-h-[110px] transition-all flex flex-col cursor-pointer relative group ${
                !day.isCurrentMonth
                  ? 'bg-gray-50/60 border-gray-200 text-gray-400'
                  : day.isToday
                  ? 'bg-[#fffcf0] border-2 border-[#f3cc5c] shadow-sm'
                  : 'bg-[#fffdfa] border-[#e3d5b8] hover:bg-[#fcf8f0]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-bold font-sketch ${
                    day.isToday
                      ? 'bg-[#ffe8a3] text-[#874d00] px-2 py-0.5 rounded-full'
                      : day.isCurrentMonth
                      ? 'text-[#594a32]'
                      : 'text-gray-400'
                  }`}
                >
                  {day.dayNum}일
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddScheduleForDate(day.dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 bg-[#ffe8a3] rounded-full text-[#874d00] hover:scale-110 transition-all shadow-xs"
                  title="일정 추가"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Schedules List in Cell */}
              <div className="space-y-1 overflow-y-auto max-h-[85px] pr-0.5">
                {daySchedules.map((sch) => {
                  const cat = getCategory(sch.categoryId);
                  const member = getMember(sch.memberId);

                  return (
                    <div
                      key={sch.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSchedule(sch);
                      }}
                      style={{
                        backgroundColor: cat?.color || '#eee',
                        color: cat?.textColor || '#333',
                        borderColor: cat?.borderColor || '#ccc',
                      }}
                      className="p-1 rounded-lg border text-[11px] font-bold shadow-xs hover:scale-[1.02] transition-transform truncate flex items-center gap-1"
                      title={`${member?.name || ''} - ${cat?.name || ''}: ${sch.title}`}
                    >
                      <span>{member?.avatar}</span>
                      <span className="truncate">{sch.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
