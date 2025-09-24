
import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, FileText, AlertTriangle, Scale, Users } from 'lucide-react';

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Terms of Service";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Sportsbite Terms of Service. Read our user agreement, acceptable use policy, and legal terms for using our free live sports streaming platform.');
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://sportsbite.cc/terms-of-service');
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, []);

  return (
    <div className="bg-[#04110e] min-h-screen text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="mb-6"
          data-testid="back-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Scale className="text-accent text-3xl mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Terms of Service
              </h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          {/* Agreement */}
          <Card className="glassmorphism border-border">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Sportsbite ("we," "us," or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-accent" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                These Terms of Service ("Terms") govern your use of sportsbite's website and services. By accessing or using our service, you agree to be bound by these Terms.
              </p>
              <p className="text-sm text-muted-foreground">
                We reserve the right to update these Terms at any time without prior notice. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Use of Service */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-accent" />
                Use of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Permitted Use</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>You may use our service for personal, non-commercial purposes</li>
                  <li>You must be at least 13 years old to use our service</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to provide accurate and up-to-date information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Prohibited Use</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Using the service for any unlawful purpose</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with or disrupting the service</li>
                  <li>Transmitting harmful, offensive, or illegal content</li>
                  <li>Commercial use without written permission</li>
                  <li>Automated data collection or scraping</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Our Content</h3>
                <p className="text-sm text-muted-foreground">
                  All content on sportsbite, including but not limited to text, graphics, logos, icons, images, and software, is the property of sportsbite or its content suppliers and is protected by copyright and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">User-Generated Content</h3>
                <p className="text-sm text-muted-foreground">
                  By submitting content to our service (such as chat messages), you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, and display such content in connection with our service.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Third-Party Content</h3>
                <p className="text-sm text-muted-foreground">
                  We may provide links to third-party websites and content. We are not responsible for the content, accuracy, or opinions expressed in such websites, and such websites are not investigated, monitored, or checked for accuracy by us.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-accent" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Service Availability</h3>
                <p className="text-sm text-muted-foreground">
                  We strive to provide continuous service but do not guarantee that our service will be available at all times. We may experience interruptions, delays, or errors beyond our control.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Content Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  While we make efforts to ensure accuracy, we do not warrant that the information on our service is accurate, reliable, or current. All content is provided "as is" without warranty of any kind.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                <p className="text-sm text-muted-foreground">
                  In no event shall sportsbite be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information.
              </p>
              <Button
                variant="outline"
                onClick={() => setLocation('/privacy-policy')}
                className="mt-3 glassmorphism border-accent text-accent hover:bg-accent/10"
                size="sm"
              >
                View Privacy Policy
              </Button>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which sportsbite operates, without regard to conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="glassmorphism border-border text-center">
            <CardContent className="py-6">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Questions About These Terms?
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <Button
                onClick={() => setLocation('/contact-us')}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
