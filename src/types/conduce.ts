
import { PackageData } from "@/components/PackageItem";

export interface PickupRequest {
  id: string;
  origin: string;
  destination: string;
  packages: PackageData[];
  date: string;
  status: "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";
  totalPrice: number;
}

export interface ConduceGeneratorProps {
  request: PickupRequest;
  clientName: string;
  clientEmail: string;
}
