import { Calendar, Mail, FileText, Search, Phone, ShoppingCart, Plane, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  onActionClick?: (action: string) => void;
}

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const actions: QuickAction[] = [
    {
      icon: Calendar,
      label: "Schedule Meeting",
      description: "Set up a meeting or appointment",
    },
    {
      icon: Mail,
      label: "Email Management",
      description: "Inbox cleanup & response drafts",
    },
    {
      icon: Search,
      label: "Research",
      description: "Deep research on any topic",
    },
    {
      icon: FileText,
      label: "Document Prep",
      description: "Create or format documents",
    },
    {
      icon: Phone,
      label: "Phone Calls",
      description: "Make calls on your behalf",
    },
    {
      icon: ShoppingCart,
      label: "Personal Shopping",
      description: "Find & purchase items",
    },
    {
      icon: Plane,
      label: "Travel Planning",
      description: "Book flights, hotels & more",
    },
    {
      icon: MessageSquare,
      label: "Other Request",
      description: "Something else? Tell us!",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onActionClick?.(action.label)}
          className="p-4 bg-muted/50 hover:bg-muted rounded-xl border border-border hover:border-gold/30 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
            <action.icon className="w-5 h-5 text-gold" />
          </div>
          <h4 className="font-medium text-foreground text-sm mb-1">{action.label}</h4>
          <p className="text-muted-foreground text-xs">{action.description}</p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
