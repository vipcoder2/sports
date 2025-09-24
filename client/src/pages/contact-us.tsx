import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { ArrowLeft, Mail, MessageCircle, Send, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContactUs() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Contact Us";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact Sportsbite support team. Get help with streaming issues, send feedback, or ask questions about our free live sports streaming platform.');
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://sportsbite.cc//contact-us');
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Using Formspree - Replace YOUR_FORM_ID with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/mgvlganw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again or contact us directly at contact@sportsbite.cc');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or need support? We're here to help and would love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="glassmorphism border-border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-accent" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted && (
                  <Alert className="mb-6 border-green-500/20 bg-green-500/10">
                    <AlertDescription className="text-green-400">
                      Thank you for your message! We'll get back to you within 24-48 hours at contact@sportsbite.cc
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="mb-6 border-red-500/20 bg-red-500/10">
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-muted border-border"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-muted border-border"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-muted border-border"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-muted border-border resize-none"
                      placeholder="Please provide details about your question, feedback, or issue..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 text-background font-medium"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & FAQ */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="glassmorphism border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">contact@sportsbite.cc</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Response Time</p>
                      <p className="text-sm text-muted-foreground">24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Community</p>
                      <p className="text-sm text-muted-foreground">Join our Discord & Telegram</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Questions */}
              <Card className="glassmorphism border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Common Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-accent mb-1">Stream not working?</h3>
                    <p className="text-sm text-muted-foreground">
                      Try refreshing the page or switching to a different stream source.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-accent mb-1">Is Sportsbite free?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, all our streams are completely free with no hidden charges.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-accent mb-1">Mobile support?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our platform is fully optimized for mobile devices and tablets.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-accent mb-1">Request a sport/match?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contact us with your request and we'll do our best to add it.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Support Types */}
              <Card className="glassmorphism border-border">
                <CardHeader>
                  <CardTitle className="text-lg">How we can help</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Technical support & streaming issues</li>
                    <li>• Feature requests & suggestions</li>
                    <li>• Bug reports & feedback</li>
                    <li>• Partnership & business inquiries</li>
                    <li>• General questions about the platform</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}