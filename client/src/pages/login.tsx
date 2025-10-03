import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Navbar from '@/components/navbar';

export default function LoginPage() {
  React.useEffect(() => {
    document.title = 'Sign In';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Sign in to sportsbite to access your favorite matches and join live chat discussions.');
    }

    // Add noindex meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}