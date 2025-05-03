
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email');
  const navigate = useNavigate();
  const { user, registerUser } = useQuerify();
  
  const [email, setEmail] = useState(emailFromUrl || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/ask');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Register user in our context
        registerUser({
          fullName,
          email,
          phone: ''
        });
        
        // Call the mark-paid function to set the user as paid
        const { error: markPaidError } = await supabase.functions.invoke('mark-paid', {
          body: {
            email,
            user_id: data.user.id
          }
        });
        
        if (markPaidError) {
          console.error('Error marking user as paid:', markPaidError);
          toast.error('Account created, but payment status could not be verified');
        } else {
          toast.success('Account created and verified! You now have access.');
        }
        
        // Redirect to ask page
        navigate('/ask');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-querify-blue">Complete Your Registration</h1>
          <p className="mt-2 text-gray-600">
            Thanks for your payment! Create your account to access AIgentDesk.
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-querify-blue hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate('/welcome')}>
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
