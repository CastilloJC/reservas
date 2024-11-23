'use client';

import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Reservation } from '@prisma/client';
import { apiRequest } from '@/app/utils/apiRequest';

type FormValues = {
  id?: number;
  name: string;
  numPeople: number;
  dateTime: string;
  status: string;
};

interface ReservationModalProps {
  reservationSelect?: Reservation | null;
  mutate: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  closeModal: () => void;
}

const validationSchema = Yup.object().shape({
  id: Yup.number(),
  name: Yup.string().required('Nombre es requerido'),
  numPeople: Yup.number()
    .required('Número de personas es requerido')
    .min(1, 'El número de personas debe ser mayor a 0'),
  dateTime: Yup.string().required('Fecha y hora es requerida'),
  status: Yup.string()
    .required('Estado es requerido')
    .oneOf(['pending', 'confirmed', 'canceled', 'completed'], 'Invalid status value'),
});

const ReservationModal: FC<ReservationModalProps> = ({
  reservationSelect,
  mutate,
  openModal,
  closeModal,
}) => {
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: reservationSelect?.id || undefined,
      name: '',
      numPeople: 1,
      dateTime: new Date().toISOString().slice(0, 16),
      status: reservationSelect?.status || 'pending',
    },
    values: {
      id: reservationSelect?.id || undefined,
      name: reservationSelect?.name || '',
      numPeople: reservationSelect?.numPeople || 1,
      dateTime: new Date(reservationSelect?.dateTime || new Date()).toISOString().slice(0, 16),
      status: reservationSelect?.status || 'pending',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async data => {
    try {
      const response = await apiRequest<Reservation>(
        '/api/reservations',
        reservationSelect ? 'PUT' : 'POST',
        {
          id: data.id,
          name: data.name,
          numPeople: data.numPeople,
          dateTime: new Date(data.dateTime),
          status: data.status,
        }
      );

      if (response.ok) {
        setAlert({
          message: `Reservación ${
            reservationSelect ? 'actualizada' : 'creada'
          } satisfactoriamente.`,
          type: 'success',
        });
        mutate();
        reset();
        // setIsOpen(false); // Cerrar el modal después del éxito
      } else {
        setAlert({ message: response.error || 'Failed to create reservation.', type: 'error' });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setAlert({ message: 'An unexpected error occurred.', type: 'error' });
    }
  };

  return (
    <div>
      {openModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded shadow-md w-96 relative'>
            <button
              onClick={() => {
                closeModal();
                setAlert(null);
              }}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 size-10 text-3xl'>
              ×
            </button>

            <h1 className='text-2xl font-bold mb-4'>
              {reservationSelect ? 'Editar' : 'Crear'} reservación
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                  Nombre de la reserva
                </label>
                <input
                  type='text'
                  id='name'
                  {...register('name')}
                  className={`mt-1 block w-full border h-10 p-2 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
              </div>

              <div className='mb-4'>
                <label htmlFor='numPeople' className='block text-sm font-medium text-gray-700'>
                  Número de personas
                </label>
                <input
                  type='number'
                  id='numPeople'
                  {...register('numPeople')}
                  className={`mt-1 block w-full border h-10 p-2 ${
                    errors.numPeople ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  min={1}
                />
                {errors.numPeople && (
                  <p className='text-red-500 text-sm mt-1'>{errors.numPeople.message}</p>
                )}
              </div>

              <div className='mb-4'>
                <label htmlFor='dateTime' className='block text-sm font-medium text-gray-700'>
                  Fecha y hora
                </label>
                <input
                  type='datetime-local'
                  id='dateTime'
                  {...register('dateTime')}
                  className={`mt-1 block w-full border h-10 p-2 ${
                    errors.dateTime ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.dateTime && (
                  <p className='text-red-500 text-sm mt-1'>{errors.dateTime.message}</p>
                )}
              </div>

              <div className='mb-4'>
                <label htmlFor='status' className='block text-sm font-medium text-gray-700'>
                  Estado de la reserva (Por defecto: Pendiente)
                </label>
                <select
                  id='status'
                  {...register('status')}
                  className={`mt-1 block w-full border h-10 p-2 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}>
                  <option value='pending'>Pendiente</option>
                  <option value='confirmed'>Confirmada</option>
                  <option value='canceled'>Cancelada</option>
                  <option value='completed'>Completada</option>
                </select>
                {errors.status && (
                  <p className='text-red-500 text-sm mt-1'>{errors.status.message}</p>
                )}
              </div>

              <button
                type='submit'
                className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                {reservationSelect ? 'Editar' : 'Crear'} reservación
              </button>

              {alert && (
                <div
                  className={`mt-4 px-4 py-2 rounded ${
                    alert.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {alert.message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationModal;
