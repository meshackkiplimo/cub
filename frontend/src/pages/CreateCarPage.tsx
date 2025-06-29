import React from 'react'
import CarForm from '../dashboardd/adminDsshbor/cars/CarForm'

const CreateCarPage = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4 pt-8">Create New Car</h1>
        <p className="mb-6">Fill out the form below to add a new car to the inventory.</p>
        {/* CarForm component will be imported and used here */}
        {/* <CarForm /> */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p>Car form will go here.</p>
        </div>

        <CarForm/>
      
    </div>
  )
}

export default CreateCarPage
