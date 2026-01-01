import { useState, useRef } from "react";
import { Camera, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  phone: z.string().trim().max(20, "Phone number is too long").optional(),
});

interface ProfileEditorProps {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  onUpdate: () => void;
  onCancel: () => void;
}

const ProfileEditor = ({ profile, onUpdate, onCancel }: ProfileEditorProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);
  
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setAvatarPreview(publicUrl + "?t=" + Date.now());
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center overflow-hidden hover:border-gold/40 transition-colors group"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-gold group-hover:scale-110 transition-transform" />
            )}
            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-full">
                <Loader2 className="w-6 h-6 text-gold animate-spin" />
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <p className="text-muted-foreground text-sm mt-2">Click to upload avatar</p>
      </div>

      {/* Form Fields */}
      <div>
        <Label htmlFor="full_name" className="text-foreground font-medium">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Your full name"
          className={`mt-2 bg-background border-border focus:border-gold focus:ring-gold/20 ${errors.full_name ? "border-destructive" : ""}`}
        />
        {errors.full_name && <p className="text-destructive text-sm mt-1">{errors.full_name}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
        <Input
          id="email"
          value={profile.email || ""}
          disabled
          className="mt-2 bg-muted border-border text-muted-foreground"
        />
        <p className="text-muted-foreground text-xs mt-1">Email cannot be changed</p>
      </div>

      <div>
        <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          className={`mt-2 bg-background border-border focus:border-gold focus:ring-gold/20 ${errors.phone ? "border-destructive" : ""}`}
        />
        {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" variant="gold" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
        <Button type="button" variant="heroOutline" onClick={onCancel} disabled={isSubmitting}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditor;