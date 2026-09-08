import React, { useState, useEffect } from 'react';
import { TeamMember, ScheduleCategory, ScheduleItem, ViewMode } from './types';
import { initialMembers, initialCategories, initialSchedules } from './data/initialData';
import { FlyingSquirrels } from './components/FlyingSquirrels';
import { SketchHeader } from './components/SketchHeader';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView';
import { TeamManagerModal } from './components/TeamManagerModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ScheduleModal } from './components/ScheduleModal';
import { LoginModal } from './components/LoginModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { CsvManagerModal } from './components/CsvManagerModal';
import { supabase } from './lib/supabase';

export default function App() {
  // Authentication state
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('sketch_user_session');
  });

  // State with localStorage persistence
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('sketch_team_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [categories, setCategories] = useState<ScheduleCategory[]>(() => {
    const saved = localStorage.getItem('sketch_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('sketch_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Modals state
  const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCsvManagerOpen, setIsCsvManagerOpen] = useState(false);
  const [isSupabaseSetupOpen, setIsSupabaseSetupOpen] = useState(false);

  const [selectedDateForSchedule, setSelectedDateForSchedule] = useState<string>('');
  const [scheduleToEdit, setScheduleToEdit] = useState<ScheduleItem | null>(null);

  // Check Supabase session on mount
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          setUserEmail(session.user.email);
          localStorage.setItem('sketch_user_session', session.user.email);
        }
      });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sketch_team_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('sketch_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sketch_schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Date navigation handlers
  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Team Member CRUD
  const handleAddMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `mem-${Date.now()}`,
    };
    setMembers([...members, newMember]);
  };

  const handleUpdateMember = (updated: TeamMember) => {
    setMembers(members.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('정말 이 팀원을 삭제하시겠습니까? 관련 일정 데이터도 함께 정리됩니다.')) {
      setMembers(members.filter((m) => m.id !== id));
      setSchedules(schedules.filter((s) => s.memberId !== id));
    }
  };

  // Category CRUD
  const handleAddCategory = (catData: Omit<ScheduleCategory, 'id'>) => {
    const newCat: ScheduleCategory = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories([...categories, newCat]);
  };

  const handleUpdateCategory = (updated: ScheduleCategory) => {
    setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  // Schedule CRUD
  const handleAddSchedule = (schData: Omit<ScheduleItem, 'id'>) => {
    const newSch: ScheduleItem = {
      ...schData,
      id: `sch-${Date.now()}`,
    };
    setSchedules([...schedules, newSch]);
  };

  const handleUpdateSchedule = (updated: ScheduleItem) => {
    setSchedules(schedules.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  // CSV Import Accumulation Handler
  const handleImportSchedules = (newSchedules: ScheduleItem[]) => {
    // Accumulate (누적 저장)
    setSchedules((prev) => [...prev, ...newSchedules]);
  };

  const handleOpenAddScheduleForDate = (dateStr: string) => {
    setSelectedDateForSchedule(dateStr);
    setScheduleToEdit(null);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (sch: ScheduleItem) => {
    setScheduleToEdit(sch);
    setSelectedDateForSchedule(sch.startDate);
    setIsScheduleModalOpen(true);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('sketch_user_session');
    setUserEmail(null);
  };

  // If not logged in, show Login Modal
  if (!userEmail) {
    return (
      <div className="min-h-screen sketch-paper relative p-4 flex items-center justify-center">
        <FlyingSquirrels />
        <LoginModal
          onLoginSuccess={(email) => setUserEmail(email)}
          onOpenSupabaseSetup={() => setIsSupabaseSetupOpen(true)}
        />
        <SupabaseSetupModal
          isOpen={isSupabaseSetupOpen}
          onClose={() => setIsSupabaseSetupOpen(false)}
          onSaveConfig={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen sketch-paper relative p-4 sm:p-8 flex flex-col justify-between">
      {/* Flying Squirrels Animation */}
      <FlyingSquirrels />

      <div className="max-w-7xl mx-auto w-full z-10 space-y-6">
        {/* Header */}
        <SketchHeader
          currentDate={currentDate}
          onPrevDate={handlePrevDate}
          onNextDate={handleNextDate}
          onToday={handleToday}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenTeamManager={() => setIsTeamManagerOpen(true)}
          onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
          onOpenAddSchedule={() => {
            setScheduleToEdit(null);
            setSelectedDateForSchedule(new Date().toISOString().split('T')[0]);
            setIsScheduleModalOpen(true);
          }}
          onOpenCsvManager={() => setIsCsvManagerOpen(true)}
          onOpenSupabaseSetup={() => setIsSupabaseSetupOpen(true)}
          userEmail={userEmail}
          onLogout={handleLogout}
        />

        {/* Main Content: Weekly or Monthly View */}
        {viewMode === 'week' ? (
          <WeeklyView
            currentDate={currentDate}
            members={members}
            categories={categories}
            schedules={schedules}
            onAddScheduleForDateAndMember={(dateStr) => {
              handleOpenAddScheduleForDate(dateStr);
            }}
            onEditSchedule={handleOpenEditSchedule}
          />
        ) : (
          <MonthlyView
            currentDate={currentDate}
            members={members}
            categories={categories}
            schedules={schedules}
            onAddScheduleForDate={handleOpenAddScheduleForDate}
            onEditSchedule={handleOpenEditSchedule}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-[#9c8b70] z-10 font-sketch">
        🌰 5살 다람쥐의 스케치북 — 팀원 일정 관리 프로그램 (휴가 / 야간근무 / 출장) ✨ Supabase 인증 및 CSV 누적 저장 연동
      </footer>

      {/* Modals */}
      <TeamManagerModal
        isOpen={isTeamManagerOpen}
        onClose={() => setIsTeamManagerOpen(false)}
        members={members}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
      />

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        members={members}
        categories={categories}
        initialDate={selectedDateForSchedule}
        scheduleToEdit={scheduleToEdit}
        onAddSchedule={handleAddSchedule}
        onUpdateSchedule={handleUpdateSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />

      <CsvManagerModal
        isOpen={isCsvManagerOpen}
        onClose={() => setIsCsvManagerOpen(false)}
        members={members}
        categories={categories}
        schedules={schedules}
        onImportSchedules={handleImportSchedules}
      />

      <SupabaseSetupModal
        isOpen={isSupabaseSetupOpen}
        onClose={() => setIsSupabaseSetupOpen(false)}
        onSaveConfig={() => {}}
      />
    </div>
  );
}
