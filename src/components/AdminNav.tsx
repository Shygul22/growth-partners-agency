import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Users, UserPlus, BarChart3, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AdminNavProps {
  onSignOut: () => void;
}

const AdminNav = ({ onSignOut }: AdminNavProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;
      
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      
      setIsAdmin(data === true);
    };

    checkAdminRole();
  }, [user]);

  if (!isAdmin) return null;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: BarChart3 },
    { path: "/admin/clients", label: "Clients", icon: Users },
    { path: "/admin/staff", label: "Staff", icon: UserPlus },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-gold/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-xl font-bold text-primary-foreground">
              VA Agency
            </Link>
            <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-gold/10 text-gold"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden md:block text-primary-foreground/60 hover:text-primary-foreground text-sm">
              Client View
            </Link>
            <Button variant="heroOutline" size="sm" onClick={onSignOut} className="hidden md:flex">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-primary-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gold/10">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-gold/10 text-gold"
                      : "text-primary-foreground/70"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-primary-foreground/60 text-sm"
              >
                Client View
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="flex items-center gap-3 px-4 py-3 text-primary-foreground/70 text-sm w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNav;
