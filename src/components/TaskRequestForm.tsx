import { useState } from "react";
import { Send, Calendar, Clock, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TaskRequestFormProps {
  onSubmit?: () => void;
}

const TaskRequestForm = ({ onSubmit }: TaskRequestFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium",
    dueDate: "",
    estimatedHours: "",
    description: "",
  });

  const categories = [
    "Calendar Management",
    "Email Management",
    "Research",
    "Data Entry",
    "Travel Planning",
    "Social Media",
    "Document Preparation",
    "Personal Errands",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a task.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in the title and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("tasks").insert({
        client_id: user.id,
        title: formData.title.trim(),
        description: `[${formData.category || "General"}] ${formData.description.trim()}`,
        priority: formData.priority,
        status: "pending",
        due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        hours_estimated: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
      });

      if (error) throw error;

      toast({
        title: "Task Submitted!",
        description: "Your virtual assistant will start working on this task soon.",
      });

      setFormData({
        title: "",
        category: "",
        priority: "medium",
        dueDate: "",
        estimatedHours: "",
        description: "",
      });

      onSubmit?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-foreground font-medium">Task Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Brief description of your task"
            className="mt-2 bg-background border-border"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category" className="text-foreground font-medium">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-2 bg-background border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority" className="text-foreground font-medium">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="mt-2 bg-background border-border">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dueDate" className="text-foreground font-medium">Due Date</Label>
            <div className="relative mt-2">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedHours" className="text-foreground font-medium">Estimated Hours</Label>
            <div className="relative mt-2">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="0"
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-foreground font-medium">Detailed Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide any additional details, links, or specific instructions..."
            className="mt-2 min-h-[120px] bg-background border-border"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="heroOutline" size="sm" disabled>
          <Paperclip className="w-4 h-4 mr-2" />
          Attach Files
        </Button>
        <Button type="submit" variant="gold" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Task"}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};

export default TaskRequestForm;
