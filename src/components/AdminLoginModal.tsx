import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ShieldAlert, X, Clock } from "lucide-react";

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginModalOpen, closeAdminLoginModal, adminLogin } = useSports();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const navigate = useNavigate();

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setErrorMsg("");
    const success = adminLogin(email, password);
    
    if (success) {
      setFailedAttempts(0);
      setEmail("");
      setPassword("");
      navigate("/admin");
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      
      if (nextAttempts >= 3) {
        setLockoutTime(60); // 60 seconds lockout
        setFailedAttempts(0);
        setErrorMsg("Too many failed attempts. Security lockout active for 60 seconds.");
      } else {
        setErrorMsg(`Invalid email or password. ${3 - nextAttempts} attempt(s) remaining.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={closeAdminLoginModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="h-8 w-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black uppercase text-white tracking-tight">Secured Admin Portal</h2>
          <p className="text-xs text-slate-400">
            Enter your admin email & password to access management tools.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Admin Email
            </Label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={lockoutTime > 0}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 text-sm focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Admin Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={lockoutTime > 0}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 pr-10 text-sm focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
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

          {lockoutTime > 0 && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-xl text-xs flex items-center gap-2 font-bold">
              <Clock className="h-4 w-4 text-red-400 animate-spin" />
              <span>Security Lockout: Try again in {lockoutTime}s</span>
            </div>
          )}

          {errorMsg && lockoutTime === 0 && (
            <div className="text-xs text-red-400 bg-red-950/50 border border-red-900 p-2.5 rounded-xl text-center font-medium flex items-center justify-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={lockoutTime > 0}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-2xl shadow-xl text-sm disabled:opacity-50"
          >
            {lockoutTime > 0 ? `Locked (${lockoutTime}s)` : "Authenticate Admin Access"}
          </Button>
        </form>

        <div className="text-center text-[11px] text-slate-500 font-medium">
          Protected by Rate Limiting & Audit Logging
        </div>

      </div>
    </div>
  );
};