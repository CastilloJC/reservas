'use client';
import ReservationList from '@/components/ReservationList';
import ReservationModal from '@/components/ReservationModal';
import { Reservation } from '@prisma/client';
import { useState } from 'react';
import { apiRequest } from './utils/apiRequest';
import useSWR from 'swr';

export default function Home() {
  const [reservationSelect, setReservationSelect] = useState<Reservation | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState({
    name: '',
    status: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value); 
  };

  const { data, mutate } = useSWR(
    `/api/reservations?${search.name ? `name=${search.name}` : ''}${
      search.status ? `&status=${search.status}` : ''
    }`,
    apiRequest<Reservation[]>
  );

  const closeModal = () => {
    setOpenModal(false);
    setReservationSelect(null);
  };

  const handleEdit = (reservation: Reservation) => {
    setReservationSelect(reservation);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    const response = await apiRequest<Reservation>(`/api/reservations?id=${id}`, 'DELETE');
    if (response.ok) {
      mutate();
    }
  };

  const handleSearch = () => {
    setSearch({
      name: searchInput,
      status,
    });
  };

  const handleAddReservation = () => {
    setReservationSelect(null); 
    setOpenModal(true);
  };

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-semibold text-center mt-12'>Sistema de reservas - UPPEREAT -</h1>

      <div className='flex justify-between items-center my-8'>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(); 
          }}
          className='flex items-center gap-2'>
          <input
            type='text'
            placeholder='Buscar por nombre...'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className='border border-gray-300 rounded-l-md px-4 py-2 w-64 focus:outline-none focus:ring focus:ring-blue-300'
          />
          <select
            value={status}
            onChange={handleStatusChange}
            className='border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 h-10'>
            <option value=''>Todos</option>
            <option value='pending'>Pendiente</option>
            <option value='confirmed'>Confirmada</option>
            <option value='canceled'>Cancelada</option>
            <option value='completed'>Completada</option>
          </select>

          <button
            type='submit'
            className='bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'>
            Buscar
          </button>
          <button
            onClick={() => {
              setSearchInput('');
              setStatus('');
              setSearch({ name: '', status: '' });
            }}
            className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300'>
            Limpiar
          </button>
        </form>
        <button
          onClick={handleAddReservation}
          className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300'>
          Agregar Reserva
        </button>
      </div>

      <div></div>

      <ReservationModal
        reservationSelect={reservationSelect}
        mutate={mutate}
        openModal={openModal}
        setOpenModal={setOpenModal}
        closeModal={closeModal}
      />
      {data && (
        <ReservationList
          setReservationSelect={setReservationSelect}
          data={data?.data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
