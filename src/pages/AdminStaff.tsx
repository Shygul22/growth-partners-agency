import { useState, useEffect } from "react";
import { UserPlus, Search, ArrowLeft, Mail, Clock, Plus, Briefcase, Award, Edit, Trash2, Phone, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "@/components/AdminNav";
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

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  specialization: string | null;
  status: string;
  hourly_rate: number;
  created_at: string;
  activeClients?: number;
  hoursWorked?: number;
}

const AdminStaff = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "busy" | "offline">("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [staffForm, setStaffForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "VA",
    specialization: "",
    status: "available",
    hourly_rate: 25,
    password: "",
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
      fetchStaff();
    }
  }, [isAdmin]);

  const fetchStaff = async () => {
    setLoadingStaff(true);
    try {
      const { data: staffData, error } = await supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (staffData) {
        // Fetch assignment counts for each staff member
        const staffWithStats = await Promise.all(
          staffData.map(async (member) => {
            const { count: clientCount } = await supabase
              .from("staff_assignments")
              .select("*", { count: "exact", head: true })
              .eq("staff_id", member.id)
              .eq("status", "active");

            // Get hours from tasks assigned to this staff
            const { data: tasks } = await supabase
              .from("tasks")
              .select("hours_actual")
              .eq("assigned_staff_id", member.id);

            const hoursWorked = tasks?.reduce((acc, t) => acc + Number(t.hours_actual || 0), 0) || 0;

            return {
              ...member,
              activeClients: clientCount || 0,
              hoursWorked,
            };
          })
        );
        setStaff(staffWithStats);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive",
      });
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleAddStaff = async () => {
    if (staffForm.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("create-staff-user", {
        body: {
          email: staffForm.email,
          password: staffForm.password,
          full_name: staffForm.full_name,
          phone: staffForm.phone || null,
          role: staffForm.role,
          specialization: staffForm.specialization || null,
          status: staffForm.status,
          hourly_rate: staffForm.hourly_rate,
        },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      toast({
        title: "Success",
        description: "Staff member created with login credentials",
      });
      setAddDialogOpen(false);
      resetForm();
      fetchStaff();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add staff member";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditStaff = (member: StaffMember) => {
    setSelectedStaff(member);
    setStaffForm({
      full_name: member.full_name,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      specialization: member.specialization || "",
      status: member.status,
      hourly_rate: member.hourly_rate,
      password: "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return;

    try {
      const { error } = await supabase
        .from("staff")
        .update({
          full_name: staffForm.full_name,
          email: staffForm.email,
          phone: staffForm.phone || null,
          role: staffForm.role,
          specialization: staffForm.specialization || null,
          status: staffForm.status,
          hourly_rate: staffForm.hourly_rate,
        })
        .eq("id", selectedStaff.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      setEditDialogOpen(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const { error } = await supabase.from("staff").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setStaffForm({
      full_name: "",
      email: "",
      phone: "",
      role: "VA",
      specialization: "",
      status: "available",
      hourly_rate: 25,
      password: "",
    });
    setSelectedStaff(null);
    setNewPassword("");
    setShowPassword(false);
  };

  const handleResetPassword = async () => {
    if (!selectedStaff || newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke("update-staff-password", {
        body: {
          staff_id: selectedStaff.id,
          new_password: newPassword,
        },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setPasswordDialogOpen(false);
      setNewPassword("");
      setSelectedStaff(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update password";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const openPasswordDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setNewPassword("");
    setPasswordDialogOpen(true);
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" ||
      member.status === filterStatus;

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

  const totalHoursWorked = staff.reduce((acc, s) => acc + (s.hoursWorked || 0), 0);
  const availableCount = staff.filter(s => s.status === "available").length;

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
            <p className="text-muted-foreground">
              {loadingStaff ? "Loading..." : `${staff.length} team members`}
            </p>
          </div>
          <Button variant="gold" onClick={() => { resetForm(); setAddDialogOpen(true); }}>
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
                <p className="text-2xl font-display font-bold text-foreground">{availableCount}</p>
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
                <p className="text-2xl font-display font-bold text-foreground">{totalHoursWorked}</p>
                <p className="text-muted-foreground text-sm">Hours Worked</p>
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
                  {staff.reduce((acc, s) => acc + (s.activeClients || 0), 0)}
                </p>
                <p className="text-muted-foreground text-sm">Active Assignments</p>
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
        {loadingStaff ? (
          <div className="text-center py-12 text-muted-foreground">Loading staff...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div key={member.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-soft transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold font-display font-bold text-lg">
                        {member.full_name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{member.full_name}</h3>
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

                <div className="space-y-2 mb-4">
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {member.email}
                  </p>
                  {member.phone && (
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {member.phone}
                    </p>
                  )}
                  {member.specialization && (
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> {member.specialization}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border mb-4">
                  <div className="text-center">
                    <p className="font-display font-bold text-foreground">{member.activeClients || 0}</p>
                    <p className="text-muted-foreground text-xs">Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-foreground">{member.hoursWorked || 0}h</p>
                    <p className="text-muted-foreground text-xs">Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-foreground">${member.hourly_rate}</p>
                    <p className="text-muted-foreground text-xs">Rate</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="heroOutline" size="sm" className="flex-1" onClick={() => handleEditStaff(member)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openPasswordDialog(member)} title="Reset Password">
                    <Key className="w-4 h-4 text-gold" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteStaff(member.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingStaff && filteredStaff.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No staff members found</p>
            <Button variant="gold" className="mt-4" onClick={() => { resetForm(); setAddDialogOpen(true); }}>
              Add Your First Staff Member
            </Button>
          </div>
        )}
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Add a new virtual assistant to your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={staffForm.full_name}
                  onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={staffForm.role} onValueChange={(v) => setStaffForm({ ...staffForm, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VA">VA</SelectItem>
                    <SelectItem value="Senior VA">Senior VA</SelectItem>
                    <SelectItem value="Team Lead">Team Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input
                  value={staffForm.specialization}
                  onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                  placeholder="e.g., Social Media, Bookkeeping"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={staffForm.status} onValueChange={(v: any) => setStaffForm({ ...staffForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hourly Rate ($)</Label>
                <Input
                  type="number"
                  value={staffForm.hourly_rate}
                  onChange={(e) => setStaffForm({ ...staffForm, hourly_rate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button variant="gold" onClick={handleAddStaff} disabled={!staffForm.full_name || !staffForm.email || staffForm.password.length < 6 || isCreating}>
              {isCreating ? "Creating..." : "Add Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff member details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={staffForm.full_name}
                  onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={staffForm.role} onValueChange={(v) => setStaffForm({ ...staffForm, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VA">VA</SelectItem>
                    <SelectItem value="Senior VA">Senior VA</SelectItem>
                    <SelectItem value="Team Lead">Team Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input
                  value={staffForm.specialization}
                  onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={staffForm.status} onValueChange={(v: any) => setStaffForm({ ...staffForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hourly Rate ($)</Label>
              <Input
                type="number"
                value={staffForm.hourly_rate}
                onChange={(e) => setStaffForm({ ...staffForm, hourly_rate: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="gold" onClick={handleUpdateStaff} disabled={!staffForm.full_name || !staffForm.email}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedStaff?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-muted-foreground text-xs">
                Password must be at least 6 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button variant="gold" onClick={handleResetPassword} disabled={newPassword.length < 6}>
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminStaff;