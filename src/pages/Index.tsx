import { ArrowRight, Sparkles, Users, Zap, Target, Clock, Shield, ChevronRight, CheckCircle2, Star, Calendar, Mail, ListChecks, Briefcase, HeartHandshake, TrendingUp, Home, ShoppingBag, Building2, Check, Crown, Diamond, Gem, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
            <Diamond className="w-4 h-4" />
            White-Glove Virtual Assistance
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-center font-display font-bold text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6 animate-slide-up">
          Your Time is Precious.<br />
          <span className="text-gradient">We Guard It.</span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg md:text-xl text-primary-foreground/70 max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Experience bespoke virtual assistance crafted for discerning individuals. Our curated professionals seamlessly integrate into your life—managing the details so you can focus on what truly matters.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button variant="hero" size="xl">
            Request a Consultation
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="heroOutline" size="xl">
            Explore Our Services
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { number: "10K+", label: "Hours Reclaimed" },
            { number: "98%", label: "Client Satisfaction" },
            { number: "500+", label: "Elite Clients" },
            { number: "Same Day", label: "Onboarding" },
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
    { icon: ListChecks, text: "Curated life & task management" },
    { icon: Target, text: "Goal-aligned productivity" },
    { icon: Shield, text: "Vetted elite professionals" },
    { icon: Briefcase, text: "Specialist access on demand" },
    { icon: TrendingUp, text: "Effortless scaling" },
    { icon: CheckCircle2, text: "Guaranteed excellence" },
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
      title: "Executive Scheduling",
      description: "Masterful calendar orchestration, travel arrangements, and appointment curation tailored to your rhythm.",
    },
    {
      icon: Mail,
      title: "Communication Concierge",
      description: "Thoughtful inbox stewardship, correspondence drafting, and priority-based communication management.",
    },
    {
      icon: Home,
      title: "Lifestyle Management",
      description: "Seamless handling of personal affairs—from household coordination to bespoke research and procurement.",
    },
    {
      icon: Target,
      title: "Achievement Partnership",
      description: "Dedicated accountability support, milestone tracking, and strategic progress reporting aligned with your vision.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Concierge Services</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            An Invisible Hand, Impeccable Results
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our distinguished professionals operate as a seamless extension of your world—anticipating needs, executing flawlessly, and elevating every aspect of your daily life.
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
    { icon: TrendingUp, title: "Marketing Virtuoso", description: "Brand elevation & campaigns" },
    { icon: Building2, title: "Property Concierge", description: "Real estate excellence" },
    { icon: ShoppingBag, title: "Commerce Specialist", description: "E-commerce mastery" },
    { icon: Briefcase, title: "Executive Partner", description: "C-suite level support" },
    { icon: Users, title: "Operations Architect", description: "Systems & efficiency" },
    { icon: HeartHandshake, title: "Client Relations", description: "Relationship cultivation" },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Specialist Network</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Expertise on Demand
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              As your ambitions expand, access our exclusive network of domain specialists. Each expert is meticulously selected, rigorously vetted, and prepared to deliver exceptional results in their field of mastery.
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
                  <Crown className="w-8 h-8 text-navy" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Tailored to You</h3>
                <p className="text-muted-foreground">Bespoke support that evolves</p>
              </div>
              
              <div className="space-y-4">
                {[
                  "Begin with personal concierge",
                  "Add specialists as you grow",
                  "Flexible, commitment-free",
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

const Pricing = () => {
  const plans = [
    {
      name: "Personal",
      icon: Gem,
      price: "$997",
      period: "/month",
      description: "Essential concierge support for the discerning individual",
      features: [
        "20 hours of dedicated support",
        "Personal task management",
        "Calendar & scheduling",
        "Email management",
        "Basic research & procurement",
        "48-hour response guarantee",
        "Weekly progress reports",
      ],
      cta: "Begin Your Journey",
      popular: false,
    },
    {
      name: "Professional",
      icon: Crown,
      price: "$2,497",
      period: "/month",
      description: "Elevated support with access to our specialist network",
      features: [
        "50 hours of dedicated support",
        "Everything in Personal, plus:",
        "Access to niche specialists",
        "Advanced project management",
        "Goal tracking & accountability",
        "Priority 24-hour response",
        "Bi-weekly strategy calls",
        "Dedicated account liaison",
      ],
      cta: "Elevate Your Experience",
      popular: true,
    },
    {
      name: "Premium",
      icon: Diamond,
      price: "$4,997",
      period: "/month",
      description: "The ultimate white-glove experience with a dedicated team",
      features: [
        "Unlimited dedicated support",
        "Everything in Professional, plus:",
        "Dedicated team of 2-3 VAs",
        "Personal account manager",
        "Same-day priority handling",
        "24/7 availability",
        "Weekly executive briefings",
        "Quarterly strategy sessions",
        "Concierge-level service",
      ],
      cta: "Experience Excellence",
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Investment</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Choose Your Level of Support
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each tier is crafted to deliver exceptional value, with the flexibility to evolve as your needs grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-navy border-gold shadow-glow"
                  : "bg-card border-border shadow-card hover:border-gold/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-gold text-navy text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-14 h-14 rounded-xl mx-auto flex items-center justify-center mb-4 ${
                  plan.popular ? "bg-gold/20" : "bg-gold/10"
                }`}>
                  <plan.icon className={`w-7 h-7 ${plan.popular ? "text-gold" : "text-gold"}`} />
                </div>
                <h3 className={`font-display text-2xl font-bold mb-2 ${
                  plan.popular ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-display font-bold ${
                    plan.popular ? "text-gold" : "text-foreground"
                  }`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.popular ? "text-gold" : "text-gold"
                    }`} />
                    <span className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "gold"}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-12">
          All plans include a 14-day satisfaction guarantee. No long-term contracts required.
        </p>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Discovery Consultation",
      description: "Share your vision, lifestyle, and aspirations in a private consultation with our team.",
    },
    {
      number: "02",
      title: "Curated Matching",
      description: "We handpick the ideal professional from our elite network, aligned perfectly with your needs.",
    },
    {
      number: "03",
      title: "Seamless Onboarding",
      description: "Your assistant integrates effortlessly into your tools, routines, and preferences.",
    },
    {
      number: "04",
      title: "Ongoing Excellence",
      description: "Focus on your ambitions while we ensure flawless execution and continuous refinement.",
    },
  ];

  return (
    <section className="py-24 bg-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">The Experience</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mt-3 mb-4">
            Your Journey to Freedom
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            A refined process designed to deliver exceptional support from the very first day.
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

const FAQ = () => {
  const faqs = [
    {
      question: "How quickly can I get started with a virtual assistant?",
      answer: "Our streamlined onboarding process typically takes just 24-48 hours. After your discovery consultation, we match you with an ideal assistant and begin integration immediately. Most clients are fully operational within the first week.",
    },
    {
      question: "What makes your VAs different from freelance platforms?",
      answer: "Every professional in our network undergoes rigorous vetting, including skills assessment, background verification, and cultural fit evaluation. More importantly, they are agency-managed—meaning we handle training, quality assurance, performance tracking, and any necessary replacements, ensuring consistent excellence.",
    },
    {
      question: "How does pricing work, and are there any hidden fees?",
      answer: "Our pricing is transparent and all-inclusive. Your monthly investment covers dedicated hours, management oversight, tools access, and our satisfaction guarantee. There are no setup fees, hidden costs, or long-term contracts required.",
    },
    {
      question: "Can I upgrade or downgrade my plan as my needs change?",
      answer: "Absolutely. Our service is designed to evolve with you. Upgrade to access more hours or specialist support, or adjust down during quieter periods. Changes take effect at your next billing cycle with no penalties.",
    },
    {
      question: "How do niche specialists work within the service?",
      answer: "Starting from our Professional tier, you gain access to our curated network of domain experts. Simply request support in areas like marketing, real estate, or operations, and we match you with a vetted specialist. They integrate seamlessly with your primary assistant for cohesive support.",
    },
    {
      question: "What happens if I am not satisfied with my assistant?",
      answer: "Your satisfaction is paramount. If your assistant is not meeting expectations, we work swiftly to address concerns. If a replacement is needed, we provide one at no additional cost. Our 14-day satisfaction guarantee ensures you can start risk-free.",
    },
    {
      question: "What tools and platforms do your assistants use?",
      answer: "Our professionals are proficient across all major productivity platforms—including Google Workspace, Microsoft 365, Slack, Notion, Asana, Monday.com, and many more. They adapt to your existing tech stack, ensuring seamless integration from day one.",
    },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Questions & Answers</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Clarity and transparency are at the heart of our service.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-gold/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-gold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The level of discretion and professionalism is unparalleled. They anticipated my needs before I even voiced them.",
      author: "Victoria S.",
      role: "Private Investor",
      rating: 5,
    },
    {
      quote: "Transitioning from chaos to calm was seamless. My assistant has become indispensable to both my business and personal life.",
      author: "Jonathan R.",
      role: "Tech Founder & CEO",
      rating: 5,
    },
    {
      quote: "Finally, a service that understands the demands of a high-performance lifestyle. The ROI has been extraordinary.",
      author: "Alexandra M.",
      role: "Managing Partner, Law Firm",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Client Experiences</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Trusted by the Exceptional
          </h2>
          <p className="text-muted-foreground text-lg">Hear from those who have transformed their lives.</p>
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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="relative bg-hero rounded-3xl p-12 md:p-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
          
          <div className="relative text-center max-w-3xl mx-auto">
            <Diamond className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Reclaim Your Time?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8">
              Join an exclusive community of individuals who refuse to compromise on quality. Your journey to effortless excellence begins with a single conversation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl">
                Schedule Your Consultation
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
              White-glove virtual assistance for discerning individuals. We guard your time so you can focus on what truly matters.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {["Personal Concierge", "Lifestyle Management", "Specialist Network", "Executive Support"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Our Process", "Pricing", "Contact"].map((item, index) => (
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
            {["Services", "Specialists", "Pricing", "FAQ"].map((item, index) => (
              <a key={index} href="#" className="text-primary-foreground/70 hover:text-gold transition-colors text-sm font-medium">
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="heroOutline" size="sm" className="hidden sm:flex">
              Client Login
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
      <Pricing />
      <HowItWorks />
      <FAQ />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
