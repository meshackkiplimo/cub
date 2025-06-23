import React, { useState } from 'react';
import * as yup from 'yup';
import { carAPI } from '../Features/cars/carApi';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type CarFormProps = {
  make: string;
  year: string;
  model: string;
  color: string;
  availability: string; // string here because it's passed as select value
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
  rental_rate: yup.number().required('Rental rate is required').positive('Rental rate must be positive'),
  location_id: yup.number().required('Location ID is required'),
  description: yup.string().required('Description is required'),
});

const CarForm = () => {
  const [createCar, { isLoading }] = carAPI.useCreateCarMutation();
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CarFormProps> = async (data) => {
    if (!image) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('make', data.make);
    formData.append('year', data.year);
    formData.append('model', data.model);
    formData.append('color', data.color);
    formData.append('availability', data.availability === 'true' ? 'true' : 'false');
    formData.append('rental_rate', data.rental_rate.toString());
    formData.append('location_id', data.location_id.toString());
    formData.append('description', data.description);
    formData.append('image', image); // important: backend must expect 'image'

    try {
      const response = await createCar(data).unwrap();
      console.log('Car created successfully:', response);
      reset();
      setImage(null);
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-300">
      <h1 className="font-bold text-gray-950 text-center text-xl mb-4">Create Car</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <input
          type="text"
          {...register('make')}
          placeholder="Car Manufacturer"
          className="input rounded w-full p-2 border-4"
        />
        {errors.make && <span className="text-sm text-red-700">{errors.make.message}</span>}

        <input
          type="text"
          {...register('year')}
          placeholder="Year"
          className="input rounded w-full p-2 border-4"
        />
        {errors.year && <span className="text-sm text-red-700">{errors.year.message}</span>}

        <input
          type="text"
          {...register('model')}
          placeholder="Model"
          className="input rounded w-full p-2 border-4"
        />
        {errors.model && <span className="text-sm text-red-700">{errors.model.message}</span>}

        <input
          type="text"
          {...register('color')}
          placeholder="Color"
          className="input rounded w-full p-2 border-4"
        />
        {errors.color && <span className="text-sm text-red-700">{errors.color.message}</span>}

        <select
          {...register('availability')}
          className="input rounded w-full p-2 border-4"
        >
          <option value="">Select Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        {errors.availability && <span className="text-sm text-red-700">{errors.availability.message}</span>}

        <input
          type="number"
          {...register('rental_rate')}
          placeholder="Rental Rate"
          className="input rounded w-full p-2 border-4"
        />
        {errors.rental_rate && <span className="text-sm text-red-700">{errors.rental_rate.message}</span>}

        <input
          type="number"
          {...register('location_id')}
          placeholder="Location ID"
          className="input rounded w-full p-2 border-4"
        />
        {errors.location_id && <span className="text-sm text-red-700">{errors.location_id.message}</span>}

       

        <textarea
          {...register('description')}
          placeholder="Description"
          className="input rounded w-full p-2 border-4"
        ></textarea>
        {errors.description && <span className="text-sm text-red-700">{errors.description.message}</span>}
         <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImage(file);
          }}
          className="input rounded w-full p-2 border-4"
        />

        <button type="submit" className="btn btn-primary bg-amber-400" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner text-white" /> Creating...
            </>
          ) : (
            'Create'
          )}
        </button>
      </form>
    </div>
  );
};

export default CarForm;
