'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getGmailStatus, getGmailAuthUrl, disconnectGmail, GmailStatusResponse } from '@/lib/api';

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [gmailStatus, setGmailStatus] = useState<GmailStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check for OAuth callback result from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gmailResult = urlParams.get('gmail');

    if (gmailResult === 'success') {
      setSuccess('Gmail connected successfully!');
      // Clean URL
      window.history.replaceState({}, '', '/settings');
    } else if (gmailResult === 'denied') {
      setError('Gmail permission was denied. Please try again and grant access.');
      window.history.replaceState({}, '', '/settings');
    } else if (gmailResult === 'error') {
      const message = urlParams.get('message') || 'Unknown error';
      setError(`Failed to connect Gmail: ${message}`);
      window.history.replaceState({}, '', '/settings');
    }
  }, []);

  // Fetch Gmail connection status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const status = await getGmailStatus(token);
        setGmailStatus(status);
      } catch {
        setError('Failed to fetch Gmail status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [getToken]);

  const handleConnect = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await getGmailAuthUrl(token);

      if (response.success && response.authUrl) {
        // Redirect to Google OAuth
        window.location.href = response.authUrl;
      } else {
        setError('Failed to initiate Gmail connection');
      }
    } catch {
      setError('Failed to connect Gmail');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      await disconnectGmail(token);
      setGmailStatus({ success: true, connected: false });
      setSuccess('Gmail disconnected successfully');
    } catch {
      setError('Failed to disconnect Gmail');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings
        </h1>

        {/* Gmail Integration Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {/* Gmail Icon */}
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Gmail Integration
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connect Gmail to auto-detect subscriptions
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : gmailStatus?.connected ? (
              /* Connected State */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Connected</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Email: <span className="font-medium">{gmailStatus.email}</span>
                  </p>
                  {gmailStatus.connectedAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Connected: {new Date(gmailStatus.connectedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleDisconnect}
                  disabled={actionLoading}
                  className="w-full py-2.5 px-4 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Disconnecting...' : 'Disconnect Gmail'}
                </button>
              </div>
            ) : (
              /* Disconnected State */
              <div className="space-y-4">
                {/* Privacy Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Read-only Access
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        SubSentry only requests read access to detect subscription emails.
                        We cannot send, delete, or modify your emails.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connect Button - Google Style */}
                <button
                  onClick={handleConnect}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        Connect with Google
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
