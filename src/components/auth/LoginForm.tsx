
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      setError('အီးမေးလ်နှင့် လျှို့ဝှက်နံပါတ် လိုအပ်ပါသည်။');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Login form submitting...');
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        if (error.message?.includes('Invalid login credentials')) {
          setError('အီးမေးလ် သို့မဟုတ် လျှို့ဝှက်နံပါတ် မှားယွင်းနေပါသည်။');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('ကျေးဇူးပြု၍ သင့်အီးမေးလ်ကို အတည်ပြုပါ။');
        } else {
          setError(error.message || 'လော့ဂ်အင်တွင် အမှားရှိပါသည်။');
        }
      } else {
        console.log('Login successful, navigating to home...');
        navigate('/');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('လော့ဂ်အင်တွင် အမှားရှိပါသည်။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ။');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">လော့ဂ်အင်</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">အီးမေးလ်</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password">လျှို့ဝှက်နံပါတ်</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'လော့ဂ်အင်ဝင်နေသည်...' : 'လော့ဂ်အင်'}
          </Button>
          
          <Button 
            type="button" 
            variant="link" 
            className="w-full"
            onClick={onToggleMode}
            disabled={loading}
          >
            အကောင့်မရှိသေးဘူးလား? စာရင်းသွင်းမည်
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
