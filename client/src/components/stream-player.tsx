import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Stream } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Play, Shield } from 'lucide-react';
import { CaptchaOverlay } from '@/components/captcha-overlay';

interface StreamPlayerProps {
  matchId: string;
  source: string;
}

export function StreamPlayer({ matchId, source }: StreamPlayerProps) {
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(() => {
    // Check if user has recent captcha verification
    const recentVerification = sessionStorage.getItem('captcha_verified');
    const verificationTime = sessionStorage.getItem('captcha_verified_time');
    
    if (recentVerification === 'true' && verificationTime) {
      const timeDiff = Date.now() - parseInt(verificationTime);
      // Consider verification valid for 10 minutes
      if (timeDiff < 10 * 60 * 1000) {
        return true;
      }
    }
    return false;
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: streams = [], isLoading, error } = useQuery({
    queryKey: ['/api/stream', source, matchId],
    queryFn: () => api.getStream(source, matchId),
    enabled: !!matchId && !!source && captchaVerified,
  });

  const handleCaptchaVerified = () => {
    setCaptchaVerified(true);
    // Store verification in sessionStorage
    sessionStorage.setItem('captcha_verified', 'true');
    sessionStorage.setItem('captcha_verified_time', Date.now().toString());
  };

  useEffect(() => {
    if (streams.length > 0 && !selectedStream) {
      // Select the first available stream
      setSelectedStream(streams[0]);
    }
  }, [streams, selectedStream]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="glassmorphism p-8 rounded-lg">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading stream...</span>
        </div>
      </div>
    );
  }

  if (error || streams.length === 0) {
    return (
      <Alert className="glassmorphism border-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error 
            ? 'Failed to load streams. Please try again later.' 
            : 'No streams available for this match.'}
        </AlertDescription>
      </Alert>
    );
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleFullscreen = () => {
    const container = containerRef.current;
    const iframe = iframeRef.current;
    
    if (!container || !iframe) return;

    try {
      // Check if already in fullscreen
      const fullscreenElement = document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement;

      if (!fullscreenElement && !isFullscreen) {
        // Enter fullscreen
        if (isIOS) {
          // For iOS, use custom fullscreen since native fullscreen is limited
          enterCustomFullscreen(container);
        } else if (isMobile) {
          // For other mobile devices, try container fullscreen first
          requestFullscreen(container).catch(() => {
            enterCustomFullscreen(container);
          });
        } else {
          // Desktop: try container first, then iframe
          requestFullscreen(container).catch(() => {
            requestFullscreen(iframe).catch(() => {
              enterCustomFullscreen(container);
            });
          });
        }
      } else {
        // Exit fullscreen
        if (container.classList.contains('custom-fullscreen')) {
          exitCustomFullscreen(container);
        } else {
          exitNativeFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      // Fallback to custom fullscreen
      if (container.classList.contains('custom-fullscreen')) {
        exitCustomFullscreen(container);
      } else {
        enterCustomFullscreen(container);
      }
    }
  };

  const requestFullscreen = (element: HTMLElement): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (element.requestFullscreen) {
        element.requestFullscreen().then(resolve).catch(reject);
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
        resolve();
      } else if ((element as any).webkitEnterFullscreen) {
        (element as any).webkitEnterFullscreen();
        resolve();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen().then(resolve).catch(reject);
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen().then(resolve).catch(reject);
      } else {
        reject(new Error('Fullscreen not supported'));
      }
    });
  };

  const exitNativeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  const enterCustomFullscreen = (container: HTMLElement) => {
    container.classList.add('custom-fullscreen');
    document.body.style.overflow = 'hidden';
    setIsFullscreen(true);

    // Add CSS for custom fullscreen
    if (!document.getElementById('custom-fullscreen-style')) {
      const style = document.createElement('style');
      style.id = 'custom-fullscreen-style';
      style.textContent = `
        .custom-fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          background: black !important;
          padding: 0 !important;
        }
        .custom-fullscreen iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
        .custom-fullscreen .fullscreen-button {
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          z-index: 10000 !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const exitCustomFullscreen = (container: HTMLElement) => {
    container.classList.remove('custom-fullscreen');
    document.body.style.overflow = '';
    setIsFullscreen(false);

    // Remove CSS
    const style = document.getElementById('custom-fullscreen-style');
    if (style) {
      style.remove();
    }
  };

  const renderPlayer = () => {
    if (!selectedStream && captchaVerified) return null;

    return (
      <div ref={containerRef} className="relative">
        {/* Show CAPTCHA overlay directly over player area if not verified */}
        {!captchaVerified && (
          <div className="absolute inset-0 z-50 bg-black bg-opacity-90 rounded-lg flex items-center justify-center">
            <div className="w-full max-w-sm mx-4">
              <CaptchaOverlay 
                onVerified={handleCaptchaVerified}
              />
            </div>
          </div>
        )}
        
        {/* Show placeholder until CAPTCHA is verified */}
        {!captchaVerified ? (
          <div className="w-full aspect-video rounded-lg bg-muted border border-border flex items-center justify-center">
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-accent mx-auto mb-3" />
              <p className="text-white font-medium mb-2">Stream Protected</p>
              <p className="text-sm text-muted-foreground">
                Complete verification to watch this stream
              </p>
            </div>
          </div>
        ) : selectedStream ? (
          <>
            <iframe
              ref={iframeRef}
              src={selectedStream.embedUrl}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
              allow="fullscreen"
              onError={() => setPlayerError('Failed to load stream')}
              data-testid="stream-iframe"
            />
            {/* Custom Fullscreen Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 fullscreen-button ${
                isFullscreen ? 'hover:bg-red-600' : 'hover:bg-gray-700'
              }`}
              onClick={handleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Play className={`h-6 w-6 ${isFullscreen ? 'rotate-45' : ''}`} />
            </Button>
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div className="glassmorphism p-6 rounded-lg">
        {/* Stream Quality Selector */}
        {streams.length > 1 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Stream Quality</h4>
            <div className="flex space-x-2">
              {streams.map((stream, index) => (
                <Button
                  key={index}
                  variant={selectedStream?.id === stream.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStream(stream)}
                  data-testid={`stream-quality-${stream.hd ? 'hd' : 'sd'}`}
                >
                  {stream.hd ? 'HD' : 'SD'} - {stream.source}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Player Error */}
        {playerError && (
          <Alert className="mb-4 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{playerError}</AlertDescription>
          </Alert>
          )}

        {/* Video Player */}
        {renderPlayer()}

        {/* Stream Info */}
        {selectedStream && (
          <div className="mt-4 text-xs text-background">
            <p>Source: {selectedStream.source} | Quality: {selectedStream.hd ? 'HD' : 'SD'} | Language: {selectedStream.language}</p>
          </div>
        )}
      </div>
  );
}