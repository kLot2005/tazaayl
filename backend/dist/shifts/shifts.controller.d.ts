import { ShiftsService } from './shifts.service';
export declare class ShiftsController {
    private shiftsService;
    constructor(shiftsService: ShiftsService);
    startShift(req: any): Promise<import("./shift.entity").Shift>;
    endShift(req: any): Promise<import("./shift.entity").Shift>;
    getActiveShift(req: any): Promise<import("./shift.entity").Shift | null>;
}
