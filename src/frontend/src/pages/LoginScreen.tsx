import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <img 
            src="/assets/generated/nuverse-logo-transparent.dim_200x200.png" 
            alt="NuVerse Logo" 
            className="h-32 w-32"
          />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">NuVerse</h1>
            <p className="mt-2 text-lg text-muted-foreground">Nutech Universe Central Hub</p>
          </div>
        </div>

        {/* Description */}
        <div className="w-full rounded-lg border border-border/40 bg-card/80 p-6 text-center shadow-sm backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            Welcome to NuVerse, your gateway to AIRspace, Shoewear Marketplace, Gaming Hub, and more.
          </p>
        </div>

        {/* Login Button */}
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          className="w-full gap-2 text-lg"
        >
          {isLoggingIn ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Connecting...
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Login with Internet Identity
            </>
          )}
        </Button>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground">
          Secure authentication powered by Internet Computer
        </p>
      </div>
    </div>
  );
}
