
import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Shield, Eye, Database, Users } from 'lucide-react';

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Privacy Policy";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Sportsbite Privacy Policy. Learn how we collect, use, and protect your personal information on our free live sports streaming platform.');
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://sportsbite.cc/privacy-policy');
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
              <Shield className="text-accent text-3xl mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Privacy Policy
              </h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          {/* Introduction */}
          <Card className="glassmorphism border-border">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                At Sportsbite, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-accent" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We may collect personal information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Contact information (email address, name) when you contact us</li>
                  <li>Chat messages and usernames in live chat features</li>
                  <li>Feedback and correspondence with our support team</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  When you visit our website, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on the site</li>
                  <li>Referring website and exit pages</li>
                  <li>Device identifiers and usage patterns</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-accent" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>To provide and maintain our streaming services</li>
                  <li>To improve user experience and website functionality</li>
                  <li>To respond to customer service requests and support needs</li>
                  <li>To send administrative information and updates</li>
                  <li>To monitor and analyze usage patterns and trends</li>
                  <li>To detect and prevent technical issues and security breaches</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-accent" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">Service Providers</h4>
                  <p className="text-sm text-muted-foreground">
                    We may share information with trusted third-party service providers who assist us in operating our website and providing services.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground">Legal Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    We may disclose information if required by law or in response to valid legal requests from public authorities.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground">Business Transfers</h4>
                  <p className="text-sm text-muted-foreground">
                    In connection with any merger, acquisition, or sale of assets, user information may be transferred as part of that transaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We use cookies and similar tracking technologies to enhance your experience on our website:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Essential cookies for basic website functionality</li>
                <li>Analytics cookies to understand how visitors use our site</li>
                <li>Preference cookies to remember your settings</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                You can control cookie preferences through your browser settings, but disabling cookies may affect website functionality.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate or incomplete information</li>
                <li>Right to delete your personal information</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                To exercise these rights, please contact us using the information provided in our Contact Us page.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated effective date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="glassmorphism border-border text-center">
            <CardContent className="py-6">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Questions About This Policy?
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us.
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
