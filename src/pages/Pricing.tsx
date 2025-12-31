import { Gem, Crown, Diamond, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Personal",
      icon: Gem,
      originalPrice: "$30",
      price: "$15",
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
      trialText: "$6 for 15-day trial",
    },
    {
      name: "Professional",
      icon: Crown,
      originalPrice: "$60",
      price: "$30",
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
      trialText: "$6 for 15-day trial",
    },
    {
      name: "Premium",
      icon: Diamond,
      originalPrice: "$120",
      price: "$60",
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
      trialText: "$6 for 15-day trial",
    },
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
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">Investment</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mt-4 mb-6">
            Choose Your Level of Support
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Each tier is crafted to deliver exceptional value, with the flexibility to evolve as your needs grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
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
                    <plan.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className={`font-display text-2xl font-bold mb-2 ${
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className={`text-lg line-through ${plan.popular ? "text-primary-foreground/40" : "text-muted-foreground/60"}`}>
                      {plan.originalPrice}
                    </span>
                    <span className={`text-4xl font-display font-bold ${
                      plan.popular ? "text-gold" : "text-foreground"
                    }`}>
                      {plan.price}
                    </span>
                    <span className={plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"}>
                      {plan.period}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-gold">
                    {plan.trialText}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold" />
                      <span className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/get-started">
                  <Button
                    variant={plan.popular ? "hero" : "gold"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-12">
            All plans include a 14-day satisfaction guarantee. No long-term contracts required.
          </p>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-8">Find answers to common questions about our services.</p>
          <Link to="/contact">
            <Button variant="gold" size="lg">
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
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

export default Pricing;
