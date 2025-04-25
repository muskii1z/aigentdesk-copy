
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SignUpFormSectionProps {
  id: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isPaid: boolean;
}

const SignUpFormSection: React.FC<SignUpFormSectionProps> = ({
  id,
  handleSubmit,
  isSubmitting,
  isPaid,
}) => (
  <form onSubmit={handleSubmit} className="space-y-5">
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>Full name</Label>
        <Input
          id={`${id}-name`}
          name="name"
          placeholder="John Doe"
          type="text"
          required
          disabled={isSubmitting || !isPaid}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input
          id={`${id}-email`}
          name="email"
          placeholder="john@example.com"
          type="email"
          required
          disabled={isSubmitting || !isPaid}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          id={`${id}-password`}
          name="password"
          placeholder="••••••••"
          type="password"
          required
          minLength={6}
          disabled={isSubmitting || !isPaid}
        />
      </div>
    </div>
    <Button
      type="submit"
      className="w-full bg-querify-blue hover:bg-blue-700"
      disabled={isSubmitting || !isPaid}
    >
      {isSubmitting
        ? "Creating account..."
        : isPaid
          ? "Sign up"
          : "Pay to unlock sign up"}
    </Button>
    {!isPaid && (
      <div className="text-center text-sm text-blue-700 font-semibold bg-blue-50 rounded px-3 py-2 mt-2">
        Please pay for full access to enable registration.
      </div>
    )}
  </form>
);

export default SignUpFormSection;

