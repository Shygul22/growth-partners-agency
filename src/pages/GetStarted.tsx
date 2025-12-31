import { useState } from "react";
import { ArrowRight, CheckCircle2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { z } from "zod";

const consultationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  message: z.string().trim().min(1, "Please tell us about your needs").max(1000, "Message must be less than 1000 characters"),
});

const GetStarted = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = consultationSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone || null,
          message: `[Consultation Request] ${result.data.message}`,
        });

      if (error) throw error;
      
      toast({
        title: "Consultation Requested!",
        description: "We'll reach out within 24 hours to schedule your discovery call.",
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Same-day onboarding available",
    "14-day satisfaction guarantee",
    "No long-term contracts",
    "Flexible, scalable support",
    "Vetted elite professionals",
    "Dedicated account management",
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-lg border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="heroOutline" size="sm">Client Login</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="hero" size="sm">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-hero">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Free Consultation
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mt-4 mb-6">
            Begin Your Transformation
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Schedule a complimentary discovery consultation to explore how our concierge services can elevate your life and business.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            {/* Benefits */}
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Why Choose VA Agency?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join an exclusive community of discerning individuals who refuse to compromise on quality.
              </p>
              
              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-cream rounded-2xl p-6 border border-border">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">What Happens Next?</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-gold font-semibold">1.</span>
                    We'll reach out within 24 hours to schedule your call
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-semibold">2.</span>
                    Discuss your goals and lifestyle in a 30-minute consultation
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold font-semibold">3.</span>
                    Receive a personalized proposal tailored to your needs
                  </li>
                </ol>
              </div>
            </div>

            {/* Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent rounded-3xl transform -rotate-2" />
              <form onSubmit={handleSubmit} className="relative bg-card rounded-3xl shadow-card p-8 md:p-10 border border-border">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Request Your Consultation</h3>
                <p className="text-muted-foreground mb-6">Fill out the form and we'll be in touch shortly.</p>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={`mt-2 bg-background border-border focus:border-gold focus:ring-gold/20 ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`mt-2 bg-background border-border focus:border-gold focus:ring-gold/20 ${errors.email ? "border-destructive" : ""}`}
                    />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground font-medium">Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="mt-2 bg-background border-border focus:border-gold focus:ring-gold/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-foreground font-medium">Tell Us About Your Needs</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What challenges are you facing? What would you like to achieve?"
                      rows={4}
                      className={`mt-2 bg-background border-border focus:border-gold focus:ring-gold/20 resize-none ${errors.message ? "border-destructive" : ""}`}
                    />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Schedule Consultation"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-8">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
          <p className="text-primary-foreground/40 text-sm mt-2">© 2024 VA Agency. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default GetStarted;
