import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sun, Moon, Zap, Lock, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  // Check user role after login
  useEffect(() => {
    if (isAuthenticated && user) {
      setVerifying(true);
      
      // Give Firebase a moment to sync user data
      const checkTimer = setTimeout(() => {
        if (user.role === "admin") {
          toast.success("✓ Admin verified! Redirecting...");
          setTimeout(() => {
            navigate("/admin");
          }, 500);
        } else {
          toast.error("❌ Access denied: Your account is not an admin account");
          setVerifying(false);
          // Don't logout - just prevent navigation
        }
      }, 800);
      
      return () => clearTimeout(checkTimer);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await login(email, password);
      if (error) {
        toast.error(error);
        setSubmitting(false);
      } else {
        toast.info("Verifying admin status...");
        // The useEffect will handle the verification
      }
    } catch (err) {
      toast.error("An error occurred during login");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden p-4">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={toggle} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition-colors">
          {isDark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-300" />}
        </button>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/auth")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="w-full max-w-md rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-700 relative z-10 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
              <Lock className="h-6 w-6 text-cyan-400" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-cyan-400">Volt</span><span className="text-white">Admin</span>
            </span>
          </div>
          <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in with your admin credentials to manage the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Admin Warning */}
          <div className="mb-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 flex gap-2">
            <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-orange-400 font-semibold">Admin Access Only</p>
              <p className="text-orange-300 text-xs mt-1">Verified against Firebase database</p>
            </div>
          </div>

          {verifying ? (
            <div className="space-y-4 py-8">
              <div className="flex justify-center">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-spin" style={{ padding: '2px' }}>
                    <div className="absolute inset-0 bg-slate-900 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-300">Verifying admin credentials...</p>
              <p className="text-center text-gray-500 text-sm">Checking Firebase database</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={submitting}
                  required 
                  className="rounded-xl h-11 bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-cyan-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={submitting}
                  required 
                  minLength={6} 
                  className="rounded-xl h-11 bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-cyan-500/50"
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25"
              >
                {submitting ? "Authenticating…" : "Sign In as Admin"}
              </Button>
            </form>
          )}

          {/* Firebase Setup Info */}
          <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
            <div className="flex gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-gray-300 font-semibold">Firebase Integration Active</span>
            </div>
            <p className="text-xs text-gray-400">
              Admin status is verified against your Firebase Firestore database. Users must have <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">"role": "admin"</code> in the users collection.
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button 
              type="button"
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-gray-400 hover:text-gray-300"
            >
              Not an admin? Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
