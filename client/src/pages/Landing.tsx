import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, ClipboardList, TrendingUp, Shield, Zap } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Exterior Finishes CRM
            </span>
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Streamline Your Contracting Business
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Complete CRM solution designed specifically for exterior finishes contractors.
            Manage leads, estimates, jobs, and team members across all your divisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" className="text-lg px-8" data-testid="button-get-started">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <ClipboardList className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>
                Track leads across all divisions with Kanban boards and automated workflows
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Assign team members, manage permissions, and coordinate across departments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Real-time insights into your business performance and pipeline health
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Built for Exterior Contractors
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enterprise-grade security with automatic backups and data protection
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Zap className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Fast Setup
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get up and running in minutes with our intuitive setup process
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join contractors who trust our CRM to grow their business
          </p>
          <Button onClick={handleLogin} size="lg" className="text-lg px-8" data-testid="button-start-free">
            Start Free Today
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Exterior Finishes CRM. Built for contractors, by contractors.</p>
        </div>
      </footer>
    </div>
  );
}