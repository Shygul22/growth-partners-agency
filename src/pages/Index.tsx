import { ArrowRight, Sparkles, Users, Zap, Target, Clock, Shield, ChevronRight, CheckCircle2, Star, TrendingUp, Headphones, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-navy-light/50 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--gold)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--gold)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Agency-Managed Virtual Talent
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-center font-display font-bold text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6 animate-slide-up">
          Build Smarter.<br />
          <span className="text-gradient">Scale Faster.</span><br />
          Operate Better.
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg md:text-xl text-primary-foreground/70 max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Our Virtual Assistant Agency delivers agency-managed, specialized VA talent designed to support marketing agencies, startups, and growing enterprises.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button variant="hero" size="xl">
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="heroOutline" size="xl">
            View Our Services
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { number: "500+", label: "Active VAs" },
            { number: "98%", label: "Client Retention" },
            { number: "2M+", label: "Hours Delivered" },
            { number: "48h", label: "Avg. Turnaround" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gold mb-1">{stat.number}</div>
              <div className="text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gold/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: Target,
      title: "Marketing Support",
      description: "Campaign management, content creation, social media, and lead generation executed by specialized marketing VAs.",
    },
    {
      icon: Clock,
      title: "Administrative Execution",
      description: "Email management, scheduling, data entry, and document processing with precision and reliability.",
    },
    {
      icon: BarChart3,
      title: "Operations Management",
      description: "Process optimization, project coordination, and workflow automation to streamline your business.",
    },
    {
      icon: Users,
      title: "Scalable Team Extensions",
      description: "Flexible VA teams that grow with your needs—from solo support to full departmental coverage.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Specialized VA Talent for Every Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pre-vetted professionals with industry-specific expertise, structured workflows, and performance-driven execution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 bg-card rounded-2xl shadow-card border border-border hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <service.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Fully Managed",
      description: "Every VA is fully managed, performance-tracked, and aligned with your business goals.",
    },
    {
      icon: Zap,
      title: "Zero Hiring Friction",
      description: "Eliminate hiring friction and reduce operational bottlenecks instantly.",
    },
    {
      icon: TrendingUp,
      title: "Measurable ROI",
      description: "Track performance with clear metrics, faster turnaround, and reliable delivery.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Direct communication channels and dedicated account management.",
    },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              The Agency VA Model
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              By combining the Agency VA Model with specialized virtual support, we ensure consistent, high-quality results—so your business runs efficiently without the overhead of in-house teams.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-3xl transform rotate-3" />
            <div className="relative bg-card rounded-3xl shadow-card p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                  <Users className="w-6 h-6 text-navy" />
                </div>
                <div>
                  <div className="font-display font-semibold text-foreground">Your Dedicated Team</div>
                  <div className="text-sm text-muted-foreground">Always aligned with your goals</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {["Performance Tracking", "Structured Workflows", "Quality Assurance", "Continuous Training"].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Share Your Needs",
      description: "Tell us about your business, challenges, and what support you need.",
    },
    {
      number: "02",
      title: "We Match & Train",
      description: "We match you with pre-vetted VAs and customize training for your workflows.",
    },
    {
      number: "03",
      title: "Seamless Integration",
      description: "Your VAs integrate with your tools and processes, managed by our team.",
    },
    {
      number: "04",
      title: "Scale & Succeed",
      description: "Focus on growth while we handle execution, scaling support as needed.",
    },
  ];

  return (
    <section className="py-24 bg-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">The Process</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Get started in days, not months. Our streamlined process gets you operational fast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gold/50 to-transparent" />
              )}
              <div className="bg-navy-light/50 backdrop-blur-sm rounded-2xl p-8 border border-gold/10 hover:border-gold/30 transition-all">
                <div className="text-4xl font-display font-bold text-gold/20 mb-4">{step.number}</div>
                <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">{step.title}</h3>
                <p className="text-primary-foreground/60">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The VA team has transformed how we operate. We've 3x'd our output without adding headcount.",
      author: "Sarah Chen",
      role: "CEO, TechScale Agency",
      rating: 5,
    },
    {
      quote: "Reliable, professional, and truly integrated with our processes. Best decision we made this year.",
      author: "Marcus Johnson",
      role: "Founder, GrowthLab",
      rating: 5,
    },
    {
      quote: "The management layer is what sets them apart. We get results, not just hours.",
      author: "Emily Rodriguez",
      role: "COO, DigitalFirst Inc",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Trusted by Growing Teams
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-foreground text-lg mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-display font-semibold text-foreground">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="relative bg-hero rounded-3xl p-12 md:p-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
          
          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Scale Your Operations?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8">
              Join hundreds of growing companies that trust our agency-managed VA talent to drive their success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl">
                Schedule a Consultation
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="lg">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-navy py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold text-primary-foreground mb-4">VA Agency</div>
            <p className="text-primary-foreground/60 max-w-md">
              Delivering agency-managed, specialized VA talent designed to support marketing agencies, startups, and growing enterprises.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {["Marketing Support", "Administrative", "Operations", "Team Extensions"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Contact", "Privacy Policy"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-navy-light pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-primary-foreground/40 text-sm">
            © 2024 VA Agency. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "Instagram"].map((social, index) => (
              <a key={index} href="#" className="text-primary-foreground/40 hover:text-gold transition-colors text-sm">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-lg border-b border-gold/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="font-display text-xl font-bold text-primary-foreground">VA Agency</div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Services", "How It Works", "Pricing", "About"].map((item, index) => (
              <a key={index} href="#" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm font-medium">
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="heroOutline" size="sm" className="hidden sm:flex">
              Log In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Index = () => {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <Services />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
