import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import * as yup from 'yup';
import { carAPI } from '../../../Features/cars/carApi';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type CarFormProps = {};

export type CarFormHandle = {
  openDialog: () => void;
};

type FormFields = {
  make: string;
  year: string;
  model: string;
  color: string;
  availability: string;
  rental_rate: number;
  location_id: number;
  description: string;
};

const schema = yup.object({
  make: yup.string().required('Make is required'),
  year: yup.string().required('Year is required'),
  model: yup.string().required('Model is required'),
  color: yup.string().required('Color is required'),
  availability: yup.string().required('Availability is required'),
  rental_rate: yup.number().required().positive(),
  location_id: yup.number().required(),
  description: yup.string().required(),
});

const CarForm = forwardRef<CarFormHandle, CarFormProps>((_, ref) => {
  const [createCar, { isLoading }] = carAPI.useCreateCarMutation();
  const [image, setImage] = useState<File | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({ resolver: yupResolver(schema) });

  // Expose the method to parent via ref
  useImperativeHandle(ref, () => ({
    openDialog: () => dialogRef.current?.showModal(),
  }));

  const closeDialog = () => dialogRef.current?.close();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!image) return alert('Please select an image.');

    const formData = new FormData();
    formData.append('make', data.make);
    formData.append('year', data.year);
    formData.append('model', data.model);
    formData.append('color', data.color);
    formData.append('availability', data.availability === 'true' ? 'true' : 'false');
    formData.append('rental_rate', data.rental_rate.toString());
    formData.append('location_id', data.location_id.toString());
    formData.append('description', data.description);
    formData.append('image', image);

    try {
      await createCar(formData).unwrap();
      reset();
      setImage(null);
      closeDialog();
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal rounded-lg w-full max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Car</h2>
          <button type="button" onClick={closeDialog} className="text-gray-600 hover:text-black text-lg">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input {...register('make')} placeholder="Make" className="input input-bordered border-4 " />
          {errors.make && <p className="text-red-600 text-sm">{errors.make.message}</p>}

          <input {...register('year')} placeholder="Year" className="input input-bordered border-4" />
          {errors.year && <p className="text-red-600 text-sm">{errors.year.message}</p>}

          <input {...register('model')} placeholder="Model" className="input input-bordered border-4 " />
          {errors.model && <p className="text-red-600 text-sm">{errors.model.message}</p>}

          <input {...register('color')} placeholder="Color" className="input input-bordered border-4" />
          {errors.color && <p className="text-red-600 text-sm">{errors.color.message}</p>}

          <select {...register('availability')} className="input input-borderedborder-4">
            <option value="">Select Availability</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          {errors.availability && <p className="text-red-600 text-sm">{errors.availability.message}</p>}

          <input type="number" {...register('rental_rate')} placeholder="Rental Rate" className="input input-bordered border-4" />
          {errors.rental_rate && <p className="text-red-600 text-sm">{errors.rental_rate.message}</p>}

          <input type="number" {...register('location_id')} placeholder="Location ID" className="input input-bordered border-4" />
          {errors.location_id && <p className="text-red-600 text-sm">{errors.location_id.message}</p>}

          <textarea {...register('description')} placeholder="Description" className="input input-bordered border-4"></textarea>
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}

          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="input input-bordered" />

          <button type="submit" className="btn bg-amber-500 text-white" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </dialog>
  );
});

export default CarForm;
