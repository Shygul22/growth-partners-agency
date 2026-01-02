import { useState, useEffect } from "react";
import { UserPlus, Search, ArrowLeft, Mail, Star, Clock, MoreVertical, Plus, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "@/components/AdminNav";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  specialization: string;
  activeClients: number;
  hoursWorked: number;
  rating: number;
  status: "available" | "busy" | "offline";
}

// Mock staff data for demonstration
const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@vaagency.com",
    role: "Senior VA",
    specialization: "Executive Support",
    activeClients: 5,
    hoursWorked: 120,
    rating: 4.9,
    status: "available",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@vaagency.com",
    role: "VA",
    specialization: "Social Media",
    activeClients: 8,
    hoursWorked: 95,
    rating: 4.7,
    status: "busy",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@vaagency.com",
    role: "Senior VA",
    specialization: "Bookkeeping",
    activeClients: 4,
    hoursWorked: 110,
    rating: 4.8,
    status: "available",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@vaagency.com",
    role: "VA",
    specialization: "Customer Support",
    activeClients: 6,
    hoursWorked: 85,
    rating: 4.6,
    status: "offline",
  },
];

const AdminStaff = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "busy" | "offline">("all");

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

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" ||
      member.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading || checkingRole) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </main>
    );
  }

  if (!user || !isAdmin) return null;

  const handleSignOut = async () => {
    await signOut();
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background">
      <AdminNav onSignOut={handleSignOut} />

      <div className="container mx-auto px-6 py-8">
        {/* Back Link */}
        <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground">Manage your virtual assistant team</p>
          </div>
          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{staff.length}</p>
                <p className="text-muted-foreground text-sm">Total Staff</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {staff.filter(s => s.status === "available").length}
                </p>
                <p className="text-muted-foreground text-sm">Available</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Clock className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {staff.reduce((acc, s) => acc + s.hoursWorked, 0)}
                </p>
                <p className="text-muted-foreground text-sm">Hours This Month</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Award className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {(staff.reduce((acc, s) => acc + s.rating, 0) / staff.length).toFixed(1)}
                </p>
                <p className="text-muted-foreground text-sm">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            {["all", "available", "busy", "offline"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "gold" : "heroOutline"}
                size="sm"
                onClick={() => setFilterStatus(status as any)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div key={member.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-soft transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-gold font-display font-bold text-lg">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{member.name}</h3>
                    <p className="text-muted-foreground text-sm">{member.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  member.status === "available"
                    ? "bg-green-500/10 text-green-500"
                    : member.status === "busy"
                    ? "bg-gold/10 text-gold"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {member.email}
                </p>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {member.specialization}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="font-display font-bold text-foreground">{member.activeClients}</p>
                  <p className="text-muted-foreground text-xs">Clients</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-foreground">{member.hoursWorked}h</p>
                  <p className="text-muted-foreground text-xs">This Month</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-foreground flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-gold fill-gold" /> {member.rating}
                  </p>
                  <p className="text-muted-foreground text-xs">Rating</p>
                </div>
              </div>

              <Button variant="heroOutline" size="sm" className="w-full mt-4">
                View Profile
              </Button>
            </div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No staff members found</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminStaff;