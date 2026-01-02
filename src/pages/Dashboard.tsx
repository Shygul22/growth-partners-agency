import { useState, useEffect } from "react";
import { User, CreditCard, Clock, Calendar, Settings, LogOut, ChevronRight, Crown, TrendingUp, CheckCircle2, Edit, Plus, Shield, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import ProfileEditor from "@/components/ProfileEditor";
import TaskRequestForm from "@/components/TaskRequestForm";
import QuickActions from "@/components/QuickActions";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  hours_included: number;
  hours_used: number;
  price: number;
  billing_cycle: string;
  next_billing_date: string | null;
}

interface ServiceHistory {
  id: string;
  service_name: string;
  description: string | null;
  hours_used: number;
  date: string;
  status: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "subscription" | "new-task" | "settings">("overview");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) return;
    const { data } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    setIsAdmin(data === true);
  };

  const fetchUserData = async () => {
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    
    if (profileData) setProfile(profileData);

    // Fetch subscription
    const { data: subData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (subData) setSubscription(subData);

    // Fetch service history
    const { data: historyData } = await supabase
      .from("service_history")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(10);
    
    if (historyData) setServiceHistory(historyData);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </main>
    );
  }

  if (!user) return null;

  const hoursUsed = subscription?.hours_used || 0;
  const hoursIncluded = subscription?.hours_included || 20;
  const hoursRemaining = Math.max(0, hoursIncluded - hoursUsed);
  const usagePercentage = (hoursUsed / hoursIncluded) * 100;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-navy border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 px-3 py-1.5 bg-gold/20 text-gold text-xs font-medium rounded hover:bg-gold/30 transition-colors">
                  <Shield className="w-3 h-3" />
                  Admin
                </Link>
              )}
              <span className="text-primary-foreground/60 text-sm hidden md:block">
                {profile?.full_name || user.email}
              </span>
              <Button variant="heroOutline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-gold" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  {subscription?.plan || "Personal"} Plan
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: TrendingUp },
                  { id: "new-task", label: "New Task", icon: Plus },
                  { id: "history", label: "Service History", icon: Clock },
                  { id: "subscription", label: "Subscription", icon: CreditCard },
                  { id: "settings", label: "Settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-gold/10 text-gold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {item.id === "new-task" && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-gold animate-pulse" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Welcome Banner */}
                <div className="bg-hero rounded-2xl p-8 text-primary-foreground">
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, {profile?.full_name?.split(" ")[0] || "there"}!
                  </h1>
                  <p className="text-primary-foreground/70">
                    Here's an overview of your account and recent activity.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">Hours Remaining</span>
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground mb-2">
                      {hoursRemaining}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, 100 - usagePercentage)}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs mt-2">
                      {hoursUsed} of {hoursIncluded} hours used
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">Current Plan</span>
                      <Crown className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground mb-2">
                      {subscription?.plan || "Personal"}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      ${subscription?.price || 15}/month
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">Account Status</span>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground mb-2 capitalize">
                      {subscription?.status || "Active"}
                    </div>
                    {subscription?.next_billing_date && (
                      <p className="text-muted-foreground text-sm">
                        Next billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold text-foreground">Recent Activity</h3>
                    <button
                      onClick={() => setActiveTab("history")}
                      className="text-gold text-sm hover:underline flex items-center gap-1"
                    >
                      View all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {serviceHistory.length > 0 ? (
                    <div className="space-y-4">
                      {serviceHistory.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{item.service_name}</p>
                            <p className="text-muted-foreground text-sm">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-foreground font-medium">{item.hours_used}h</p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No service history yet</p>
                      <p className="text-sm">Your completed tasks will appear here</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "new-task" && (
              <div className="space-y-6">
                <div className="bg-hero rounded-2xl p-8 text-primary-foreground">
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    Request a New Task
                  </h1>
                  <p className="text-primary-foreground/70">
                    Tell us what you need help with and we'll get started right away.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <QuickActions onActionClick={(action) => console.log(action)} />
                </div>

                {/* Task Request Form */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-6">Submit a Task</h3>
                  <TaskRequestForm onSubmit={() => setActiveTab("overview")} />
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Service History</h3>
                {serviceHistory.length > 0 ? (
                  <div className="space-y-4">
                    {serviceHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{item.service_name}</p>
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-medium">{item.hours_used}h</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "completed" ? "bg-green-500/10 text-green-500" : "bg-gold/10 text-gold"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No service history yet</p>
                    <p className="text-sm">Once you start using our services, your history will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">Your Subscription</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Current Plan</p>
                      <p className="text-2xl font-display font-bold text-foreground">{subscription?.plan || "Personal"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Monthly Price</p>
                      <p className="text-2xl font-display font-bold text-foreground">${subscription?.price || 15}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Hours Included</p>
                      <p className="text-2xl font-display font-bold text-foreground">{subscription?.hours_included || 20}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Status</p>
                      <p className="text-2xl font-display font-bold text-foreground capitalize">{subscription?.status || "Active"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cream rounded-xl border border-border p-6">
                  <h4 className="font-display text-lg font-semibold text-foreground mb-4">Upgrade Your Plan</h4>
                  <p className="text-muted-foreground mb-4">
                    Get more hours and access to our specialist network by upgrading your plan.
                  </p>
                  <Link to="/pricing">
                    <Button variant="gold">
                      View Plans <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">Account Settings</h3>
                </div>
                {profile && (
                  <ProfileEditor
                    profile={{ ...profile, email: user.email }}
                    onUpdate={fetchUserData}
                    onCancel={() => setActiveTab("overview")}
                  />
                )}
                <div className="mt-6 pt-6 border-t border-border">
                  <Button variant="heroOutline" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
