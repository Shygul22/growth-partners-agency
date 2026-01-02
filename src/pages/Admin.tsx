import { useState, useEffect } from "react";
import { Users, CreditCard, BarChart3, Settings, ChevronRight, Shield, UserPlus, Activity, TrendingUp, Clock, DollarSign, ListTodo } from "lucide-react";
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
  totalStaff: number;
  pendingTasks: number;
}

interface RecentActivity {
  id: string;
  type: "signup" | "task" | "subscription";
  message: string;
  timestamp: string;
}

const Admin = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalHoursUsed: 0,
    totalStaff: 0,
    pendingTasks: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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
      fetchRecentActivity();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      // Fetch total users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      // Fetch subscriptions data
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("status, price, hours_used");
      
      const activeSubscriptions = subscriptions?.filter(s => s.status === "active" || s.status === "trial").length || 0;
      const totalRevenue = subscriptions?.reduce((acc, s) => acc + Number(s.price || 0), 0) || 0;
      const totalHoursUsed = subscriptions?.reduce((acc, s) => acc + Number(s.hours_used || 0), 0) || 0;

      // Fetch staff count
      const { count: staffCount } = await supabase
        .from("staff")
        .select("*", { count: "exact", head: true });

      // Fetch pending tasks count
      const { count: pendingTasksCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        totalUsers: usersCount || 0,
        activeSubscriptions,
        totalRevenue,
        totalHoursUsed,
        totalStaff: staffCount || 0,
        pendingTasks: pendingTasksCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent profiles (signups)
      const { data: recentProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent tasks
      const { data: recentTasks } = await supabase
        .from("tasks")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = [];
      
      recentProfiles?.forEach(profile => {
        activities.push({
          id: profile.id,
          type: "signup",
          message: `${profile.full_name || "New user"} joined`,
          timestamp: profile.created_at,
        });
      });

      recentTasks?.forEach(task => {
        activities.push({
          id: task.id,
          type: "task",
          message: `New task: ${task.title}`,
          timestamp: task.created_at,
        });
      });

      // Sort by timestamp and take top 10
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 10));
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

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
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-xs">Users</span>
                      <Users className="w-4 h-4 text-gold" />
                    </div>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {loadingStats ? "..." : stats.totalUsers}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-xs">Subscriptions</span>
                      <CreditCard className="w-4 h-4 text-gold" />
                    </div>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {loadingStats ? "..." : stats.activeSubscriptions}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-xs">Revenue</span>
                      <DollarSign className="w-4 h-4 text-gold" />
                    </div>
                    <div className="text-2xl font-display font-bold text-foreground">
                      ${loadingStats ? "..." : stats.totalRevenue.toFixed(0)}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-xs">Hours Used</span>
                      <Clock className="w-4 h-4 text-gold" />
                    </div>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {loadingStats ? "..." : stats.totalHoursUsed.toFixed(0)}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-xs">Staff</span>
                      <UserPlus className="w-4 h-4 text-gold" />
                    </div>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {loadingStats ? "..." : stats.totalStaff}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-xs">Pending Tasks</span>
                      <ListTodo className="w-4 h-4 text-gold" />
                    </div>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {loadingStats ? "..." : stats.pendingTasks}
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                    <div className="space-y-3">
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
                      <Button variant="heroOutline" className="w-full justify-start" onClick={fetchStats}>
                        <Activity className="w-4 h-4 mr-2" />
                        Refresh Stats
                      </Button>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivity.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No recent activity</p>
                      ) : (
                        recentActivity.slice(0, 5).map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.type === "signup" ? "bg-green-500" : 
                                activity.type === "task" ? "bg-gold" : "bg-blue-500"
                              }`} />
                              <span className="text-sm text-foreground">{activity.message}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        ))
                      )}
                    </div>
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
                  View and manage all {stats.totalUsers} client accounts, subscriptions, and service history.
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
                  Manage your {stats.totalStaff} virtual assistant team members, assignments, and performance.
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