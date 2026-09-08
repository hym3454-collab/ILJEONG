import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, KeyRound, Sparkles, UserCheck, AlertCircle, Database } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (userEmail: string) => void;
  onOpenSupabaseSetup: () => void;
}

export function LoginModal({ onLoginSuccess, onOpenSupabaseSetup }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!supabase) {
      // Demo mode fallback if Supabase is not configured
      if (email && password.length >= 4) {
        localStorage.setItem('sketch_user_session', email);
        onLoginSuccess(email);
        return;
      } else {
        setErrorMsg('Supabase가 설정되지 않았습니다. 데모 로그인은 비밀번호 4자리 이상 입력해주세요.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('회원가입이 완료되었습니다! 로그인해주세요.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          localStorage.setItem('sketch_user_session', data.user.email || email);
          onLoginSuccess(data.user.email || email);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoEmail = 'squirrel_admin@company.com';
    localStorage.setItem('sketch_user_session', demoEmail);
    onLoginSuccess(demoEmail);
  };

  return (
    <div className="fixed inset-0 bg-[#fdfbf7]/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="sketch-card bg-[#fffefc] w-full max-w-md p-8 relative shadow-xl border-2 border-[#d4c5ab]">
        {/* Cute Icon header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-bounce">🐿️🌰</div>
          <h1 className="text-2xl font-bold font-sketch text-[#594a32]">
            다람쥐 스케치북 팀 일정표
          </h1>
          <p className="text-xs text-[#8c7853] mt-1 font-sketch">
            사내 인가된 팀원 전용 로그인 화면입니다.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#ffe3e3] border border-[#ff9999] text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-[#e6f4ea] border border-[#a8dab5] text-emerald-700 rounded-xl text-xs flex items-center gap-2">
            <UserCheck size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#7a6b52]">사내 이메일 계정</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-[#b5a48b]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="sketch-input w-full pl-10 pr-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#7a6b52]">비밀번호</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 text-[#b5a48b]" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="sketch-input w-full pl-10 pr-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sketch-button w-full py-3 bg-[#ffe8a3] hover:bg-[#ffd166] text-[#874d00] font-bold text-base shadow-sm flex items-center justify-center gap-2"
          >
            <UserCheck size={18} />
            {loading ? '처리 중...' : isSignUp ? '회원가입 요청' : '로그인하기'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-[#8c7853]">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="hover:underline font-bold"
          >
            {isSignUp ? '← 로그인 화면으로 돌아가기' : '✨ 사내 계정 회원가입'}
          </button>
          
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-emerald-700 font-bold hover:underline bg-[#e6f4ea] px-2 py-1 rounded-lg"
          >
            🚀 데모 체험 로그인
          </button>
        </div>

        {/* Supabase Config Button */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#e3d5b8] text-center">
          <button
            type="button"
            onClick={onOpenSupabaseSetup}
            className="text-xs text-[#7a6b52] hover:text-[#594a32] flex items-center justify-center gap-1 mx-auto font-bold"
          >
            <Database size={14} /> Supabase DB 및 환경설정 가이드 보기
          </button>
        </div>
      </div>
    </div>
  );
}
