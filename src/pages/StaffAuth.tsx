import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const StaffAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is staff
        const { data: staffData } = await supabase
          .from("staff")
          .select("id, user_id")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        if (staffData) {
          navigate("/staff/dashboard");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = loginSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // Check if email exists in staff table
      const { data: staffCheck } = await supabase
        .from("staff")
        .select("id, email, user_id")
        .eq("email", formData.email)
        .maybeSingle();

      if (!staffCheck) {
        toast({
          title: "Access Denied",
          description: "This email is not registered as staff. Please contact your administrator.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Sign in
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message === "Invalid login credentials" 
            ? "Invalid email or password. Please try again."
            : error.message,
          variant: "destructive",
        });
      } else {
        // Update staff user_id if not set
        if (!staffCheck.user_id && authData.user) {
          await supabase
            .from("staff")
            .update({ user_id: authData.user.id })
            .eq("id", staffCheck.id);
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/staff/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-hero flex items-center justify-center">
        <div className="text-primary-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hero flex flex-col">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-lg border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
            <Link to="/auth">
              <Button variant="heroOutline" size="sm">Client Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-card p-8 border border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-gold" />
              </div>
              <h1 className="font-display text-3xl font-bold text-primary-foreground mb-2">
                Staff Portal
              </h1>
              <p className="text-primary-foreground/60">
                Sign in to access your assignments
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="staff@vaagency.com"
                      className={`pl-10 bg-background border-border focus:border-gold focus:ring-gold/20 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 bg-background border-border focus:border-gold focus:ring-gold/20 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Are you a client?{" "}
                <Link to="/auth" className="text-gold hover:underline font-medium">
                  Client Login
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-primary-foreground/40 text-sm mt-8">
            Need help? Contact your administrator or{" "}
            <a href="mailto:admin@vaagency.com" className="text-gold hover:underline">
              admin@vaagency.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default StaffAuth;
