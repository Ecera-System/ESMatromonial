import React, { useState } from 'react';
import { Save, Bell, Shield, Users, Database, Mail, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailReports: true,
      pushNotifications: true,
      weeklyDigest: false,
      criticalAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90'
    },
    platform: {
      autoModeration: true,
      reportThreshold: '3',
      suspensionDuration: '7'
    },
    general: {
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'MM/DD/YYYY'
    }
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-gray-600 text-sm mt-1">Configure your admin dashboard preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-gray-700 flex-shrink-0" />
            <h3 className="font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-sm font-medium text-gray-900">Email Reports</p>
                <p className="text-xs text-gray-600">Receive email notifications for new reports</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailReports}
                onChange={(e) => updateSetting('notifications', 'emailReports', e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 flex-shrink-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-600">Browser push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 flex-shrink-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-sm font-medium text-gray-900">Weekly Digest</p>
                <p className="text-xs text-gray-600">Weekly summary of platform activity</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.weeklyDigest}
                onChange={(e) => updateSetting('notifications', 'weeklyDigest', e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 flex-shrink-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-sm font-medium text-gray-900">Critical Alerts</p>
                <p className="text-xs text-gray-600">High-priority security alerts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.criticalAlerts}
                onChange={(e) => updateSetting('notifications', 'criticalAlerts', e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 flex-shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-gray-700 flex-shrink-0" />
            <h3 className="font-medium text-gray-900">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-600">Add an extra layer of security</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 flex-shrink-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Session Timeout (minutes)
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Password Expiry (days)
              </label>
              <select
                value={settings.security.passwordExpiry}
                onChange={(e) => updateSetting('security', 'passwordExpiry', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Platform */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-gray-700 flex-shrink-0" />
            <h3 className="font-medium text-gray-900">Platform</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-sm font-medium text-gray-900">Auto Moderation</p>
                <p className="text-xs text-gray-600">Automatically flag suspicious content</p>
              </div>
              <input
                type="checkbox"
                checked={settings.platform.autoModeration}
                onChange={(e) => updateSetting('platform', 'autoModeration', e.target.checked)}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 flex-shrink-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Report Threshold
              </label>
              <select
                value={settings.platform.reportThreshold}
                onChange={(e) => updateSetting('platform', 'reportThreshold', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="1">1 report</option>
                <option value="3">3 reports</option>
                <option value="5">5 reports</option>
                <option value="10">10 reports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Default Suspension Duration (days)
              </label>
              <select
                value={settings.platform.suspensionDuration}
                onChange={(e) => updateSetting('platform', 'suspensionDuration', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* General */}
        <div className="bg-white rounded-lg border p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-gray-700 flex-shrink-0" />
            <h3 className="font-medium text-gray-900">General</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Timezone
              </label>
              <select
                value={settings.general.timezone}
                onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Language
              </label>
              <select
                value={settings.general.language}
                onChange={(e) => updateSetting('general', 'language', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Date Format
              </label>
              <select
                value={settings.general.dateFormat}
                onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <Save className="h-4 w-4" />
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;