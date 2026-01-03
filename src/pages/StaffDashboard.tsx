import { useState, useEffect } from "react";
import { User, Clock, CheckCircle2, AlertCircle, LogOut, Briefcase, Calendar, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface StaffProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  specialization: string | null;
  status: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  hours_estimated: number | null;
  hours_actual: number | null;
  client_id: string;
  created_at: string;
}

interface Assignment {
  id: string;
  client_id: string;
  status: string;
  notes: string | null;
  assigned_at: string;
}

const StaffDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "clients" | "profile">("tasks");

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/staff/login");
      return;
    }

    // Fetch staff profile
    const { data: staffData, error: staffError } = await supabase
      .from("staff")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (staffError || !staffData) {
      toast({
        title: "Access Denied",
        description: "You don't have staff access.",
        variant: "destructive",
      });
      navigate("/staff/login");
      return;
    }

    setStaffProfile(staffData);

    // Fetch assigned tasks
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_staff_id", staffData.id)
      .order("created_at", { ascending: false });

    if (tasksData) setTasks(tasksData);

    // Fetch assignments
    const { data: assignmentsData } = await supabase
      .from("staff_assignments")
      .select("*")
      .eq("staff_id", staffData.id)
      .eq("status", "active");

    if (assignmentsData) setAssignments(assignmentsData);

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/staff/login");
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Task Updated",
        description: `Task status changed to ${newStatus}.`,
      });
      checkAuthAndFetchData();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-500";
      case "high": return "bg-orange-500/10 text-orange-500";
      case "medium": return "bg-yellow-500/10 text-yellow-500";
      default: return "bg-green-500/10 text-green-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500";
      case "in_progress": return "bg-blue-500/10 text-blue-500";
      case "pending": return "bg-yellow-500/10 text-yellow-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </main>
    );
  }

  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-navy border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
              <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20">Staff</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground/60 text-sm hidden md:block">
                {staffProfile?.full_name}
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
                  <Briefcase className="w-10 h-10 text-gold" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {staffProfile?.full_name || "Staff"}
                </h2>
                <p className="text-muted-foreground text-sm">{staffProfile?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium capitalize">
                  {staffProfile?.role}
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "tasks", label: "My Tasks", icon: FileText },
                  { id: "clients", label: "Assigned Clients", icon: Users },
                  { id: "profile", label: "Profile", icon: User },
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
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">Pending</span>
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground">{pendingTasks}</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">In Progress</span>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground">{inProgressTasks}</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">Completed</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground">{completedTasks}</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">Clients</span>
                  <Users className="w-4 h-4 text-gold" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground">{assignments.length}</div>
              </div>
            </div>

            {activeTab === "tasks" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">My Tasks</h3>
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                            <p className="text-muted-foreground text-sm mt-1">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {task.due_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                            {task.hours_estimated && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {task.hours_estimated}h estimated
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {task.status === "pending" && (
                              <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, "in_progress")}>
                                Start Task
                              </Button>
                            )}
                            {task.status === "in_progress" && (
                              <Button size="sm" variant="gold" onClick={() => updateTaskStatus(task.id, "completed")}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No tasks assigned yet</p>
                    <p className="text-sm">Tasks assigned by admins will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "clients" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Assigned Clients</h3>
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">Client ID: {assignment.client_id.slice(0, 8)}...</p>
                              <p className="text-muted-foreground text-sm">
                                Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-500/10 text-green-500">{assignment.status}</Badge>
                        </div>
                        {assignment.notes && (
                          <p className="text-muted-foreground text-sm mt-3 p-2 bg-background rounded">
                            {assignment.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No clients assigned yet</p>
                    <p className="text-sm">Client assignments will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Full Name</p>
                    <p className="text-lg font-medium text-foreground">{staffProfile?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Email</p>
                    <p className="text-lg font-medium text-foreground">{staffProfile?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Role</p>
                    <p className="text-lg font-medium text-foreground capitalize">{staffProfile?.role}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Status</p>
                    <Badge className={staffProfile?.status === "available" ? "bg-green-500/10 text-green-500" : "bg-muted"}>
                      {staffProfile?.status}
                    </Badge>
                  </div>
                  {staffProfile?.specialization && (
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground text-sm mb-1">Specialization</p>
                      <p className="text-lg font-medium text-foreground">{staffProfile.specialization}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default StaffDashboard;
