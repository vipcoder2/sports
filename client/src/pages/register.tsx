import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Navbar from '@/components/navbar';

export default function RegisterPage() {
  React.useEffect(() => {
    document.title = 'Create Account';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Create your Sportsbite account to save favorite matches and join live chat discussions.');
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
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}