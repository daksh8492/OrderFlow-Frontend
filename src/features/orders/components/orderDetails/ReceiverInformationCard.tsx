import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, User } from "lucide-react";
import type { Order } from "../../types/order";

export default function ReceiverInformationCard({ order }: { order: Order }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Receiver Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <User className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Receiver</p>
            <p className="font-semibold">{order.receiverName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Phone className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{order.receiverPhone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <MapPin className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Delivery Address</p>
            <p className="font-medium leading-6">{order.receiverAddress}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
