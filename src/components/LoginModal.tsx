import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, KeyRound, Sparkles, UserCheck, AlertCircle, Database, CheckCircle2, ShieldCheck } from 'lucide-react';

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

  // Inline Supabase configuration state if not yet configured
  const [showConfigInput, setShowConfigInput] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(localStorage.getItem('SUPABASE_URL_OVERRIDE') || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(localStorage.getItem('SUPABASE_KEY_OVERRIDE') || '');

  const isSupabaseActive = supabase !== null;

  const handleSaveInlineConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput || !supabaseKeyInput) {
      setErrorMsg('Supabase URL과 Key를 모두 입력해주세요.');
      return;
    }
    localStorage.setItem('SUPABASE_URL_OVERRIDE', supabaseUrlInput.trim());
    localStorage.setItem('SUPABASE_KEY_OVERRIDE', supabaseKeyInput.trim());
    setShowConfigInput(false);
    setSuccessMsg('Supabase 설정이 저장되었습니다. 페이지를 새로고침합니다.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!supabase) {
      if (email && password.length >= 4) {
        localStorage.setItem('sketch_user_session', email);
        onLoginSuccess(email);
        return;
      } else {
        setErrorMsg('Supabase가 연결되지 않았습니다. (데모 모드: 비밀번호 4자리 이상 입력 시 체험 가능)');
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
        setSuccessMsg('회원가입 완료! 이메일 인증 또는 바로 로그인이 가능합니다.');
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

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    if (!supabase) {
      setErrorMsg('Supabase가 설정되어야 소셜 로그인을 사용할 수 있습니다.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || `${provider} 로그인 중 오류가 발생했습니다.`);
    }
  };

  const handleDemoLogin = () => {
    const demoEmail = 'squirrel_admin@company.com';
    localStorage.setItem('sketch_user_session', demoEmail);
    onLoginSuccess(demoEmail);
  };

  return (
    <div className="fixed inset-0 bg-[#fdfbf7]/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="sketch-card bg-[#fffefc] w-full max-w-md p-8 relative shadow-xl border-2 border-[#d4c5ab]">
        {/* Cute Icon header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-bounce">🐿️🌰</div>
          <h1 className="text-2xl font-bold font-sketch text-[#594a32]">
            다람쥐 스케치북 팀 일정표
          </h1>
          <p className="text-xs text-[#8c7853] mt-1 font-sketch">
            사내 인가된 팀원 전용 Supabase 인증 로그인
          </p>
        </div>

        {/* Supabase Connection Status Banner */}
        <div className={`mb-4 p-3 rounded-xl text-xs flex items-center justify-between border ${
          isSupabaseActive 
            ? 'bg-[#e6f4ea] border-[#a8dab5] text-emerald-800' 
            : 'bg-[#fff8e7] border-[#ffe58f] text-[#874d00]'
        }`}>
          <div className="flex items-center gap-2">
            <Database size={16} className="shrink-0" />
            <span>{isSupabaseActive ? 'Supabase DB 연결됨' : 'Supabase 미설정 (데모 모드)'}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowConfigInput(!showConfigInput)}
            className="font-bold underline hover:opacity-80"
          >
            {showConfigInput ? '접기' : '설정하기'}
          </button>
        </div>

        {/* Inline Supabase Config Form if toggled */}
        {showConfigInput && (
          <form onSubmit={handleSaveInlineConfig} className="mb-4 p-3 bg-[#fcf8f0] rounded-xl border border-[#d4c5ab] space-y-2 text-xs">
            <div className="font-bold text-[#594a32]">Supabase 프로젝트 설정</div>
            <div>
              <label className="block text-[11px] text-[#7a6b52] mb-0.5">Project URL</label>
              <input
                type="text"
                value={supabaseUrlInput}
                onChange={(e) => setSupabaseUrlInput(e.target.value)}
                placeholder="https://xxx.supabase.co"
                className="sketch-input w-full px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#7a6b52] mb-0.5">Anon Key</label>
              <input
                type="password"
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                placeholder="eyJhbGci..."
                className="sketch-input w-full px-2 py-1 text-xs"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="sketch-button px-3 py-1 bg-[#ffe8a3] text-[#874d00] font-bold text-xs"
              >
                저장 및 적용
              </button>
            </div>
          </form>
        )}

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

        {/* Email/Password Auth Form */}
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
            {loading ? '처리 중...' : isSignUp ? 'Supabase 회원가입' : 'Supabase 로그인하기'}
          </button>
        </form>

        {/* Supabase OAuth Social Login Buttons */}
        {isSupabaseActive && (
          <div className="mt-4 space-y-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#e3d5b8]"></div>
              <span className="flex-shrink mx-4 text-[11px] text-[#9c8b70]">또는 소셜 계정으로 로그인</span>
              <div className="flex-grow border-t border-[#e3d5b8]"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="sketch-button py-2 px-3 bg-white hover:bg-gray-50 text-[#594a32] text-xs font-bold flex items-center justify-center gap-2 border border-[#d4c5ab]"
              >
                🌐 구글(Google) 로그인
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="sketch-button py-2 px-3 bg-[#24292e] hover:bg-[#2f363d] text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                🐙 깃허브(GitHub) 로그인
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-[#8c7853]">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="hover:underline font-bold"
          >
            {isSignUp ? '← 로그인으로 돌아가기' : '✨ Supabase 회원가입'}
          </button>
          
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-emerald-700 font-bold hover:underline bg-[#e6f4ea] px-2 py-1 rounded-lg"
          >
            🚀 데모 체험 로그인
          </button>
        </div>

        {/* Supabase Config Setup Modal Trigger */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#e3d5b8] text-center">
          <button
            type="button"
            onClick={onOpenSupabaseSetup}
            className="text-xs text-[#7a6b52] hover:text-[#594a32] flex items-center justify-center gap-1 mx-auto font-bold"
          >
            <Database size={14} /> 전체 Supabase SQL 및 설정 가이드 보기
          </button>
        </div>
      </div>
    </div>
  );
}

