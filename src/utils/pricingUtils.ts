
interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  multiplier: number;
}

interface ClientPricing {
  clientId: string;
  serviceId: string;
  customPrice: number;
}

interface Zone {
  name: string;
  multiplier: number;
}

export const calculatePrice = (
  serviceId: string,
  zoneMultiplier: number,
  weight: number,
  services: ServiceType[],
  clientId?: string,
  clientPricing: ClientPricing[] = []
): number => {
  const service = services.find(s => s.id === serviceId);
  if (!service) return 0;

  // Verificar si el cliente tiene precio personalizado para este servicio
  let basePrice = service.basePrice;
  if (clientId) {
    const customPrice = clientPricing.find(
      p => p.clientId === clientId && p.serviceId === serviceId
    );
    if (customPrice) {
      basePrice = customPrice.customPrice;
    }
  }

  // Calcular precio base con multiplicadores
  let finalPrice = basePrice * service.multiplier * zoneMultiplier;

  // Agregar costo por peso adicional (más de 1kg = RD$20 por kg extra)
  if (weight > 1) {
    const extraWeight = weight - 1;
    finalPrice += extraWeight * 20;
  }

  return Math.round(finalPrice);
};

export const getClientPrice = (
  serviceId: string,
  clientId: string,
  services: ServiceType[],
  clientPricing: ClientPricing[]
): number | null => {
  const customPrice = clientPricing.find(
    p => p.clientId === clientId && p.serviceId === serviceId
  );
  return customPrice ? customPrice.customPrice : null;
};

export const hasCustomPricing = (
  clientId: string,
  clientPricing: ClientPricing[]
): boolean => {
  return clientPricing.some(p => p.clientId === clientId);
};
