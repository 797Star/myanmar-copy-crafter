
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface SignUpFormProps {
  onToggleMode: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      setError('အီးမေးလ်နှင့် လျှို့ဝှက်နံပါတ် လိုအပ်ပါသည်။');
      return;
    }

    // Clear previous non-critical errors before new validation
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('လျှို့ဝှက်နံပါတ်သည် အနည်းဆုံး ၆ လုံး ရှိရမည်။');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Sign up form submitting...');
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        console.error('Sign up error:', error);
        if (error.message?.includes('User already registered')) {
          setError('ဤအီးမေးလ်ဖြင့် အကောင့်ရှိပြီးသားဖြစ်ပါသည်။');
        } else if (error.message?.includes('Password should be')) {
          setError('လျှို့ဝှက်နံပါတ်သည် အနည်းဆုံး ၆ လုံး ရှိရမည်။');
        } else {
          setError(error.message || 'စာရင်းသွင်းရာတွင် အမှားရှိပါသည်။');
        }
      } else {
        console.log('Sign up successful');
        setMessage('စာရင်းသွင်းမှု အောင်မြင်ပါသည်! ကျေးဇူးပြု၍ သင့်အီးမေးလ်ကို စစ်ဆေးပါ။');
        // Clear form
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (err) {
      console.error('Sign up exception:', err);
      setError('စာရင်းသွင်းရာတွင် အမှားရှိပါသည်။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ။');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">စာရင်းသွင်းမည်</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">အမည်</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="သင့်အမည်"
              disabled={loading}
            />
          </div>
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
              minLength={6}
            />
            {/* Password hint can remain or be removed if error message is preferred */}
            <p className="text-sm text-muted-foreground mt-1">အနည်းဆုံး ၆ လုံး ရှိရမည်။</p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert variant="success">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'စာရင်းသွင်းနေသည်...' : 'စာရင်းသွင်းမည်'}
          </Button>
          
          <Button 
            type="button" 
            variant="link" 
            className="w-full"
            onClick={onToggleMode}
            disabled={loading}
          >
            အကောင့်ရှိပြီးသားလား? လော့ဂ်အင်
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
