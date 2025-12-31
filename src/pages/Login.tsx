import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login - replace with actual auth logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Login functionality coming soon",
      description: "Client portal is under development. Please contact us for assistance.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-hero flex flex-col">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-lg border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
            <Link to="/get-started">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary-foreground mb-2">
              Client Portal
            </h1>
            <p className="text-primary-foreground/60">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-card p-8 border border-border">
            <div className="space-y-6">
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
                    placeholder="you@example.com"
                    className="pl-10 bg-background border-border focus:border-gold focus:ring-gold/20"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <button type="button" className="text-sm text-gold hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-background border-border focus:border-gold focus:ring-gold/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Not a client yet?{" "}
                <Link to="/get-started" className="text-gold hover:underline font-medium">
                  Get Started
                </Link>
              </p>
            </div>
          </form>

          <p className="text-center text-primary-foreground/40 text-sm mt-8">
            Need help? Contact{" "}
            <a href="mailto:support@vaagency.com" className="text-gold hover:underline">
              support@vaagency.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
