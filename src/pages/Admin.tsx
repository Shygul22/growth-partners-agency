import { useState, useEffect } from "react";
import { Users, CreditCard, BarChart3, Settings, LogOut, ChevronRight, Shield, UserPlus, Activity, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "@/components/AdminNav";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalHoursUsed: number;
}

const Admin = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalHoursUsed: 0,
  });
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "staff" | "settings">("overview");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;
      
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      
      setIsAdmin(data === true);
      setCheckingRole(false);
      
      if (data !== true) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    };

    if (user) {
      checkAdminRole();
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    // Fetch basic stats - in a real app, you'd have admin-only RLS policies
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    
    setStats({
      totalUsers: usersCount || 0,
      activeSubscriptions: Math.floor((usersCount || 0) * 0.8),
      totalRevenue: (usersCount || 0) * 25,
      totalHoursUsed: (usersCount || 0) * 15,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  if (loading || checkingRole) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </main>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <main className="min-h-screen bg-background">
      <AdminNav onSignOut={handleSignOut} />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gold" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">Admin Panel</h2>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "clients", label: "Clients", icon: Users },
                  { id: "staff", label: "Staff", icon: UserPlus },
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
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-border">
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Welcome Banner */}
                <div className="bg-hero rounded-2xl p-8 text-primary-foreground">
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-primary-foreground/70">
                    Manage your team, clients, and business operations.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">Total Users</span>
                      <Users className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">{stats.totalUsers}</div>
                    <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12% this month
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">Active Subscriptions</span>
                      <CreditCard className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">{stats.activeSubscriptions}</div>
                    <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +8% this month
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">Total Revenue</span>
                      <DollarSign className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">${stats.totalRevenue}</div>
                    <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +15% this month
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">Hours Used</span>
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div className="text-3xl font-display font-bold text-foreground">{stats.totalHoursUsed}</div>
                    <p className="text-muted-foreground text-sm mt-1">This month</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link to="/admin/clients">
                      <Button variant="heroOutline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Clients
                      </Button>
                    </Link>
                    <Link to="/admin/staff">
                      <Button variant="heroOutline" className="w-full justify-start">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Manage Staff
                      </Button>
                    </Link>
                    <Button variant="heroOutline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      View Reports
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "clients" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">Client Management</h3>
                  <Link to="/admin/clients">
                    <Button variant="gold" size="sm">
                      View All Clients <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">
                  View and manage all client accounts, subscriptions, and service history.
                </p>
              </div>
            )}

            {activeTab === "staff" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground">Staff Management</h3>
                  <Link to="/admin/staff">
                    <Button variant="gold" size="sm">
                      View All Staff <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">
                  Manage your virtual assistant team, assignments, and performance.
                </p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Admin Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-foreground">Business Settings</h4>
                    <p className="text-muted-foreground text-sm">Configure pricing, plans, and business rules</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-foreground">Notification Settings</h4>
                    <p className="text-muted-foreground text-sm">Manage email templates and notifications</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-foreground">Integration Settings</h4>
                    <p className="text-muted-foreground text-sm">Connect external services and APIs</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;