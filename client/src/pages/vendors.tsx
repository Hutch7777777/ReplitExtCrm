import { useState } from "react";
import { Search, Plus, Edit, Star, Truck, Phone, Mail, MapPin } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import VendorModal from "@/components/modals/vendor-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVendors } from "@/hooks/use-vendors";
import { useWebSocket } from "@/hooks/use-websocket";
import { Vendor } from "@shared/schema";

export default function Vendors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: vendors = [], isLoading } = useVendors();
  const { isConnected } = useWebSocket();

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = () => {
    setSelectedVendor(undefined);
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'materials':
        return 'bg-chart-1/10 text-chart-1';
      case 'subcontractor':
        return 'bg-chart-2/10 text-chart-2';
      case 'equipment':
        return 'bg-chart-3/10 text-chart-3';
      case 'supplies':
        return 'bg-chart-4/10 text-chart-4';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-muted-foreground text-sm">No rating</span>;

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "fill-chart-3 text-chart-3" : "text-muted-foreground"}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen" data-testid="page-vendors">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Vendors
              </h2>
              <p className="text-muted-foreground">
                Manage vendor database for subcontractors and suppliers
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
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                  data-testid="input-search"
                />
              </div>

              <Button
                onClick={handleAddVendor}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-add-vendor"
              >
                <Plus className="mr-2" size={16} />
                Add Vendor
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
                    <p className="text-muted-foreground text-sm">Total Vendors</p>
                    <p className="text-2xl font-bold" data-testid="text-total-vendors">
                      {vendors.length}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Vendors</p>
                    <p className="text-2xl font-bold">
                      {vendors.filter(v => v.isActive).length}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Materials</p>
                    <p className="text-2xl font-bold">
                      {vendors.filter(v => v.category === 'materials').length}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Subcontractors</p>
                    <p className="text-2xl font-bold">
                      {vendors.filter(v => v.category === 'subcontractor').length}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-chart-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading vendors...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-md transition-shadow p-4 md:p-8 pt-6" data-testid={`card-vendor-${vendor.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg" data-testid={`text-vendor-name-${vendor.id}`}>
                        {vendor.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVendor(vendor)}
                        data-testid={`button-edit-${vendor.id}`}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      {vendor.category && (
                        <Badge className={getCategoryColor(vendor.category)} data-testid={`badge-category-${vendor.id}`}>
                          {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                        </Badge>
                      )}
                      <Badge variant={vendor.isActive ? "default" : "secondary"}>
                        {vendor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vendor.contactPerson && (
                      <div className="flex items-center space-x-2">
                        <Truck size={16} className="text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-contact-${vendor.id}`}>
                          {vendor.contactPerson}
                        </span>
                      </div>
                    )}

                    {vendor.email && (
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-email-${vendor.id}`}>
                          {vendor.email}
                        </span>
                      </div>
                    )}

                    {vendor.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-phone-${vendor.id}`}>
                          {vendor.phone}
                        </span>
                      </div>
                    )}

                    {vendor.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="text-muted-foreground mt-0.5" />
                        <span className="text-sm" data-testid={`text-address-${vendor.id}`}>
                          {vendor.address}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3">
                      <div data-testid={`rating-${vendor.id}`}>
                        {renderStars(vendor.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(vendor.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredVendors.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No vendors found matching your search." : "No vendors yet. Add your first vendor to get started."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <VendorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vendor={selectedVendor}
      />
    </div>
  );
}