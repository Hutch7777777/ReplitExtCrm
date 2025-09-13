import { useState } from "react";
import { Download, Upload, Shield, Trash2, Database, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function DataPrivacySettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataRetention, setDataRetention] = useState(true);
  const { toast } = useToast();

  const handleExportData = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      toast({
        title: "Export Complete",
        description: "Your data has been exported and downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleDeleteAllData = () => {
    toast({
      title: "Data Deletion Initiated",
      description: "Your data will be permanently deleted within 24 hours.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data Export</span>
          </CardTitle>
          <CardDescription>
            Export your data for backup or migration purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">Leads & Customers</p>
                <p className="text-sm text-muted-foreground">127 records</p>
              </div>
              <div className="text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Estimates & Jobs</p>
                <p className="text-sm text-muted-foreground">89 records</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Communications</p>
                <p className="text-sm text-muted-foreground">342 records</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Format</p>
                  <p className="text-sm text-muted-foreground">Data will be exported as CSV files in a ZIP archive</p>
                </div>
                <Badge variant="secondary">CSV/ZIP</Badge>
              </div>
              
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting data...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              )}
              
              <Button 
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full"
                data-testid="button-export-data"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export All Data"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Backup Settings</span>
          </CardTitle>
          <CardDescription>
            Configure automatic backup and data retention policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup your data daily
                </p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
                data-testid="switch-auto-backup"
              />
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Backup History</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Daily Backup - September 12, 2025</p>
                    <p className="text-xs text-muted-foreground">All data • 2.4 MB</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">Complete</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Daily Backup - September 11, 2025</p>
                    <p className="text-xs text-muted-foreground">All data • 2.3 MB</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">Complete</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Daily Backup - September 10, 2025</p>
                    <p className="text-xs text-muted-foreground">All data • 2.3 MB</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">Complete</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Retention</span>
          </CardTitle>
          <CardDescription>
            Manage how long data is stored in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Automatic Data Cleanup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically remove old data based on retention policies
                </p>
              </div>
              <Switch
                checked={dataRetention}
                onCheckedChange={setDataRetention}
                data-testid="switch-data-retention"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="font-medium">Inactive Leads</p>
                <p className="text-sm text-muted-foreground">Delete after 1 year of inactivity</p>
              </div>
              <div>
                <p className="font-medium">Communication Logs</p>
                <p className="text-sm text-muted-foreground">Delete after 2 years</p>
              </div>
              <div>
                <p className="font-medium">Completed Jobs</p>
                <p className="text-sm text-muted-foreground">Archive after 3 years</p>
              </div>
              <div>
                <p className="font-medium">System Logs</p>
                <p className="text-sm text-muted-foreground">Delete after 90 days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy Controls</span>
          </CardTitle>
          <CardDescription>
            Manage data privacy and access controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Data Encryption</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  All data is encrypted at rest and in transit
                </p>
                <Badge variant="outline" className="text-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Access Logging</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  All data access is logged for security
                </p>
                <Badge variant="outline" className="text-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Data Subject Rights</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" data-testid="button-download-data">
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-correct-data">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Data Correction
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Irreversible actions that permanently affect your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Delete All Data</h4>
              <p className="text-sm text-red-700 mb-4">
                This action will permanently delete all your data including leads, customers, 
                estimates, jobs, and communications. This cannot be undone.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" data-testid="button-delete-all-data">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your 
                      data including leads, customers, estimates, jobs, and communications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAllData}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}