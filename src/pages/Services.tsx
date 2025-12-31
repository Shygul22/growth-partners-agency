import { Calendar, Mail, Home, Target, TrendingUp, Building2, ShoppingBag, Briefcase, Users, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  const coreServices = [
    {
      icon: Calendar,
      title: "Executive Scheduling",
      description: "Masterful calendar orchestration, travel arrangements, and appointment curation tailored to your rhythm.",
      features: ["Calendar management", "Travel coordination", "Meeting preparation", "Time optimization"],
    },
    {
      icon: Mail,
      title: "Communication Concierge",
      description: "Thoughtful inbox stewardship, correspondence drafting, and priority-based communication management.",
      features: ["Email management", "Correspondence drafting", "Priority filtering", "Response coordination"],
    },
    {
      icon: Home,
      title: "Lifestyle Management",
      description: "Seamless handling of personal affairs—from household coordination to bespoke research and procurement.",
      features: ["Personal errands", "Household coordination", "Research & procurement", "Event planning"],
    },
    {
      icon: Target,
      title: "Achievement Partnership",
      description: "Dedicated accountability support, milestone tracking, and strategic progress reporting aligned with your vision.",
      features: ["Goal tracking", "Accountability check-ins", "Progress reports", "Strategic planning"],
    },
  ];

  const specialists = [
    { icon: TrendingUp, title: "Marketing Virtuoso", description: "Brand elevation, campaign management, and digital presence optimization." },
    { icon: Building2, title: "Property Concierge", description: "Real estate research, property management support, and transaction coordination." },
    { icon: ShoppingBag, title: "Commerce Specialist", description: "E-commerce operations, inventory management, and customer experience." },
    { icon: Briefcase, title: "Executive Partner", description: "C-suite level support, board preparation, and executive communications." },
    { icon: Users, title: "Operations Architect", description: "Systems optimization, process documentation, and team coordination." },
    { icon: HeartHandshake, title: "Client Relations", description: "Relationship cultivation, client communication, and retention strategies." },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-lg border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="heroOutline" size="sm">Client Login</Button>
              </Link>
              <Link to="/get-started">
                <Button variant="hero" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-hero">
        <div className="container mx-auto px-6 text-center">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mt-4 mb-6">
            White-Glove Virtual Assistance
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-8">
            From daily task management to specialized expertise, we provide comprehensive support tailored to your unique lifestyle and business needs.
          </p>
          <Link to="/get-started">
            <Button variant="hero" size="xl">
              Schedule Consultation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Concierge Services</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Personal Concierge Excellence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your dedicated assistant handles the details of daily life with discretion and precision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <div key={index} className="bg-card rounded-2xl shadow-card p-8 border border-border hover:border-gold/30 transition-all">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gold" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Specialist Network</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Domain Expertise on Demand
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access our curated network of specialists for specialized tasks and projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((specialist, index) => (
              <div key={index} className="bg-card rounded-xl shadow-card p-6 border border-border hover:border-gold/30 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <specialist.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{specialist.title}</h3>
                <p className="text-muted-foreground text-sm">{specialist.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="bg-hero rounded-3xl p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Experience Excellence?
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
              Let us craft a personalized support solution tailored to your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-started">
                <Button variant="hero" size="xl">Get Started Today</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="heroOutline" size="lg">View Pricing</Button>
              </Link>
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

export default Services;
