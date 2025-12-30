import { ArrowRight, Sparkles, Users, Zap, Target, Clock, Shield, ChevronRight, CheckCircle2, Star, Calendar, Mail, ListChecks, Briefcase, HeartHandshake, TrendingUp, Home, ShoppingBag, Building2 } from "lucide-react";
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
            Agency-Managed Personal Support
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-center font-display font-bold text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6 animate-slide-up">
          Your Goals Deserve Focus.<br />
          <span className="text-gradient">We Handle the Rest.</span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg md:text-xl text-primary-foreground/70 max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          We manage your daily tasks and long-term goals through agency-managed virtual assistants—then scale with niche expertise as your needs evolve.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button variant="hero" size="xl">
            Get Your Personal VA
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="heroOutline" size="xl">
            See How It Works
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { number: "10K+", label: "Hours Reclaimed" },
            { number: "98%", label: "Goal Completion" },
            { number: "500+", label: "Happy Clients" },
            { number: "24h", label: "Response Time" },
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

const ValueHighlights = () => {
  const highlights = [
    { icon: ListChecks, text: "Personal task & life admin management" },
    { icon: Target, text: "Goal-focused productivity support" },
    { icon: Shield, text: "Pre-vetted, agency-managed VAs" },
    { icon: Briefcase, text: "Optional niche & industry specialists" },
    { icon: TrendingUp, text: "Scalable support without hiring risk" },
    { icon: CheckCircle2, text: "Consistent execution & accountability" },
  ];

  return (
    <section className="py-16 bg-cream border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {highlights.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-gold" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PersonalSupport = () => {
  const services = [
    {
      icon: Calendar,
      title: "Personal Scheduling",
      description: "Calendar management, appointment booking, travel planning, and daily schedule optimization.",
    },
    {
      icon: Mail,
      title: "Inbox Management",
      description: "Email organization, response drafting, priority filtering, and communication follow-ups.",
    },
    {
      icon: Home,
      title: "Life Administration",
      description: "Bill payments, subscriptions, research tasks, errands coordination, and personal projects.",
    },
    {
      icon: Target,
      title: "Goal & Productivity Support",
      description: "Task tracking, habit accountability, deadline management, and progress reporting.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Personal Support First</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Your Reliable Extension
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From personal scheduling to life administration, our VAs act as a reliable extension of your daily life—completing tasks accurately, on time, and aligned with your goals.
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

const NicheSpecialists = () => {
  const specialists = [
    { icon: TrendingUp, title: "Marketing", description: "Content, social media, campaigns" },
    { icon: Building2, title: "Real Estate", description: "Listings, coordination, CRM" },
    { icon: ShoppingBag, title: "E-Commerce", description: "Orders, inventory, customer service" },
    { icon: Briefcase, title: "Executive", description: "High-level admin & strategy support" },
    { icon: Users, title: "Operations", description: "Process management & workflows" },
    { icon: HeartHandshake, title: "Customer Success", description: "Client relations & retention" },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Specialized Talent</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Niche VAs When You Need Them
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              As your needs grow, we provide access to Niche Virtual Assistants with specialized expertise. Our agency matches you with the right talent—without the burden of hiring, training, or managing.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {specialists.map((specialist, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <specialist.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground">{specialist.title}</h4>
                    <p className="text-muted-foreground text-sm">{specialist.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-3xl transform rotate-3" />
            <div className="relative bg-card rounded-3xl shadow-card p-8 border border-border">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gold mx-auto flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-navy" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Flexible & Scalable</h3>
                <p className="text-muted-foreground">Start personal, scale specialized</p>
              </div>
              
              <div className="space-y-4">
                {[
                  "Start with personal task support",
                  "Add niche specialists as needed",
                  "No long-term contracts required",
                  "Seamless team coordination",
                ].map((item, index) => (
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
      title: "Share Your Goals",
      description: "Tell us about your lifestyle, priorities, and what support you need to stay focused.",
    },
    {
      number: "02",
      title: "We Match Your VA",
      description: "We pair you with a pre-vetted VA trained to align with your personal workflow.",
    },
    {
      number: "03",
      title: "Seamless Integration",
      description: "Your VA integrates with your tools, calendar, and daily routines—fully managed by us.",
    },
    {
      number: "04",
      title: "Focus & Grow",
      description: "Reclaim your time, hit your goals, and scale support as your needs evolve.",
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
            Get started in days, not months. Our streamlined process gets you focused and supported fast.
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
      quote: "I finally have time to focus on what matters. My VA handles everything else seamlessly.",
      author: "Jessica M.",
      role: "Entrepreneur & Founder",
      rating: 5,
    },
    {
      quote: "From inbox chaos to organized calm. The accountability has transformed my productivity.",
      author: "David K.",
      role: "Executive Coach",
      rating: 5,
    },
    {
      quote: "Started with personal support, now have a full team. The scaling process was effortless.",
      author: "Amanda R.",
      role: "Real Estate Investor",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            More Time. Less Stress.
          </h2>
          <p className="text-muted-foreground text-lg">Clear progress toward your goals.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-foreground text-lg mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
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
              Ready to Reclaim Your Time?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8">
              Join hundreds of founders and professionals who trust our agency-managed VAs to support their goals and simplify their lives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl">
                Get Started Today
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="lg">
                Book a Free Consultation
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
              Personal support first, specialized talent when you need it. We help you stay organized, consistent, and focused—so your time is spent on what truly matters.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {["Personal Support", "Life Admin", "Niche Specialists", "Goal Coaching"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "How It Works", "Pricing", "Contact"].map((item, index) => (
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
            {["Personal Support", "Specialists", "How It Works", "Pricing"].map((item, index) => (
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
      <ValueHighlights />
      <PersonalSupport />
      <NicheSpecialists />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
