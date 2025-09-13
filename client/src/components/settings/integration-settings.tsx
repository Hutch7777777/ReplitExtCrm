import { useState } from "react";
import { Plug, Mail, Calendar, Key, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function IntegrationSettings() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourapp.com/webhooks/leads");
  const [apiKey, setApiKey] = useState("sk_live_************************");
  const { toast } = useToast();

  const handleOutlookConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Outlook OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate connection
      setOutlookConnected(true);
      toast({
        title: "Connected to Outlook",
        description: "Your Microsoft Outlook account has been connected successfully.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Outlook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectOutlook = () => {
    setOutlookConnected(false);
    toast({
      title: "Disconnected",
      description: "Your Outlook account has been disconnected.",
    });
  };

  const handleGenerateApiKey = () => {
    const newKey = "sk_live_" + Math.random().toString(36).substring(2, 26);
    setApiKey(newKey);
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated. Please save it securely.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Microsoft Outlook Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Microsoft Outlook</span>
          </CardTitle>
          <CardDescription>
            Connect your Outlook account for email and calendar integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {outlookConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">
                    {outlookConnected ? "Connected" : "Not Connected"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {outlookConnected 
                      ? "john.smith@company.com" 
                      : "Connect to sync emails and calendar events"
                    }
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {outlookConnected ? (
                  <>
                    <Button variant="outline" size="sm" data-testid="button-outlook-settings">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDisconnectOutlook}
                      data-testid="button-disconnect-outlook"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleOutlookConnect}
                    disabled={isConnecting}
                    data-testid="button-connect-outlook"
                  >
                    {isConnecting ? "Connecting..." : "Connect Outlook"}
                  </Button>
                )}
              </div>
            </div>

            {outlookConnected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-sync">Email Sync</Label>
                    <Switch id="email-sync" defaultChecked data-testid="switch-email-sync" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Automatically sync lead communications with Outlook
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="calendar-sync">Calendar Sync</Label>
                    <Switch id="calendar-sync" defaultChecked data-testid="switch-calendar-sync" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sync appointments and meetings with Outlook calendar
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription>
            Manage API keys and external integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex space-x-2 mt-2">
                <Input 
                  id="api-key"
                  type="password"
                  value={apiKey}
                  readOnly
                  className="font-mono"
                  data-testid="input-api-key"
                />
                <Button 
                  variant="outline" 
                  onClick={handleGenerateApiKey}
                  data-testid="button-generate-api-key"
                >
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use this key to authenticate API requests. Keep it secure and don't share it.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input 
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhooks"
                className="mt-2"
                data-testid="input-webhook-url"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Endpoint to receive real-time notifications for lead updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Third-party Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug className="h-5 w-5" />
            <span>Third-party Integrations</span>
          </CardTitle>
          <CardDescription>
            Connect with external tools and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Zapier */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Plug className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Zapier</p>
                  <p className="text-sm text-muted-foreground">
                    Automate workflows with 5000+ apps
                  </p>
                </div>
              </div>
              <Badge variant="outline" data-testid="badge-zapier-status">Not Connected</Badge>
            </div>

            {/* Slack */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Plug className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Slack</p>
                  <p className="text-sm text-muted-foreground">
                    Get lead notifications in Slack channels
                  </p>
                </div>
              </div>
              <Badge variant="outline" data-testid="badge-slack-status">Not Connected</Badge>
            </div>

            {/* QuickBooks */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plug className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">QuickBooks</p>
                  <p className="text-sm text-muted-foreground">
                    Sync customer data and invoices
                  </p>
                </div>
              </div>
              <Badge variant="outline" data-testid="badge-quickbooks-status">Not Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button data-testid="button-save-integrations">
          Save Changes
        </Button>
      </div>
    </div>
  );
}