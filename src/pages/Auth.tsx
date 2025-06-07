
import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Bot className="h-12 w-12 text-blue-600" />
            <Sparkles className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-4">
            မြန်မာ Social Media Content Writer
          </h1>
          <p className="text-lg text-gray-600">
            {isLogin ? 'သင့်အကောင့်သို့ ဝင်ရောက်ပါ' : 'အကောင့်သစ်ဖွင့်ပါ'}
          </p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;
