import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSports } from "@/context/SportsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, UserPlus, AlertCircle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { loginCustomer, openAdminLoginModal } = useSports();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    
    const result = await loginCustomer(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(redirectTarget);
    } else {
      setErrorMessage(result.message || "Unable to sign in. Please verify your credentials or register first.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-14 w-14 bg-gradient-to-tr from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">Customer Sign In</h1>
          <p className="text-xs text-slate-400">
            Sign in with the email & password you created when registering.
          </p>
        </div>

        {/* Notice for new users */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-xs flex items-start gap-2.5 text-amber-300">
          <UserPlus className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            New to Meerut Sports? You must{" "}
            <Link to={`/register${redirectTarget !== '/profile' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} className="underline font-bold text-amber-400 hover:text-amber-300">
              Register here
            </Link>{" "}
            first before you can sign in.
          </span>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Authentication Failed</span>
            </div>
            <p className="text-red-300 leading-relaxed">{errorMessage}</p>
            <div className="pt-1">
              <Link to={`/register${redirectTarget !== '/profile' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-xl">
                  Register as New Customer Now →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Registered Email Address
            </Label>
            <Input
              type="email"
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl py-5 text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Account Password
              </Label>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your registered password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-2xl shadow-xl text-sm gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Register Redirect */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Don't have an account yet?{" "}
          <Link to={`/register${redirectTarget !== '/profile' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} className="text-amber-400 font-bold hover:underline">
            Register New Account
          </Link>
        </div>

        {/* Admin Link */}
        <div className="text-center pt-2">
          <button
            onClick={openAdminLoginModal}
            className="text-[11px] text-slate-500 hover:text-amber-400 inline-flex items-center gap-1 font-semibold"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Authorized Store Admin? Access Admin Panel
          </button>
        </div>

      </div>

    </div>
  );
};