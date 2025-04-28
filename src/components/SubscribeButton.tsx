
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SubscribeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useQuerify();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start subscription process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={isLoading}
      className="bg-querify-blue hover:bg-blue-700"
    >
      {isLoading ? 'Redirecting...' : 'Subscribe Now'}
    </Button>
  );
};

export default SubscribeButton;
