import React, { useState } from 'react';
import { X, Copy, Check, Database, Key, ShieldCheck } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (url: string, key: string) => void;
}

export const SUPABASE_SQL_SCHEMA = `
-- 1. 팀원 테이블 (team_members)
create table if not exists public.team_members (
  id text primary key,
  name text not null,
  role text,
  department text,
  color text,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 일정 카테고리 테이블 (schedule_categories)
create table if not exists public.schedule_categories (
  id text primary key,
  name text not null,
  color text,
  text_color text,
  border_color text,
  emoji text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. 일정 테이블 (schedules)
create table if not exists public.schedules (
  id text primary key,
  member_id text references public.team_members(id) on delete cascade,
  category_id text references public.schedule_categories(id) on delete cascade,
  title text not null,
  start_date date not null,
  end_date date not null,
  memo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Row Level Security (RLS) 설정 (선택 사항)
alter table public.team_members enable row level security;
alter table public.schedule_categories enable row level security;
alter table public.schedules enable row level security;

create policy "Allow all operations for authenticated users" on public.team_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Allow all operations for authenticated users on categories" on public.schedule_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Allow all operations for authenticated users on schedules" on public.schedules
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
`;

export function SupabaseSetupModal({ isOpen, onClose, onSaveConfig }: SupabaseSetupModalProps) {
  const [url, setUrl] = useState(localStorage.getItem('SUPABASE_URL_OVERRIDE') || '');
  const [key, setKey] = useState(localStorage.getItem('SUPABASE_KEY_OVERRIDE') || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('SUPABASE_URL_OVERRIDE', url.trim());
    localStorage.setItem('SUPABASE_KEY_OVERRIDE', key.trim());
    onSaveConfig(url.trim(), key.trim());
    onClose();
    window.location.reload();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <div className="flex items-center gap-2 mb-4">
          <Database className="text-[#874d00]" size={28} />
          <h2 className="text-2xl font-bold font-sketch text-[#594a32]">Supabase 및 DB 설정 가이드</h2>
        </div>

        <p className="text-sm text-[#8c7853] mb-6">
          사내 인가된 사용자 로그인 및 클라우드(Supabase) DB 연동을 위한 설정과 필수 SQL 스크립트입니다.
        </p>

        {/* Credentials Form */}
        <form onSubmit={handleSave} className="bg-[#fcf8f0] p-4 rounded-xl border-2 border-dashed border-[#d4c5ab] mb-6">
          <h3 className="text-md font-bold text-[#6e5d43] mb-3 flex items-center gap-1.5">
            <Key size={16} /> Supabase 프로젝트 자격 증명 입력
          </h3>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#7a6b52]">Supabase Project URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxxx.supabase.co"
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#7a6b52]">Supabase Anon / Public Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="sketch-button px-4 py-2 bg-[#d6e4ff] hover:bg-[#adc6ff] text-[#1d39c4] text-sm font-bold"
            >
              저장 및 적용하기
            </button>
          </div>
        </form>

        {/* SQL Script Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-bold text-[#6e5d43] flex items-center gap-1.5">
              <ShieldCheck size={16} /> Supabase SQL Editor 실행 스크립트
            </h3>
            <button
              onClick={handleCopySql}
              className="sketch-button px-3 py-1.5 bg-[#ffe8a3] hover:bg-[#ffd166] text-[#874d00] text-xs font-bold flex items-center gap-1"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? '복사 완료!' : 'SQL 복사하기'}
            </button>
          </div>
          <p className="text-xs text-[#8c7853] mb-2">
            Supabase 대시보드의 <strong>SQL Editor</strong>에 아래 쿼리를 붙여넣고 Run을 실행해주세요.
          </p>
          <pre className="bg-[#2d2d2d] text-[#f8f8f2] p-3 rounded-xl text-xs overflow-x-auto font-mono max-h-48">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
}
