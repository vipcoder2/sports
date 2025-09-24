import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, LogIn, Chrome, Shield } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HTMLDivElement>(null);
  const { login, loginWithGoogle } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
    script.async = true;
    script.defer = true;

    // Global callback function for reCAPTCHA
    (window as any).onRecaptchaLoad = () => {
      if (window.grecaptcha && window.grecaptcha.render && captchaRef.current) {
        try {
          window.grecaptcha.render(captchaRef.current, {
            sitekey: "6LcN7NIrAAAAAOm0HgyqHexjIV3L2T61vpLpdhdS", // Production site key
            callback: (token: string) => {
              setCaptchaVerified(true);
              setCaptchaToken(token);
              setError("");
            },
            "expired-callback": () => {
              setCaptchaVerified(false);
              setCaptchaToken("");
            },
            "error-callback": () => {
              setCaptchaVerified(false);
              setCaptchaToken("");
              setError("reCAPTCHA verification failed. Please try again.");
            },
            theme: "dark",
            size: "normal",
          });
        } catch (error) {
          console.error("reCAPTCHA render error:", error);
          setError("reCAPTCHA failed to load. Please refresh and try again.");
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      // Clean up
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Script might already be removed
      }
      delete (window as any).onRecaptchaLoad;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!captchaVerified) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      setLocation("/");
    } catch (error: any) {
      setError(error.message || "Failed to log in");
      // Reset captcha on error
      if (window.grecaptcha) {
        window.grecaptcha.reset();
        setCaptchaVerified(false);
        setCaptchaToken("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle();
      setLocation("/");
    } catch (error: any) {
      setError(error.message || "Failed to log in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glassmorphism">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <LogIn className="w-6 h-6 text-primary" />
          Welcome Back
        </CardTitle>
        <p className="text-muted-foreground">
          Sign in to access your favorite matches and chat
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="text-destructive text-sm text-center animate-in slide-in-from-bottom-2">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <div
              ref={captchaRef}
              className="transform scale-90 origin-center"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !captchaVerified}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Sign in with Google
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button
            variant="link"
            className="p-0 h-auto text-accent"
            onClick={() => setLocation("/register")}
          >
            Sign up here
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
