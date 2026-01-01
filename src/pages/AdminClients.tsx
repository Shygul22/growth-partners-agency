import { useState, useEffect } from "react";
import { Users, Search, Filter, ChevronRight, ArrowLeft, Mail, Phone, Crown, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

interface Client {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  subscription?: {
    plan: string;
    status: string;
    hours_used: number;
    hours_included: number;
  };
}

const AdminClients = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "trial" | "inactive">("all");

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
      fetchClients();
    }
  }, [isAdmin]);

  const fetchClients = async () => {
    // In a real app, you'd have admin-specific RLS policies to allow this
    // For now, we'll show the admin's own profile as a demo
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .limit(20);

    if (profileData) {
      // Fetch subscriptions for each profile
      const clientsWithSubs = await Promise.all(
        profileData.map(async (profile) => {
          const { data: subData } = await supabase
            .from("subscriptions")
            .select("plan, status, hours_used, hours_included")
            .eq("user_id", profile.id)
            .maybeSingle();
          
          return {
            ...profile,
            subscription: subData || undefined,
          };
        })
      );
      setClients(clientsWithSubs);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" ||
      client.subscription?.status === filterStatus;

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

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-navy border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-display text-xl font-bold text-primary-foreground">VA Agency</Link>
              <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded">Admin</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Back Link */}
        <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Client Management</h1>
            <p className="text-muted-foreground">View and manage all client accounts</p>
          </div>
          <Button variant="gold">
            <Users className="w-4 h-4 mr-2" />
            Export Clients
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "trial", "inactive"].map((status) => (
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

        {/* Clients List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Hours</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center overflow-hidden">
                          {client.avatar_url ? (
                            <img src={client.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gold font-medium">
                              {client.full_name?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{client.full_name || "Unknown"}</p>
                          <p className="text-muted-foreground text-sm">
                            Joined {new Date(client.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-foreground text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-muted-foreground text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {client.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold/10 text-gold text-sm rounded">
                        <Crown className="w-3 h-3" />
                        {client.subscription?.plan || "Personal"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {client.subscription?.hours_used || 0}/{client.subscription?.hours_included || 20}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        client.subscription?.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : client.subscription?.status === "trial"
                          ? "bg-gold/10 text-gold"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {client.subscription?.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminClients;