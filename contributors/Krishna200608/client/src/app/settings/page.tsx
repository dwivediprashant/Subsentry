'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  getGmailStatus,
  getGmailAuthUrl,
  disconnectGmail,
  importSubscriptionsFromGmail,
  GmailStatusResponse,
  ImportSubscriptionsResponse
} from '@/lib/api';

interface ImportProgress {
  status: 'idle' | 'importing' | 'success' | 'error';
  result?: ImportSubscriptionsResponse;
  errorMessage?: string;
}

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [gmailStatus, setGmailStatus] = useState<GmailStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress>({ status: 'idle' });

  // Check for OAuth callback result from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gmailResult = urlParams.get('gmail');

    if (gmailResult === 'success') {
      setSuccess('Gmail connected successfully!');
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
      setImportProgress({ status: 'idle' });
    } catch {
      setError('Failed to disconnect Gmail');
    } finally {
      setActionLoading(false);
    }
  };

  const handleImportSubscriptions = async () => {
    try {
      setImportProgress({ status: 'importing' });
      setError(null);
      setSuccess(null);

      const token = await getToken();
      if (!token) {
        setImportProgress({
          status: 'error',
          errorMessage: 'Authentication required'
        });
        return;
      }

      const result = await importSubscriptionsFromGmail(token, 50);

      setImportProgress({
        status: 'success',
        result
      });

      if (result.saved > 0) {
        setSuccess(`Successfully imported ${result.saved} subscription${result.saved > 1 ? 's' : ''}!`);
      } else if (result.skipped > 0) {
        setSuccess('No new subscriptions found. All emails have already been processed.');
      } else {
        setSuccess('Import complete. No subscription emails found.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import subscriptions';
      setImportProgress({
        status: 'error',
        errorMessage
      });
      setError(errorMessage);
    }
  };

  const isImporting = importProgress.status === 'importing';

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and integrations</p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Gmail Status</p>
                <p className="text-xl font-bold text-white">
                  {loading ? '...' : gmailStatus?.connected ? 'Connected' : 'Not Connected'}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gmailStatus?.connected ? 'bg-green-500/20' : 'bg-gray-500/20'
                }`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill={gmailStatus?.connected ? '#22c55e' : '#6b7280'} d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Last Import</p>
                <p className="text-xl font-bold text-white">
                  {importProgress.result ? `${importProgress.result.saved} saved` : 'Never'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Auto-Sync</p>
                <p className="text-xl font-bold text-white">Manual</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gmail Integration Card */}
        <div className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7">
                  <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Gmail Integration</h2>
                <p className="text-sm text-gray-400">Connect Gmail to auto-detect subscriptions from your emails</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-400">{success}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : gmailStatus?.connected ? (
              /* Connected State */
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Connected
                  </span>
                </div>

                {/* Email Info Card */}
                <div className="bg-[#1a1a24] border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{gmailStatus.email}</p>
                      {gmailStatus.connectedAt && (
                        <p className="text-sm text-gray-500">
                          Connected {new Date(gmailStatus.connectedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Import Results */}
                {importProgress.status === 'success' && importProgress.result && (
                  <div className="bg-[#1a1a24] border border-gray-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Import Results</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{importProgress.result.saved}</p>
                        <p className="text-xs text-gray-500">Saved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">{importProgress.result.skipped}</p>
                        <p className="text-xs text-gray-500">Skipped</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{importProgress.result.errors}</p>
                        <p className="text-xs text-gray-500">Errors</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleImportSubscriptions}
                    disabled={isImporting || actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Scanning emails...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Import Subscriptions from Gmail</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDisconnect}
                    disabled={actionLoading || isImporting}
                    className="w-full py-3 px-4 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {actionLoading ? 'Disconnecting...' : 'Disconnect Gmail'}
                  </button>
                </div>
              </div>
            ) : (
              /* Disconnected State */
              <div className="space-y-6">
                {/* Privacy Notice */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-300">Read-only Access</p>
                      <p className="text-sm text-blue-400/70 mt-1">
                        SubSentry only requests read access to detect subscription emails. We cannot send, delete, or modify your emails.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <button
                  onClick={handleConnect}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent"></div>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Connect with Google</span>
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
