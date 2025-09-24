import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, RefreshCw, CheckCircle } from 'lucide-react';

interface CaptchaOverlayProps {
  onVerified: () => void;
  onClose?: () => void;
}

export function CaptchaOverlay({ onVerified, onClose }: CaptchaOverlayProps) {
  const [challenge, setChallenge] = useState<{
    question: string;
    answer: number;
    options: number[];
  }>({ question: '', answer: 0, options: [] });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generateChallenge = () => {
    const challenges = [
      // Math challenges
      () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let answer: number;
        let question: string;
        
        switch (operation) {
          case '+':
            answer = a + b;
            question = `${a} + ${b} = ?`;
            break;
          case '-':
            answer = a - b;
            question = `${a} - ${b} = ?`;
            break;
          case '×':
            answer = a * b;
            question = `${a} × ${b} = ?`;
            break;
          default:
            answer = a + b;
            question = `${a} + ${b} = ?`;
        }
        
        const wrongOptions: number[] = [];
        while (wrongOptions.length < 3) {
          const wrong = answer + Math.floor(Math.random() * 20) - 10;
          if (wrong !== answer && !wrongOptions.includes(wrong)) {
            wrongOptions.push(wrong);
          }
        }
        
        return {
          question,
          answer,
          options: [answer, ...wrongOptions].sort(() => Math.random() - 0.5)
        };
      },
      
      // Visual pattern challenges
      () => {
        const patterns = [
          { question: 'Select the number that comes next: 2, 4, 6, 8, ?', answer: 10, wrong: [12, 9, 16] },
          { question: 'What is 25% of 100?', answer: 25, wrong: [20, 30, 50] },
          { question: 'How many sides does a triangle have?', answer: 3, wrong: [4, 5, 6] },
          { question: 'What is the next number: 1, 1, 2, 3, 5, ?', answer: 8, wrong: [7, 9, 10] },
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        return {
          question: pattern.question,
          answer: pattern.answer,
          options: [pattern.answer, ...pattern.wrong].sort(() => Math.random() - 0.5)
        };
      }
    ];
    
    const challengeGenerator = challenges[Math.floor(Math.random() * challenges.length)];
    return challengeGenerator();
  };

  const regenerateChallenge = () => {
    setSelectedAnswer(null);
    setChallenge(generateChallenge());
  };

  useEffect(() => {
    regenerateChallenge();
  }, []);

  const handleVerify = async () => {
    if (selectedAnswer === null) return;
    
    setIsLoading(true);
    
    // Simulate verification delay to make it harder for bots
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (selectedAnswer === challenge.answer) {
      setIsVerified(true);
      setTimeout(() => {
        onVerified();
      }, 1000);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        // Generate a new challenge after 3 failed attempts
        regenerateChallenge();
        setAttempts(0);
      }
      setSelectedAnswer(null);
    }
    
    setIsLoading(false);
  };

  if (isVerified) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <Card className="glassmorphism border-green-500 max-w-sm w-full mx-4">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Verification Complete!</h3>
            <p className="text-green-400 text-sm">Loading your stream...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <Card className="glassmorphism w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-3">
            <Shield className="h-8 w-8 text-accent mr-2" />
            <CardTitle className="text-lg sm:text-xl text-white">Security Verification</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Please verify you're human before accessing the stream
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
            <div className="flex items-start justify-between mb-3 gap-2">
              <p className="text-sm sm:text-base font-medium text-white flex-1 leading-relaxed">{challenge.question}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={regenerateChallenge}
                className="h-8 w-8 text-muted-foreground hover:text-white flex-shrink-0"
                title="Generate new challenge"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {challenge.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className="h-12 sm:h-14 text-lg sm:text-xl font-semibold transition-all duration-200 hover:scale-105"
                  onClick={() => setSelectedAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          
          {attempts > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-destructive text-sm text-center font-medium">
                Incorrect answer. Try again. ({3 - attempts} attempts remaining)
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleVerify}
              disabled={selectedAnswer === null || isLoading}
              className="flex-1 h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </Button>
            
            {onClose && (
              <Button variant="outline" onClick={onClose} className="h-12 px-6 text-base">
                Cancel
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            This helps us protect our content from automated access
          </p>
        </CardContent>
      </Card>
    </div>
  );
}