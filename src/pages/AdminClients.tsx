import { useState, useEffect } from "react";
import { Users, Search, ChevronRight, ArrowLeft, Mail, Phone, Crown, Clock, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "@/components/AdminNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Client {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  subscription?: {
    id: string;
    plan: string;
    status: string;
    hours_used: number;
    hours_included: number;
  };
  taskCount?: number;
}

const AdminClients = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "trial" | "inactive">("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    plan: "",
    status: "",
    hours_included: 0,
  });

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
    setLoadingClients(true);
    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (profileData) {
        // Fetch subscriptions and task counts for each profile
        const clientsWithData = await Promise.all(
          profileData.map(async (profile) => {
            const { data: subData } = await supabase
              .from("subscriptions")
              .select("id, plan, status, hours_used, hours_included")
              .eq("user_id", profile.id)
              .maybeSingle();
            
            const { count: taskCount } = await supabase
              .from("tasks")
              .select("*", { count: "exact", head: true })
              .eq("client_id", profile.id);
            
            return {
              ...profile,
              subscription: subData || undefined,
              taskCount: taskCount || 0,
            };
          })
        );
        setClients(clientsWithData);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoadingClients(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditForm({
      plan: client.subscription?.plan || "Personal",
      status: client.subscription?.status || "trial",
      hours_included: client.subscription?.hours_included || 20,
    });
    setEditDialogOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setViewDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedClient?.subscription?.id) {
      toast({
        title: "Error",
        description: "No subscription found for this client",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          plan: editForm.plan,
          status: editForm.status,
          hours_included: editForm.hours_included,
        })
        .eq("id", selectedClient.subscription.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client subscription updated",
      });
      setEditDialogOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
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
        {/* Back Link */}
        <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Client Management</h1>
            <p className="text-muted-foreground">
              {loadingClients ? "Loading..." : `${clients.length} total clients`}
            </p>
          </div>
          <Button variant="gold" onClick={fetchClients}>
            <Users className="w-4 h-4 mr-2" />
            Refresh
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
          {loadingClients ? (
            <div className="p-12 text-center text-muted-foreground">Loading clients...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Hours</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Tasks</th>
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
                        <span className="text-foreground">{client.taskCount}</span>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewClient(client)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        No clients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Client Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center overflow-hidden">
                  {selectedClient.avatar_url ? (
                    <img src={selectedClient.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gold font-display font-bold text-xl">
                      {selectedClient.full_name?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{selectedClient.full_name || "Unknown"}</h3>
                  <p className="text-muted-foreground text-sm">{selectedClient.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs">Plan</p>
                  <p className="font-medium">{selectedClient.subscription?.plan || "Personal"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium capitalize">{selectedClient.subscription?.status || "Unknown"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs">Hours Used</p>
                  <p className="font-medium">{selectedClient.subscription?.hours_used || 0} / {selectedClient.subscription?.hours_included || 20}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs">Tasks</p>
                  <p className="font-medium">{selectedClient.taskCount}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">{selectedClient.phone || "Not provided"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs">Joined</p>
                  <p className="font-medium">{new Date(selectedClient.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update subscription details for {selectedClient?.full_name || "this client"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={editForm.plan} onValueChange={(v) => setEditForm({ ...editForm, plan: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hours Included</Label>
              <Input
                type="number"
                value={editForm.hours_included}
                onChange={(e) => setEditForm({ ...editForm, hours_included: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="gold" onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminClients;