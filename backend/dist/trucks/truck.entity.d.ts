export declare enum TruckStatus {
    ACTIVE = "active",
    MAINTENANCE = "maintenance",
    INACTIVE = "inactive"
}
export declare class Truck {
    id: number;
    plateNumber: string;
    model: string;
    status: TruckStatus;
    capacity: number;
    currentLat: number;
    currentLon: number;
}
