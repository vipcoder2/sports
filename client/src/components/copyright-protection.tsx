import React from 'react';

interface CopyrightProtectionProps {
  children: React.ReactNode;
  protectedContent?: boolean;
}

export function CopyrightProtection({ children }: CopyrightProtectionProps) {
  return <>{children}</>;
}