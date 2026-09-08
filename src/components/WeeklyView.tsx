import { TeamMember, ScheduleCategory, ScheduleItem } from '../types';
import { Plus, Calendar, Sparkles } from 'lucide-react';

interface WeeklyViewProps {
  currentDate: Date;
  members: TeamMember[];
  categories: ScheduleCategory[];
  schedules: ScheduleItem[];
  onAddScheduleForDateAndMember: (dateStr: string, memberId: string) => void;
  onEditSchedule: (schedule: ScheduleItem) => void;
}

export function WeeklyView({
  currentDate,
  members,
  categories,
  schedules,
  onAddScheduleForDateAndMember,
  onEditSchedule,
}: WeeklyViewProps) {
  // Get start of week (Monday)
  const getWeekDays = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));

    const weekDays: Array<{ dateStr: string; dayName: string; dayNumber: number; isToday: boolean }> = [];
    const todayStr = new Date().toISOString().split('T')[0];

    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      const dateStr = nextDay.toISOString().split('T')[0];
      weekDays.push({
        dateStr,
        dayName: dayNames[i],
        dayNumber: nextDay.getDate(),
        isToday: dateStr === todayStr,
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays(currentDate);

  const getCategory = (catId: string) => {
    return categories.find((c) => c.id === catId);
  };

  // Check if a schedule covers a date
  const isScheduleOnDate = (schedule: ScheduleItem, dateStr: string) => {
    return dateStr >= schedule.startDate && dateStr <= schedule.endDate;
  };

  return (
    <div className="sketch-card bg-[#fffefc] p-4 sm:p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h2 className="text-xl font-bold font-sketch text-[#594a32]">주간 팀원 일정표 (Matrix View)</h2>
        </div>
        <div className="text-xs text-[#8c7853] bg-[#fcf8f0] px-3 py-1 rounded-full border border-[#e3d5b8]">
          💡 일정을 클릭하면 수정 또는 삭제할 수 있습니다. 빈 칸을 누르면 일정이 추가됩니다.
        </div>
      </div>

      <div className="min-w-[800px]">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-2 mb-3">
          <div className="p-3 bg-[#f5ebd7] rounded-xl text-center font-bold text-[#594a32] border border-[#d4c5ab] flex items-center justify-center gap-1">
            <span>🐿️</span> 팀원
          </div>
          {weekDays.map((day) => (
            <div
              key={day.dateStr}
              className={`p-2 rounded-xl text-center border transition-all ${
                day.isToday
                  ? 'bg-[#ffe8a3] border-[#f3cc5c] shadow-xs'
                  : 'bg-[#fcf8f0] border-[#e3d5b8]'
              }`}
            >
              <div className="text-xs font-bold text-[#7a6b52]">{day.dayName}요일</div>
              <div className={`text-lg font-bold font-sketch ${day.isToday ? 'text-[#874d00]' : 'text-[#594a32]'}`}>
                {day.dayNumber}일
              </div>
              <div className="text-[10px] text-[#9c8b70]">{day.dateStr}</div>
            </div>
          ))}
        </div>

        {/* Members Rows */}
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="grid grid-cols-8 gap-2 items-stretch">
              {/* Member Info Cell */}
              <div
                className="p-3 rounded-xl border-2 bg-white flex flex-col justify-center items-center text-center shadow-xs"
                style={{ borderColor: member.color, borderLeftWidth: '8px' }}
              >
                <span className="text-2xl mb-1">{member.avatar}</span>
                <span className="font-bold text-sm text-[#4a453e]">{member.name}</span>
                <span className="text-[11px] text-[#8c7853]">{member.role || member.department}</span>
              </div>

              {/* Day Cells for this Member */}
              {weekDays.map((day) => {
                const daySchedules = schedules.filter(
                  (sch) => sch.memberId === member.id && isScheduleOnDate(sch, day.dateStr)
                );

                return (
                  <div
                    key={day.dateStr}
                    onClick={() => {
                      if (daySchedules.length === 0) {
                        onAddScheduleForDateAndMember(day.dateStr, member.id);
                      }
                    }}
                    className={`p-2 rounded-xl border-2 border-dashed bg-[#fffdfa] hover:bg-[#fff7e6] transition-all min-h-[90px] flex flex-col gap-1.5 cursor-pointer relative group ${
                      day.isToday ? 'border-[#f3cc5c] bg-[#fffcf0]' : 'border-[#e3d5b8]'
                    }`}
                  >
                    {/* Add button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddScheduleForDateAndMember(day.dateStr, member.id);
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-[#ffe8a3] rounded-full text-[#874d00] hover:scale-110 transition-all shadow-xs"
                      title="이 날짜에 일정 추가"
                    >
                      <Plus size={12} />
                    </button>

                    {daySchedules.map((sch) => {
                      const cat = getCategory(sch.categoryId);
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
                          className="p-1.5 rounded-lg border text-xs font-bold shadow-xs hover:scale-[1.02] transition-transform truncate"
                          title={`${cat?.emoji || ''} ${sch.title} (${sch.memo || ''})`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            <span>{cat?.emoji}</span>
                            <span className="truncate">{sch.title}</span>
                          </div>
                        </div>
                      );
                    })}

                    {daySchedules.length === 0 && (
                      <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[#b5a48b] text-xs font-sketch">
                        + 일정 추가
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {members.length === 0 && (
            <div className="text-center py-12 text-[#9c8b70]">등록된 팀원이 없습니다. '팀원 관리'에서 팀원을 추가해주세요!</div>
          )}
        </div>
      </div>
    </div>
  );
}
