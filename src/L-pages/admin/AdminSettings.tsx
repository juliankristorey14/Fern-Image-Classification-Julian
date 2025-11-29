"use client";

import { useState, useEffect } from 'react';
import { Menu, Save, Database, Bell, Shield, Mail, Globe } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import type { User as UserType } from '@/types';

interface AdminSettingsProps {
  onLogout: () => void;
}

export default function AdminSettings({ onLogout }: AdminSettingsProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'model' | 'notifications' | 'security'>('general');

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    appName: 'Fern Classifier',
    maintenanceMode: false,
    allowRegistration: true,
    maxScansPerUser: 100
  });

  // Model Settings
  const [modelSettings, setModelSettings] = useState({
    confidenceThreshold: 85,
    modelVersion: 'v2.1.0',
    enableAutoUpdate: true,
    jupyterNotebookUrl: 'https://colab.research.google.com/your-notebook'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserAlert: true,
    errorAlert: true,
    weeklyReport: true,
    adminEmail: 'admin@fernclassifier.com'
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableTwoFactor: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);

    const savedGeneral = localStorage.getItem('adminGeneralSettings');
    if (savedGeneral) {
      setGeneralSettings(JSON.parse(savedGeneral));
    }

    const savedModel = localStorage.getItem('adminModelSettings');
    if (savedModel) {
      setModelSettings(JSON.parse(savedModel));
    }

    const savedNotification = localStorage.getItem('adminNotificationSettings');
    if (savedNotification) {
      setNotificationSettings(JSON.parse(savedNotification));
    }

    const savedSecurity = localStorage.getItem('adminSecuritySettings');
    if (savedSecurity) {
      setSecuritySettings(JSON.parse(savedSecurity));
    }
  }, []);

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleSaveSettings = () => {
    // In real app, would save to API
    localStorage.setItem('adminGeneralSettings', JSON.stringify(generalSettings));
    localStorage.setItem('adminModelSettings', JSON.stringify(modelSettings));
    localStorage.setItem('adminNotificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('adminSecuritySettings', JSON.stringify(securitySettings));
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar onLogout={handleLogoutClick} user={currentUser} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72">
            <AdminSidebar 
              onLogout={handleLogoutClick} 
              onClose={() => setIsSidebarOpen(false)} 
              isMobile 
              user={currentUser}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <div className="bg-white border-b border-[var(--color-neutral-200)] px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-900)]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-[var(--color-neutral-800)]">System Settings</h2>
            <div className="w-6 lg:w-0"></div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Success Alert */}
            {showSuccessAlert && (
              <Alert
                type="success"
                message="Settings saved successfully!"
              />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[var(--color-neutral-800)]">Settings</h3>
                <p className="text-[var(--color-neutral-600)]">
                  Manage your application settings
                </p>
              </div>
              <Button variant="primary" onClick={handleSaveSettings}>
                <Save className="w-5 h-5" />
                Save Changes
              </Button>
            </div>

            {/* Tabs */}
            <Card padding="none">
              <div className="flex overflow-x-auto border-b border-[var(--color-neutral-200)]">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors whitespace-nowrap ${
                    activeTab === 'general'
                      ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)]'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  General
                </button>
                <button
                  onClick={() => setActiveTab('model')}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors whitespace-nowrap ${
                    activeTab === 'model'
                      ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)]'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  Model
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors whitespace-nowrap ${
                    activeTab === 'notifications'
                      ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors whitespace-nowrap ${
                    activeTab === 'security'
                      ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)]'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  Security
                </button>
              </div>
            </Card>

            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h4 className="text-[var(--color-neutral-800)] mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Application Name
                      </label>
                      <Input
                        type="text"
                        value={generalSettings.appName}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, appName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Max Scans Per User
                      </label>
                      <Input
                        type="number"
                        value={generalSettings.maxScansPerUser}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, maxScansPerUser: parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Maintenance Mode</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Temporarily disable the application
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.maintenanceMode}
                          onChange={(e) =>
                            setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Allow User Registration</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Enable new users to register
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.allowRegistration}
                          onChange={(e) =>
                            setGeneralSettings({ ...generalSettings, allowRegistration: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Model Settings */}
            {activeTab === 'model' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h4 className="text-[var(--color-neutral-800)] mb-4">AI Model Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Model Version
                      </label>
                      <Input
                        type="text"
                        value={modelSettings.modelVersion}
                        onChange={(e) =>
                          setModelSettings({ ...modelSettings, modelVersion: e.target.value })
                        }
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Confidence Threshold (%)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={modelSettings.confidenceThreshold}
                          onChange={(e) =>
                            setModelSettings({ ...modelSettings, confidenceThreshold: parseInt(e.target.value) })
                          }
                          className="w-full"
                        />
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Current: {modelSettings.confidenceThreshold}%
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Jupyter Notebook URL
                      </label>
                      <Input
                        type="text"
                        value={modelSettings.jupyterNotebookUrl}
                        onChange={(e) =>
                          setModelSettings({ ...modelSettings, jupyterNotebookUrl: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Auto-Update Model</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Automatically update to the latest model version
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={modelSettings.enableAutoUpdate}
                          onChange={(e) =>
                            setModelSettings({ ...modelSettings, enableAutoUpdate: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h4 className="text-[var(--color-neutral-800)] mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Admin Email
                      </label>
                      <Input
                        type="email"
                        value={notificationSettings.adminEmail}
                        onChange={(e) =>
                          setNotificationSettings({ ...notificationSettings, adminEmail: e.target.value })
                        }
                        icon={<Mail className="w-5 h-5" />}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Email Notifications</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Receive notifications via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">New User Alerts</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Get notified when new users register
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.newUserAlert}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, newUserAlert: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Error Alerts</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Get notified of system errors
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.errorAlert}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, errorAlert: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Weekly Reports</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Receive weekly activity summaries
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReport}
                          onChange={(e) =>
                            setNotificationSettings({ ...notificationSettings, weeklyReport: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h4 className="text-[var(--color-neutral-800)] mb-4">Security Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Session Timeout (minutes)
                      </label>
                      <Input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--color-neutral-700)] mb-2">
                        Max Login Attempts
                      </label>
                      <Input
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) =>
                          setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Email Verification Required</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Users must verify email before accessing the app
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.requireEmailVerification}
                          onChange={(e) =>
                            setSecuritySettings({ ...securitySettings, requireEmailVerification: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[var(--color-neutral-100)] rounded-xl">
                      <div>
                        <p className="text-[var(--color-neutral-800)]">Two-Factor Authentication</p>
                        <p className="text-sm text-[var(--color-neutral-600)]">
                          Enable 2FA for admin accounts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.enableTwoFactor}
                          onChange={(e) =>
                            setSecuritySettings({ ...securitySettings, enableTwoFactor: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--color-neutral-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}