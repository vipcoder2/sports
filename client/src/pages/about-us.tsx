
import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Play, Users, Globe, Shield, Clock } from 'lucide-react';

export default function AboutUs() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "About Us";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Sportsbite, your premier destination for free live sports streaming. Discover our mission to provide accessible sports entertainment worldwide.');
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://sportsbite.cc/about-us');
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
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Play className="text-accent text-4xl mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                About Us
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your premier destination for free live sports streaming, bringing you closer to the action from anywhere in the world.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Globe className="mr-2 h-5 w-5 text-accent" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                At Sportsbite, we believe that sports bring people together and should be accessible to everyone. Our mission is to provide free, high-quality live sports streaming to fans worldwide, breaking down barriers and making sports entertainment available to all.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to delivering an exceptional viewing experience with reliable streams, user-friendly interface, and comprehensive coverage of sports events from around the globe.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glassmorphism border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-accent" />
                  Global Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join millions of sports fans from around the world. Our platform serves users across continents, creating a global community of sports enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-accent" />
                  Reliable Streaming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We provide multiple streaming sources for each event to ensure you never miss a moment of the action, with backup options always available.
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-accent" />
                  24/7 Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From live matches to scheduled events, we provide round-the-clock coverage of sports from different time zones and leagues worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Play className="mr-2 h-5 w-5 text-accent" />
                  Multiple Sports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Football, basketball, cricket, tennis, boxing, and more. We cover a wide range of sports to cater to diverse interests and preferences.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Offer */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="text-xl">What We Offer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-accent mb-2">Free Access</h3>
                  <p className="text-sm text-muted-foreground">
                    All our streams are completely free with no subscription fees or hidden charges.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-accent mb-2">HD Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    High-definition streams available for the best viewing experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-accent mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Engage with fellow fans through our integrated live chat feature.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-accent mb-2">Mobile Friendly</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized for all devices - desktop, tablet, and mobile.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card className="glassmorphism border-border text-center">
            <CardContent className="py-8">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Questions or Feedback?
              </h2>
              <p className="text-muted-foreground mb-6">
                We'd love to hear from you. Get in touch with our team for any inquiries or suggestions.
              </p>
              <Button
                onClick={() => setLocation('/contact-us')}
                className="bg-accent hover:bg-accent/90 text-background font-medium"
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
