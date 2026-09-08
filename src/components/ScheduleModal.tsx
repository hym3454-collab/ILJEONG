import React, { useState, useEffect } from 'react';
import { ScheduleItem, TeamMember, ScheduleCategory } from '../types';
import { X, Plus, Trash2, Calendar } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  categories: ScheduleCategory[];
  initialDate?: string;
  scheduleToEdit?: ScheduleItem | null;
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
  onUpdateSchedule: (schedule: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
}

export function ScheduleModal({
  isOpen,
  onClose,
  members,
  categories,
  initialDate,
  scheduleToEdit,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}: ScheduleModalProps) {
  const [memberId, setMemberId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (scheduleToEdit) {
      setMemberId(scheduleToEdit.memberId);
      setCategoryId(scheduleToEdit.categoryId);
      setTitle(scheduleToEdit.title);
      setStartDate(scheduleToEdit.startDate);
      setEndDate(scheduleToEdit.endDate);
      setMemo(scheduleToEdit.memo || '');
    } else {
      const today = initialDate || new Date().toISOString().split('T')[0];
      setMemberId(members[0]?.id || '');
      setCategoryId(categories[0]?.id || '');
      setTitle('');
      setStartDate(today);
      setEndDate(today);
      setMemo('');
    }
  }, [scheduleToEdit, initialDate, isOpen, members, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !memberId || !categoryId || !startDate || !endDate) return;

    if (scheduleToEdit) {
      onUpdateSchedule({
        id: scheduleToEdit.id,
        memberId,
        categoryId,
        title,
        startDate,
        endDate,
        memo,
      });
    } else {
      onAddSchedule({
        memberId,
        categoryId,
        title,
        startDate,
        endDate,
        memo,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="sketch-card bg-[#fffefc] w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f5ebd7] transition-colors text-[#7a6b52]"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">📅</span>
          <h2 className="text-2xl font-bold font-sketch text-[#594a32]">
            {scheduleToEdit ? '팀원 일정 수정하기' : '새 팀원 일정 등록하기'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">팀원 선택</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="sketch-input w-full px-3 py-2 text-sm"
              required
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.avatar} {m.name} ({m.department} - {m.role || '팀원'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">일정 카테고리</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  style={{
                    backgroundColor: categoryId === cat.id ? cat.color : '#fff',
                    borderColor: categoryId === cat.id ? cat.textColor : '#d4c5ab',
                    color: cat.textColor,
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-1 transition-all ${
                    categoryId === cat.id ? 'ring-2 ring-offset-1 ring-[#ffe8a3] scale-105' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">일정 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 여름 휴가, 야간 모니터링, 고객사 미팅"
              className="sketch-input w-full px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="sketch-input w-full px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">종료일</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="sketch-input w-full px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">상세 메모 (선택)</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="일정과 관련된 상세 내용을 적어주세요..."
              className="sketch-input w-full px-3 py-2 text-sm h-20 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {scheduleToEdit ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteSchedule(scheduleToEdit.id);
                  onClose();
                }}
                className="sketch-button px-4 py-2 bg-[#ffe3e3] hover:bg-[#ffcccc] text-rose-600 text-sm font-bold flex items-center gap-1"
              >
                <Trash2 size={16} /> 삭제하기
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="sketch-button px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold"
              >
                취소
              </button>
              <button
                type="submit"
                className="sketch-button px-5 py-2 bg-[#d9f7be] hover:bg-[#b7eb8f] text-[#237804] text-sm font-bold flex items-center gap-1"
              >
                <Plus size={16} /> {scheduleToEdit ? '수정 저장' : '일정 등록'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
