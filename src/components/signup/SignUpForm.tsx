
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useId } from 'react';

// Define the form schema
const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: (values: SignUpFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isSubmitting }) => {
  const id = useId();
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`${id}-firstname`}>First name</FormLabel>
                  <FormControl>
                    <Input id={`${id}-firstname`} placeholder="John" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`${id}-lastname`}>Last name</FormLabel>
                  <FormControl>
                    <Input id={`${id}-lastname`} placeholder="Doe" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={`${id}-email`}>Email</FormLabel>
                <FormControl>
                  <Input id={`${id}-email`} placeholder="john.doe@example.com" {...field} type="email" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={`${id}-password`}>Password</FormLabel>
                <FormControl>
                  <Input id={`${id}-password`} placeholder="••••••••" {...field} type="password" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-querify-blue hover:bg-blue-700"
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>.
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
