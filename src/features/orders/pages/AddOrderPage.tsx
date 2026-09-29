import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import OrderForm from "../components/orderForm/OrderForm";
import { createOrder } from "../apis/orderApi";
import type { OrderFormData } from "../schema/orderSchema";

function AddOrderPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async (data: OrderFormData) => {
    setIsLoading(true);
    try {
      await createOrder(data);
      toast.success("Order created successfully!");
      navigate("/app/orders");
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
      console.error("Error creating order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <OrderForm
        onSubmit={handleCreateOrder}
        isLoading={isLoading}
        onCancel={() => navigate("/app/orders")}
      />
    </div>
  );
}

export default AddOrderPage;
