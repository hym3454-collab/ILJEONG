import React, { useState } from 'react';
import { ScheduleCategory } from '../types';
import { X, Plus, Trash2, Edit3, Tag } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ScheduleCategory[];
  onAddCategory: (category: Omit<ScheduleCategory, 'id'>) => void;
  onUpdateCategory: (category: ScheduleCategory) => void;
  onDeleteCategory: (id: string) => void;
}

const CATEGORY_COLORS = [
  { color: '#ffdad6', textColor: '#8c2b24', borderColor: '#f4a39b' }, // Pink
  { color: '#d6e4ff', textColor: '#1d39c4', borderColor: '#91caff' }, // Blue
  { color: '#fff1b8', textColor: '#874d00', borderColor: '#ffe58f' }, // Yellow
  { color: '#d9f7be', textColor: '#237804', borderColor: '#b7eb8f' }, // Green
  { color: '#efdbff', textColor: '#531dab', borderColor: '#d3adf7' }, // Purple
  { color: '#ffd591', textColor: '#d4380d', borderColor: '#ffbb96' }, // Orange
];

const EMOJIS = ['🏖️', '🌙', '✈️', '📌', '💻', '💡', '🎉', '☕', '🏠', '🎯', '🔥', '📚'];

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const palette = CATEGORY_COLORS[selectedColorIndex];

    if (editingId) {
      onUpdateCategory({
        id: editingId,
        name,
        color: palette.color,
        textColor: palette.textColor,
        borderColor: palette.borderColor,
        emoji,
      });
      setEditingId(null);
    } else {
      onAddCategory({
        name,
        color: palette.color,
        textColor: palette.textColor,
        borderColor: palette.borderColor,
        emoji,
      });
    }

    setName('');
    setSelectedColorIndex(0);
    setEmoji(EMOJIS[0]);
  };

  const handleEdit = (cat: ScheduleCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setEmoji(cat.emoji || '📌');
    // find index matching color
    const idx = CATEGORY_COLORS.findIndex((p) => p.color === cat.color);
    if (idx !== -1) setSelectedColorIndex(idx);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSelectedColorIndex(0);
    setEmoji(EMOJIS[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="sketch-card bg-[#fffefc] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f5ebd7] transition-colors text-[#7a6b52]"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">🏷️</span>
          <h2 className="text-2xl font-bold font-sketch text-[#594a32]">일정 카테고리 관리</h2>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="bg-[#fcf8f0] p-4 rounded-xl border-2 border-dashed border-[#d4c5ab] mb-6">
          <h3 className="text-lg font-bold mb-3 text-[#6e5d43]">
            {editingId ? '✏️ 카테고리 수정' : '➕ 새 카테고리 등록 (기본: 휴가/야간근무/출장)'}
          </h3>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">카테고리 이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 휴가, 야간근무, 출장, 재택근무 등"
                className="sketch-input w-full px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">대표 이모지</label>
              <div className="flex gap-1 overflow-x-auto py-1">
                {EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`text-xl p-1.5 rounded-lg border ${
                      emoji === em ? 'border-[#8c7853] bg-[#faedcd] scale-110' : 'border-transparent bg-white'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">파스텔 색상 조합</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CATEGORY_COLORS.map((palette, idx) => (
                  <button
                    key={palette.color}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    style={{ backgroundColor: palette.color, color: palette.textColor }}
                    className={`p-2 rounded-lg text-xs font-bold border-2 flex items-center justify-center gap-1 ${
                      selectedColorIndex === idx ? 'border-[#594a32] ring-2 ring-[#ffe8a3]' : 'border-transparent shadow-xs'
                    }`}
                  >
                    <span>미리보기</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="sketch-button px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="sketch-button px-5 py-2 bg-[#d6e4ff] hover:bg-[#adc6ff] text-[#1d39c4] text-sm font-bold flex items-center gap-1.5"
            >
              {editingId ? <Tag size={16} /> : <Plus size={16} />}
              {editingId ? '카테고리 수정' : '카테고리 추가'}
            </button>
          </div>
        </form>

        {/* Category List */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#6e5d43]">🎨 등록된 카테고리 목록 ({categories.length}개)</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#e3d5b8] bg-white shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 border"
                    style={{ backgroundColor: cat.color, color: cat.textColor, borderColor: cat.borderColor }}
                  >
                    <span>{cat.emoji || '📌'}</span>
                    <span>{cat.name}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1.5 rounded-lg hover:bg-[#f5ebd7] text-[#7a6b52] transition-colors"
                    title="수정"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg hover:bg-[#ffe3e3] text-rose-500 transition-colors"
                    title="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
