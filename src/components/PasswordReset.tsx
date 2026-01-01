import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
});

interface PasswordResetProps {
  onBack: () => void;
}

const PasswordReset = ({ onBack }: PasswordResetProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-primary-foreground mb-2">Check Your Email</h2>
        <p className="text-primary-foreground/60 mb-6">
          We've sent password reset instructions to <span className="text-gold">{email}</span>
        </p>
        <Button variant="heroOutline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-gold" />
        </div>
        <h2 className="font-display text-2xl font-bold text-primary-foreground mb-2">Reset Password</h2>
        <p className="text-primary-foreground/60">
          Enter your email and we'll send you instructions to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="reset-email" className="text-foreground font-medium">Email Address</Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              className={`pl-10 bg-background border-border focus:border-gold focus:ring-gold/20 ${error ? "border-destructive" : ""}`}
            />
          </div>
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
};

export default PasswordReset;