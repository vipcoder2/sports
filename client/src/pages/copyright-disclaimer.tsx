
import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Copyright, AlertCircle, Mail, FileText } from 'lucide-react';

export default function CopyrightDisclaimer() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Copyright Disclaimer";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'StreamSport Copyright Disclaimer and DMCA policy. Learn about our content policies, copyright compliance, and how to report copyright infringement.');
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://sportsbite.cc/copyright-disclaimer');
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
              <Copyright className="text-accent text-3xl mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Copyright Disclaimer
              </h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          {/* General Disclaimer */}
          <Card className="glassmorphism border-border border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-400">
                <AlertCircle className="mr-2 h-5 w-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                StreamSport is a streaming platform that aggregates and provides links to live sports content. We do not host, store, or control any of the content that appears on our website. All streams are provided by third-party sources, and we act solely as a search engine and directory service.
              </p>
            </CardContent>
          </Card>

          {/* Copyright Compliance */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-accent" />
                Copyright Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                StreamSport respects the intellectual property rights of content creators, broadcasters, and copyright holders. We are committed to complying with copyright laws and responding to valid copyright infringement claims.
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Our Role</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>We provide links to content hosted on third-party platforms</li>
                    <li>We do not upload, store, or control the content we link to</li>
                    <li>We act as an intermediary service provider</li>
                    <li>We respond promptly to valid DMCA takedown requests</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Content Sources</h3>
                  <p className="text-sm text-muted-foreground">
                    All streaming content is provided by independent third-party sources. These sources are responsible for ensuring they have the necessary rights and permissions to broadcast the content they provide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DMCA Policy */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>DMCA Takedown Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                In accordance with the Digital Millennium Copyright Act (DMCA), we will respond to valid copyright infringement claims and remove or disable access to allegedly infringing content.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Filing a DMCA Notice</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide us with the following information:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                  <li>Identification of the copyrighted work claimed to have been infringed</li>
                  <li>Identification of the material that is claimed to be infringing and its location</li>
                  <li>Contact information including address, telephone number, and email</li>
                  <li>A statement of good faith belief that the use is not authorized</li>
                  <li>A statement that the information is accurate and you are authorized to act</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  We will process valid DMCA takedown notices within 24-48 hours of receipt and remove or disable access to the allegedly infringing content.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fair Use */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Fair Use Consideration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Some content linked on our platform may qualify as fair use under copyright law, including content used for commentary, criticism, news reporting, teaching, scholarship, or research. However, fair use determinations are made on a case-by-case basis and depend on various factors including the purpose and character of the use, the nature of the copyrighted work, and the effect of the use on the market.
              </p>
            </CardContent>
          </Card>

          {/* User Responsibility */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>User Responsibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Users of StreamSport should be aware of the following:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>You are responsible for ensuring your use of linked content complies with applicable laws</li>
                <li>Copyright laws vary by jurisdiction and may affect content availability</li>
                <li>Some content may be geo-restricted or subject to broadcasting rights</li>
                <li>We recommend supporting official broadcasters and content creators when possible</li>
              </ul>
            </CardContent>
          </Card>

          {/* Repeat Infringers */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Repeat Infringer Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We have a policy of terminating the accounts of users who are repeat infringers of copyrighted material. If we receive multiple valid DMCA notices about content associated with a particular user account, we may suspend or terminate that account.
              </p>
            </CardContent>
          </Card>

          {/* Safe Harbor */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle>Safe Harbor Provisions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                StreamSport operates under the safe harbor provisions of the DMCA and other applicable laws. We do not exercise editorial control over the content of third-party links and are not responsible for their content. We act as a conduit for information and respond to valid takedown requests in accordance with legal requirements.
              </p>
            </CardContent>
          </Card>

          {/* Contact for Copyright Issues */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-accent" />
                Copyright Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For copyright-related inquiries, DMCA takedown requests, or other legal matters, please contact us through our official contact form with "Copyright" in the subject line.
              </p>
              
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm font-medium text-accent mb-2">Important:</p>
                <p className="text-xs text-muted-foreground">
                  Please ensure that your copyright claim is valid and complete. False or bad faith copyright claims may result in legal consequences under the DMCA and other applicable laws.
                </p>
              </div>

              <Button
                onClick={() => setLocation('/contact-us')}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                Contact Us for Copyright Issues
              </Button>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="glassmorphism border-border border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-red-400">Disclaimer:</strong> This copyright disclaimer does not constitute legal advice. Copyright law is complex and varies by jurisdiction. If you have specific questions about copyright law or believe your rights have been infringed, please consult with a qualified attorney.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
