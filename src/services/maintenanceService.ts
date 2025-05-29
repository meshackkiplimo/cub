import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { MaintenanceTable } from "../drizzle/schema";
import { TIMaintenance } from "../types";

export const createMaintenanceService = async (maintenance: TIMaintenance) => {
    const newMaintenance = await db.insert(MaintenanceTable).values(maintenance).returning();
    return newMaintenance[0];
}

export const getMaintenanceService = async (maintenanceId: number) => {
    return await db.query.MaintenanceTable.findFirst({
        columns: {
            maintenance_id: true,
            car_id: true,
            maintenance_date: true,
            description: true,
            cost: true
        },
        with: {
            car: {
                columns: {
                    manufacturer: true,
                    car_model: true,
                    year: true,
                    color: true
                },
                with: {
                    location: {
                        columns: {
                            location_name: true,
                            address: true,
                            contact_number: true
                        }
                    }
                }
            }
        },
        where: sql`${MaintenanceTable.maintenance_id}=${maintenanceId}`
    });
}

export const getAllMaintenanceService = async () => {
    return await db.query.MaintenanceTable.findMany({
        columns: {
            maintenance_id: true,
            car_id: true,
            maintenance_date: true,
            description: true,
            cost: true
        },
        with: {
            car: {
                columns: {
                    manufacturer: true,
                    car_model: true,
                    year: true,
                    color: true
                },
                with: {
                    location: {
                        columns: {
                            location_name: true,
                            address: true
                        }
                    }
                }
            }
        }
    });
}

export const updateMaintenanceService = async (maintenanceId: number, maintenance: Partial<TIMaintenance>) => {
    const updatedMaintenance = await db.update(MaintenanceTable)
        .set(maintenance)
        .where(sql`${MaintenanceTable.maintenance_id}=${maintenanceId}`)
        .returning();
    return updatedMaintenance[0];
}

export const deleteMaintenanceService = async (maintenanceId: number) => {
    return await db.delete(MaintenanceTable)
        .where(sql`${MaintenanceTable.maintenance_id}=${maintenanceId}`)
        .returning();
}

export const getCarMaintenanceHistory = async (carId: number) => {
    return await db.query.MaintenanceTable.findMany({
        columns: {
            maintenance_id: true,
            car_id: true,
            maintenance_date: true,
            description: true,
            cost: true
        },
        with: {
            car: {
                columns: {
                    manufacturer: true,
                    car_model: true,
                    year: true,
                    color: true,
                    rental_rate: true
                },
                with: {
                    location: {
                        columns: {
                            location_name: true,
                            address: true,
                            contact_number: true
                        }
                    }
                }
            }
        },
        where: sql`${MaintenanceTable.car_id}=${carId}`,
        orderBy: sql`${MaintenanceTable.maintenance_date} DESC`
    });
}