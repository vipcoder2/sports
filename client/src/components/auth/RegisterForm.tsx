import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, UserPlus, Chrome, Shield } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HTMLDivElement>(null);
  const { signup, loginWithGoogle } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadRegister&render=explicit";
    script.async = true;
    script.defer = true;

    // Global callback function for reCAPTCHA
    (window as any).onRecaptchaLoadRegister = () => {
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
      delete (window as any).onRecaptchaLoadRegister;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (displayName.trim().length > 0 && displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters");
      return;
    }

    if (!captchaVerified) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signup(email, password, displayName.trim() || undefined);
      setLocation("/");
    } catch (error: any) {
      setError(error.message || "Failed to create account");
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

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle();
      setLocation("/");
    } catch (error: any) {
      setError(error.message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glassmorphism">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <UserPlus className="w-6 h-6 text-primary" />
          Create Account
        </CardTitle>
        <p className="text-muted-foreground">
          Join to save your favorite matches and join the chat
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="displayName">Display Name (Optional)</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="displayName"
                type="text"
                placeholder="Your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="pl-10"
                disabled={loading}
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </div>
            ) : (
              "Create Account"
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
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Sign up with Google
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Button
            variant="link"
            className="p-0 h-auto text-accent"
            onClick={() => setLocation("/login")}
          >
            Sign in here
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
