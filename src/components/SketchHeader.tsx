import { ViewMode } from '../types';
import { Calendar as CalendarIcon, Users, Tag, Plus, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface SketchHeaderProps {
  currentDate: Date;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenTeamManager: () => void;
  onOpenCategoryManager: () => void;
  onOpenAddSchedule: () => void;
}

export function SketchHeader({
  currentDate,
  onPrevDate,
  onNextDate,
  onToday,
  viewMode,
  onViewModeChange,
  onOpenTeamManager,
  onOpenCategoryManager,
  onOpenAddSchedule,
}: SketchHeaderProps) {
  const formatDateTitle = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    if (viewMode === 'month') {
      return `${year}년 ${month}월 스케치북`;
    } else {
      // Week display format
      return `${year}년 ${month}월 주간 일정`;
    }
  };

  return (
    <header className="sketch-card bg-[#fffef9] p-4 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="text-4xl sm:text-5xl animate-bounce">🌰</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-sketch text-[#594a32] tracking-wide">
                다람쥐 스케치북 팀 일정표
              </h1>
              <span className="bg-[#ffe8a3] text-[#874d00] text-xs px-2.5 py-1 rounded-full font-bold border border-[#ffe58f]">
                귀여운 사내 캘린더 ✨
              </span>
            </div>
            <p className="text-sm text-[#8c7853] font-sketch mt-0.5">
              5살 어린아이가 그린 듯한 따뜻한 파스텔 톤 팀원 스케줄러
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenTeamManager}
            className="sketch-button px-3.5 py-2 bg-[#bae7ff] hover:bg-[#91caff] text-[#1d39c4] text-sm font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Users size={16} /> 팀원 관리
          </button>

          <button
            onClick={onOpenCategoryManager}
            className="sketch-button px-3.5 py-2 bg-[#fff1b8] hover:bg-[#ffe58f] text-[#874d00] text-sm font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Tag size={16} /> 카테고리 관리
          </button>

          <button
            onClick={onOpenAddSchedule}
            className="sketch-button px-4 py-2 bg-[#d9f7be] hover:bg-[#b7eb8f] text-[#237804] text-sm font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={18} /> 일정 등록하기
          </button>
        </div>
      </div>

      {/* Navigation & View Toggle bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t-2 border-dashed border-[#e3d5b8]">
        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevDate}
            className="p-1.5 rounded-lg border-2 border-[#d4c5ab] bg-white hover:bg-[#f5ebd7] text-[#594a32] transition-all"
            title="이전 기간"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={onToday}
            className="sketch-button px-3 py-1 bg-[#fff8e7] text-[#7a6b52] text-sm font-bold border border-[#d4c5ab]"
          >
            오늘
          </button>
          <button
            onClick={onNextDate}
            className="p-1.5 rounded-lg border-2 border-[#d4c5ab] bg-white hover:bg-[#f5ebd7] text-[#594a32] transition-all"
            title="다음 기간"
          >
            <ChevronRight size={20} />
          </button>
          <span className="text-xl font-bold font-sketch text-[#594a32] ml-2">
            {formatDateTitle()}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-[#f5ebd7] p-1 rounded-2xl border border-[#d4c5ab]">
          <button
            onClick={() => onViewModeChange('week')}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'week'
                ? 'bg-white text-[#594a32] shadow-sm border border-[#d4c5ab]'
                : 'text-[#8c7853] hover:text-[#594a32]'
            }`}
          >
            주간 뷰 (Week)
          </button>
          <button
            onClick={() => onViewModeChange('month')}
            className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'month'
                ? 'bg-white text-[#594a32] shadow-sm border border-[#d4c5ab]'
                : 'text-[#8c7853] hover:text-[#594a32]'
            }`}
          >
            월간 뷰 (Month)
          </button>
        </div>
      </div>
    </header>
  );
}
