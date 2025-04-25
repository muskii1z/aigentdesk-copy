
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
      {isSubmitting ? "Creating account..." : "Sign up"}
    </Button>
  </form>
);

export default SignUpFormSection;
