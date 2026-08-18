import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Trophy, User, Mail, Phone, Lock, Eye, EyeOff, Camera, Upload, CheckCircle2, Loader2, X, Sparkles 
} from "lucide-react";
import { toast } from "sonner";

export const RegisterPage: React.FC = () => {
  const { registerCustomer } = useSports();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/profile";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  });

  const [customAvatarUploaded, setCustomAvatarUploaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Avatar presets for quick selection
  const avatarPresets = [
    { name: "Athlete 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { name: "Athlete 2", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
    { name: "Athlete 3", url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80" },
    { name: "Athlete 4", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  ];

  // Handle local image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setFormData((prev) => ({ ...prev, avatar: base64Url }));
        setCustomAvatarUploaded(true);
        toast.success("Profile photo uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    const result = await registerCustomer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      avatar: formData.avatar
    });
    setIsLoading(false);

    if (result.success) {
      navigate(redirectTarget);
    } else {
      setErrorMsg(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="h-14 w-14 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">Create Customer Account</h1>
          <p className="text-xs text-slate-400">
            Register your profile to place UPI orders, track shipments & save delivery addresses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* PROFILE PHOTO UPLOAD SECTION */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3 text-center">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center justify-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-amber-400" /> Upload Profile Photo
            </Label>

            <div className="flex items-center justify-center gap-4">
              {/* Photo Preview */}
              <div className="relative group">
                <img
                  src={formData.avatar}
                  alt="Profile Preview"
                  className="h-20 w-20 rounded-full object-cover border-4 border-amber-400 shadow-md bg-slate-800"
                />
                
                {/* Upload overlay button */}
                <label className="absolute inset-0 bg-slate-950/60 rounded-full flex flex-col items-center justify-center text-[10px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Upload className="h-4 w-4 mb-0.5" />
                  <span>Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Action */}
              <div className="text-left space-y-1.5 flex-1">
                <label className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow">
                  <Upload className="h-3.5 w-3.5" /> Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Upload JPG, PNG or WEBP from your device.
                </p>
              </div>
            </div>

            {/* Quick Preset Avatars */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-bold block mb-1.5">Or Choose an Avatar:</span>
              <div className="flex items-center justify-center gap-2">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, avatar: preset.url }));
                      setCustomAvatarUploaded(false);
                    }}
                    className={`h-10 w-10 rounded-full overflow-hidden border-2 transition-all ${
                      formData.avatar === preset.url && !customAvatarUploaded
                        ? "border-amber-400 scale-110 shadow-md ring-2 ring-amber-400/40"
                        : "border-slate-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Full Name
            </Label>
            <Input
              type="text"
              placeholder="e.g. Virat Kohli"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email Address
            </Label>
            <Input
              type="email"
              placeholder="e.g. virat@sports.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Phone Number
            </Label>
            <Input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-amber-400 uppercase">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 text-sm"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-950/50 border border-red-900 p-2.5 rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-2xl shadow-xl text-sm gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Registering Account...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Register & Create Account
              </>
            )}
          </Button>

        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Already registered?{" "}
          <Link to={`/login${redirectTarget !== '/profile' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} className="text-amber-400 font-bold hover:underline">
            Sign In with Registered Password
          </Link>
        </div>

      </div>

    </div>
  );
};