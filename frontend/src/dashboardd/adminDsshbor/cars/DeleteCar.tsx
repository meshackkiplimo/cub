import React from 'react'
import { carAPI } from '../../../Features/cars/carApi';

interface DeleteProps {
    carId: number;
}

const DeleteCar: React.FC<DeleteProps> = ({ carId }) => {
    const [deleteCar] = carAPI.useDeleteCarMutation();

    const handleDelete = async (carId: number) => {
        try {
            await deleteCar(carId.toString()).unwrap();
            // Optionally, you can show a success message or update the UI
            console.log("Car deleted successfully");
        } catch (error) {
            console.error("Failed to delete car:", error);
            // Optionally, show an error message
        }
    };

    return (
        <div>
            <dialog id="delete_car_modal" className="modal">
                <form method="dialog" className="modal-box bg-amber-400">
                    <h3 className="font-bold text-lg">Delete Car</h3>
                    <p>Are you sure you want to delete this car?</p>
                    <div className="modal-action">
                        <button
                            className="btn btn-error"
                            onClick={() => handleDelete(carId)}
                        >
                            Delete
                        </button>
                        <button className="btn">Cancel</button>
                    </div>
                </form>
            </dialog>
            <button
                className="btn btn-error"
                onClick={() => (document.getElementById('delete_car_modal') as HTMLDialogElement)?.showModal()}
            >
                Delete Car
            </button>
        </div>
    );
};

export default DeleteCar
