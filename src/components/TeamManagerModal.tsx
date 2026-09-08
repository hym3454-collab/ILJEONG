import React, { useState } from 'react';
import { TeamMember } from '../types';
import { X, Plus, Trash2, Edit3, UserCheck } from 'lucide-react';

interface TeamManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
}

const PASTEL_COLORS = [
  '#ffc0cb', // Pink
  '#bae7ff', // Blue
  '#fff1b8', // Yellow
  '#d9f7be', // Green
  '#efdbff', // Purple
  '#ffd591', // Orange
  '#d3f261', // Lime
  '#87e8de', // Cyan
];

const EMOJIS = ['🐿️', '🦊', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐶', '🐱', '펭귄', '뼑', '⭐'];

export function TeamManagerModal({
  isOpen,
  onClose,
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}: TeamManagerModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('개발팀');
  const [color, setColor] = useState(PASTEL_COLORS[0]);
  const [avatar, setAvatar] = useState(EMOJIS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateMember({
        id: editingId,
        name,
        role,
        department,
        color,
        avatar,
      });
      setEditingId(null);
    } else {
      onAddMember({
        name,
        role,
        department,
        color,
        avatar,
      });
    }

    setName('');
    setRole('');
    setDepartment('개발팀');
    setColor(PASTEL_COLORS[0]);
    setAvatar(EMOJIS[0]);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setDepartment(member.department);
    setColor(member.color);
    setAvatar(member.avatar);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setDepartment('개발팀');
    setColor(PASTEL_COLORS[0]);
    setAvatar(EMOJIS[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="sketch-card bg-[#fffefc] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f5ebd7] transition-colors text-[#7a6b52]"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">🐿️</span>
          <h2 className="text-2xl font-bold font-sketch text-[#594a32]">팀원 관리하기</h2>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="bg-[#fcf8f0] p-4 rounded-xl border-2 border-dashed border-[#d4c5ab] mb-6">
          <h3 className="text-lg font-bold mb-3 text-[#6e5d43]">
            {editingId ? '✏️ 팀원 정보 수정' : '➕ 새 팀원 등록하기'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김다람"
                className="sketch-input w-full px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">직책/역할</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="예: 프론트엔드 개발자"
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">소속 부서</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="예: 개발팀"
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">귀여운 아바타 (이모지)</label>
              <div className="flex gap-1 overflow-x-auto py-1">
                {EMOJIS.slice(0, 8).map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className={`text-xl p-1.5 rounded-lg border ${
                      avatar === em ? 'border-[#8c7853] bg-[#faedcd] scale-110' : 'border-transparent bg-white'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-[#7a6b52]">파스텔 테마 색상</label>
            <div className="flex gap-2">
              {PASTEL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === c ? 'border-[#594a32] scale-110 shadow-sm' : 'border-white'
                  }`}
                />
              ))}
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
              className="sketch-button px-5 py-2 bg-[#ffe8a3] hover:bg-[#ffd166] text-[#594a32] text-sm font-bold flex items-center gap-1.5"
            >
              {editingId ? <UserCheck size={16} /> : <Plus size={16} />}
              {editingId ? '수정 완료' : '팀원 등록'}
            </button>
          </div>
        </form>

        {/* Member List */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-[#6e5d43]">📋 등록된 팀원 목록 ({members.length}명)</h3>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#e3d5b8] bg-white shadow-xs"
                style={{ borderLeft: `6px solid ${member.color}` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl w-10 h-10 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </span>
                  <div>
                    <div className="font-bold text-[#4a453e] flex items-center gap-2">
                      {member.name}
                      <span className="text-xs font-normal px-2 py-0.5 rounded bg-[#f4ecd8] text-[#7a6b52]">
                        {member.department}
                      </span>
                    </div>
                    <div className="text-xs text-[#8c7853]">{member.role || '역할 미정'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1.5 rounded-lg hover:bg-[#f5ebd7] text-[#7a6b52] transition-colors"
                    title="수정"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="p-1.5 rounded-lg hover:bg-[#ffe3e3] text-rose-500 transition-colors"
                    title="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="text-center py-8 text-[#9c8b70]">등록된 팀원이 없습니다. 위에서 팀원을 추가해주세요!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
