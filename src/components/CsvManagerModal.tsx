import React, { useState } from 'react';
import { TeamMember, ScheduleCategory, ScheduleItem } from '../types';
import { X, Download, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface CsvManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  categories: ScheduleCategory[];
  schedules: ScheduleItem[];
  onImportSchedules: (newSchedules: ScheduleItem[]) => void;
}

export function CsvManagerModal({
  isOpen,
  onClose,
  members,
  categories,
  schedules,
  onImportSchedules,
}: CsvManagerModalProps) {
  const [importStatus, setImportStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // Export Schedules as CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'MemberName', 'CategoryName', 'Title', 'StartDate', 'EndDate', 'Memo'];
    const rows = schedules.map((sch) => {
      const member = members.find((m) => m.id === sch.memberId);
      const cat = categories.find((c) => c.id === sch.categoryId);
      return [
        sch.id,
        `"${member?.name || '미지정'}"`,
        `"${cat?.name || '기타'}"`,
        `"${sch.title.replace(/"/g, '""')}"`,
        sch.startDate,
        sch.endDate,
        `"${(sch.memo || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `team_schedules_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import & Accumulate CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setImportStatus('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('CSV 파일에 데이터가 부족합니다.');
        }

        // Parse CSV rows (simple parser handling quotes)
        const parsedSchedules: ScheduleItem[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          // Regex to split CSV columns considering quoted commas
          const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
          if (cols.length >= 6) {
            const cleanCols = cols.map((c) => c.replace(/^"|"$/g, '').trim());
            const [id, memberName, categoryName, title, startDate, endDate, memo] = cleanCols;

            // Match member by name or default to first member
            const matchedMember = members.find((m) => m.name === memberName) || members[0];
            // Match category by name or default to first category
            const matchedCat = categories.find((c) => c.name === categoryName) || categories[0];

            if (matchedMember && matchedCat && title && startDate && endDate) {
              parsedSchedules.push({
                id: `csv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                memberId: matchedMember.id,
                categoryId: matchedCat.id,
                title,
                startDate,
                endDate,
                memo: memo || '',
              });
            }
          }
        }

        if (parsedSchedules.length > 0) {
          onImportSchedules(parsedSchedules);
          setImportStatus(`성공적으로 ${parsedSchedules.length}개의 일정이 누적 저장되었습니다! 🎉`);
        } else {
          throw new Error('유효한 일정 데이터를 파싱할 수 없습니다. CSV 포맷을 확인해주세요.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'CSV 파일 처리 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="sketch-card bg-[#fffefc] w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f5ebd7] transition-colors text-[#7a6b52]"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet className="text-[#237804]" size={28} />
          <h2 className="text-2xl font-bold font-sketch text-[#594a32]">CSV 데이터 연동 및 누적 저장</h2>
        </div>

        <p className="text-sm text-[#8c7853] mb-6">
          팀원 일정을 CSV 파일로 다운로드하거나, 외부 CSV 파일을 업로드하여 Supabase/로컬에 <strong>누적 저장</strong>할 수 있습니다.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#ffe3e3] border border-[#ff9999] text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {importStatus && (
          <div className="mb-4 p-3 bg-[#e6f4ea] border border-[#a8dab5] text-emerald-700 rounded-xl text-xs flex items-center gap-2">
            <Check size={16} className="shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Export Box */}
          <div className="bg-[#fcf8f0] p-4 rounded-xl border-2 border-dashed border-[#d4c5ab]">
            <h3 className="text-sm font-bold text-[#6e5d43] mb-1">📥 현재 일정 CSV로 내보내기</h3>
            <p className="text-xs text-[#8c7853] mb-3">등록된 모든 팀원 일정을 CSV 파일로 다운로드합니다.</p>
            <button
              onClick={handleExportCsv}
              className="sketch-button px-4 py-2 bg-[#d6e4ff] hover:bg-[#adc6ff] text-[#1d39c4] text-xs font-bold flex items-center gap-1.5"
            >
              <Download size={16} /> CSV 다운로드
            </button>
          </div>

          {/* Import & Accumulate Box */}
          <div className="bg-[#fcf8f0] p-4 rounded-xl border-2 border-dashed border-[#d4c5ab]">
            <h3 className="text-sm font-bold text-[#6e5d43] mb-1">📤 CSV 파일 업로드 및 누적 저장</h3>
            <p className="text-xs text-[#8c7853] mb-3">기존 일정에 누적하여 추가할 CSV 파일을 선택해주세요.</p>
            <label className="sketch-button inline-flex items-center gap-1.5 px-4 py-2 bg-[#d9f7be] hover:bg-[#b7eb8f] text-[#237804] text-xs font-bold cursor-pointer">
              <Upload size={16} /> CSV 파일 선택 및 누적 저장
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="sketch-button px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
