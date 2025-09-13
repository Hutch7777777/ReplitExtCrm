import { useState } from "react";
import { Settings as SettingsIcon, User, Building, Plug, Bell, Shield } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebSocket } from "@/hooks/use-websocket";
import AccountSettings from "@/components/settings/account-settings";
import CompanySettings from "@/components/settings/company-settings";
import IntegrationSettings from "@/components/settings/integration-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import DataPrivacySettings from "@/components/settings/data-privacy-settings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const { isConnected } = useWebSocket();

  const tabs = [
    {
      value: "account",
      label: "Account",
      icon: User,
      description: "Personal information and preferences",
      component: AccountSettings,
    },
    {
      value: "company",
      label: "Company",
      icon: Building,
      description: "Business settings and divisions",
      component: CompanySettings,
    },
    {
      value: "integrations",
      label: "Integrations",
      icon: Plug,
      description: "Connected apps and services",
      component: IntegrationSettings,
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Email and alert preferences",
      component: NotificationSettings,
    },
    {
      value: "privacy",
      label: "Data & Privacy",
      icon: Shield,
      description: "Data management and security",
      component: DataPrivacySettings,
    },
  ];

  return (
    <div className="flex flex-col h-screen" data-testid="page-settings">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger data-testid="button-toggle-sidebar" />
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Settings
              </h2>
              <p className="text-muted-foreground">
                Manage your account, company settings, and preferences
              </p>
              {isConnected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-chart-2/10 text-chart-2 mt-2">
                  <span className="w-2 h-2 bg-chart-2 rounded-full mr-2"></span>
                  Real-time updates active
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-muted overflow-hidden">
        <div className="h-full p-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="h-full flex flex-col"
            data-testid="tabs-settings"
          >
            {/* Tab Navigation */}
            <div className="mb-6">
              <TabsList className="grid w-full grid-cols-5 h-auto bg-card border p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      data-testid={`tab-${tab.value}`}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{tab.label}</div>
                        <div className="text-xs opacity-70 hidden md:block">
                          {tab.description}
                        </div>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="mt-0 h-full"
                    data-testid={`content-${tab.value}`}
                  >
                    <div className="max-w-4xl mx-auto">
                      <Component />
                    </div>
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}