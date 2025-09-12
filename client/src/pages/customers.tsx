import { useState } from "react";
import { Search, Plus, Edit, User, Phone, Mail, MapPin } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import CustomerModal from "@/components/modals/customer-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomers } from "@/hooks/use-customers";
import { useWebSocket } from "@/hooks/use-websocket";
import { Customer } from "@shared/schema";

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: customers = [], isLoading } = useCustomers();
  const { isConnected } = useWebSocket();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    setSelectedCustomer(undefined);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen" data-testid="page-customers">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Customers
              </h2>
              <p className="text-muted-foreground">
                Manage customer database with contact information and project history
              </p>
              {isConnected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-chart-2/10 text-chart-2 mt-2">
                  <span className="w-2 h-2 bg-chart-2 rounded-full mr-2"></span>
                  Real-time updates active
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                  data-testid="input-search"
                />
              </div>

              <Button
                onClick={handleAddCustomer}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-add-customer"
              >
                <Plus className="mr-2" size={16} />
                Add Customer
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 bg-muted p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Customers</p>
                    <p className="text-2xl font-bold" data-testid="text-total-customers">
                      {customers.length}
                    </p>
                  </div>
                  <User className="w-8 h-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Projects</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <User className="w-8 h-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">This Month</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <User className="w-8 h-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Value</p>
                    <p className="text-2xl font-bold">$485K</p>
                  </div>
                  <User className="w-8 h-8 text-chart-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading customers...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow" data-testid={`card-customer-${customer.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg" data-testid={`text-customer-name-${customer.id}`}>
                        {customer.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCustomer(customer)}
                        data-testid={`button-edit-${customer.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {customer.email && (
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-email-${customer.id}`}>
                          {customer.email}
                        </span>
                      </div>
                    )}

                    {customer.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-phone-${customer.id}`}>
                          {customer.phone}
                        </span>
                      </div>
                    )}

                    {customer.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="text-muted-foreground mt-0.5" />
                        <span className="text-sm" data-testid={`text-address-${customer.id}`}>
                          {customer.address}
                          {customer.city && `, ${customer.city}`}
                          {customer.state && `, ${customer.state}`}
                          {customer.zipCode && ` ${customer.zipCode}`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3">
                      <Badge variant="secondary" className="text-xs">
                        Customer since {new Date(customer.createdAt).getFullYear()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Updated {new Date(customer.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCustomers.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No customers found matching your search." : "No customers yet. Add your first customer to get started."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <CustomerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}