import { useEffect, useState } from "react";
import { Link } from "react-router";
import { 
  Package, 
  Users, 
  Warehouse, 
  Boxes, 
  ArrowRight,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  Activity
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/features/orders/apis/orderApi";
import type { OrderSummary } from "@/features/orders/types/order";
import { useAppSelector } from "@/hooks/useAppSelector";

function DashboardStatCard({ 
  title, 
  value, 
  icon: Icon, 
  description 
}: { 
  title: string; 
  value: string; 
  icon: any;
  description: string;
}) {
  return (
    <Card className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black font-mono tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ordersRes = await getOrders(0, 5, "createdAt,desc");
        setRecentOrders(ordersRes.content);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CREATED":
        return <Badge variant="outline" className="bg-muted text-muted-foreground"><Clock className="mr-1 h-3 w-3" /> Created</Badge>;
      case "PICKED":
        return <Badge variant="outline" className="bg-info/10 text-info border-info/20"><PackageCheck className="mr-1 h-3 w-3" /> Picked</Badge>;
      case "PACKED":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20"><Boxes className="mr-1 h-3 w-3" /> Packed</Badge>;
      case "SHIPPED":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><Truck className="mr-1 h-3 w-3" /> Shipped</Badge>;
      case "DELIVERED":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20"><CheckCircle2 className="mr-1 h-3 w-3" /> Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* ── Action Buttons ── */}
      <div className="flex justify-end gap-3 mb-2">
        <Button asChild variant="outline" size="sm" className="h-9">
          <Link to="/app/warehouse-stock">
            <Boxes className="mr-2 h-4 w-4" />
            Check Stock
          </Link>
        </Button>
        <Button asChild size="sm" className="h-9">
          <Link to="/app/orders/add">
            <Package className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <DashboardStatCard 
          title="Active Orders" 
          value="1,248" 
          icon={Package}
          description="Orders across all states"
        />
        <DashboardStatCard 
          title="Total Customers" 
          value="452" 
          icon={Users}
          description="Registered buyers"
        />
        <DashboardStatCard 
          title="Catalog Items" 
          value="3,890" 
          icon={Boxes}
          description="Active SKUs in inventory"
        />
        <DashboardStatCard 
          title="Warehouses" 
          value="6" 
          icon={Warehouse}
          description="Connected locations"
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Recent Orders (takes 2 cols) */}
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <CardDescription>Latest orders placed across the system.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
              <Link to="/app/orders">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Activity className="h-8 w-8 animate-pulse mb-3 opacity-50" />
                <p className="text-sm">Loading recent activity...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No recent orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div 
                    key={order.orderId} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <Link 
                          to={`/app/orders/${order.orderId}`} 
                          className="font-semibold text-sm hover:underline hover:text-primary transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.orderDate).toLocaleDateString()} · {order.receiverName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-14 sm:pl-0">
                      {getStatusBadge(order.status)}
                      <p className="text-sm font-bold font-mono text-right w-20">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Center (takes 1 col) */}
        <Card className="border-border/60 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks & operations</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            {[
              { label: "Create a new Order", path: "/app/orders/add", icon: Package },
              { label: "Pick active orders", path: "/app/orders/picking", icon: PackageCheck },
              { label: "Assign fulfilling warehouse", path: "/app/orders/fulfillment", icon: Warehouse },
              { label: "Search warehouse stock", path: "/app/warehouse-stock", icon: Boxes },
            ].map(({ label, path, icon: Icon }, idx) => (
              <Link 
                key={idx}
                to={path}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/30 hover:bg-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-background border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                  {label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
              </Link>
            ))}

            <div className="mt-auto pt-6">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1.5">System Status</p>
                <p className="text-[13px] text-muted-foreground">
                  All systems operational. Inventory synced across 6 warehouses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}

export default DashboardPage;
