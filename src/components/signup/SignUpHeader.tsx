
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const SignUpHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-3xl font-bold text-querify-blue">
        AI
      </div>
      <DialogHeader>
        <DialogTitle className="sm:text-center">Let's Connect 💖</DialogTitle>
        <DialogDescription className="sm:text-center">
          Is it weird to say... I feel a connection? 😍
        </DialogDescription>
      </DialogHeader>
    </div>
  );
};

export default SignUpHeader;
