import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { LocationTable, CarTable } from "../drizzle/schema";
import { TILocation } from "../types";

export const createLocationService = async (location: TILocation) => {
    const newLocation = await db.insert(LocationTable).values(location).returning();
    return newLocation[0];
}

export const getLocationService = async (locationId: number) => {
    return await db.query.LocationTable.findFirst({
        columns: {
            location_id: true,
            location_name: true,
            address: true,
            contact_number: true
        },
        with: {
            cars: {
                columns: {
                    car_id: true,
                    make: true,
                    model: true,
                    year: true,
                    color: true,
                    availability: true,
                    rental_rate: true
                }
            }
        },
        where: sql`${LocationTable.location_id}=${locationId}`
    });
}

export const getAllLocationsService = async () => {
    return await db.query.LocationTable.findMany({
        columns: {
            location_id: true,
            location_name: true,
            address: true,
            contact_number: true
        },
        with: {
            cars: {
                columns: {
                    car_id: true,
                    make: true,
                    model: true,
                    availability: true
                }
            }
        }
    });
}

export const getLocationAvailableCarsService = async (locationId: number) => {
    return await db.query.LocationTable.findFirst({
        columns: {
            location_id: true,
            location_name: true,
            address: true
        },
        with: {
            cars: {
                columns: {
                    car_id: true,
                    make: true,
                    model: true,
                    year: true,
                    color: true,
                    rental_rate: true
                },
                where: sql`${CarTable.availability}=true`
            }
        },
        where: sql`${LocationTable.location_id}=${locationId}`
    });
}

export const updateLocationService = async (locationId: number, location: Partial<TILocation>) => {
    const updatedLocation = await db.update(LocationTable)
        .set(location)
        .where(sql`${LocationTable.location_id}=${locationId}`)
        .returning();
    return updatedLocation[0];
}

export const deleteLocationService = async (locationId: number) => {
    // First check if location has any cars
    const location = await getLocationService(locationId);
    if (location && location.cars && location.cars.length > 0) {
        throw new Error("Cannot delete location with assigned cars");
    }
    
    return await db.delete(LocationTable)
        .where(sql`${LocationTable.location_id}=${locationId}`)
        .returning();
}