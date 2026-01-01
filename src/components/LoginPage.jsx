import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

/**
 * Login Page Component
 * Muted grey card style matching homepage project cards
 * Uses UI primitives for consistent styling
 */
export default function LoginPage({ onLogin, error: externalError, loading: externalLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const error = externalError || localError;
  const loading = externalLoading || isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Please enter your email');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0d1321' }}>
      {/* Login Card - matching project card style */}
      <div
        className={`relative w-full max-w-md bg-surface-canvas border rounded-md overflow-hidden transition-all duration-150 ${
          isHovered ? 'border-gray-600 bg-surface-raised/50' : 'border-gray-800'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header area - like thumbnail */}
        <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
          <div
            className={`flex flex-col items-center transform transition-transform duration-150 ${isHovered ? 'scale-105' : ''}`}
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-md flex items-center justify-center transition-colors duration-150 ${
                isHovered ? 'bg-gray-700' : 'bg-gray-700/50'
              } border border-gray-600`}
            >
              <svg className="w-7 h-7 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
          </div>

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 transition-colors duration-150 ${isHovered ? 'bg-gray-700/20' : 'bg-transparent'}`}
          />
        </div>

        {/* Content area */}
        <div className="p-6">
          {/* Title */}
          <div className="mb-6">
            <h1
              className={`text-xl font-semibold mb-1 transition-colors duration-150 ${isHovered ? 'text-gray-300' : 'text-white'}`}
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              Content Builder
            </h1>
            <p className="text-quaternary text-sm">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-quaternary mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <Input
                id="email"
                type="email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={loading}
                autoComplete="email"
                error={!!error}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-quaternary mb-1.5 uppercase tracking-wide"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                error={!!error}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button - using Button primitive */}
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-gray-800">
            <p className="text-gray-600 text-[10px] text-center">Need access? Contact your team admin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
