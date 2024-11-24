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
<div className="p-4 sm:p-6 lg:p-10">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mt-4 mb-6 text-gray-800 tracking-wide">
    <span className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
      Sistema de Reservas
    </span>{" "}
    <span className="text-blue-600">UPPEREAT 🍽️</span>
  </h1>

  {/* Contenedor de acciones */}
  <div className="flex flex-col lg:flex-row justify-between items-center gap-4 my-8 bg-gray-100 p-4 rounded-md shadow-sm">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto"
    >
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring focus:ring-blue-300"
      />

      {/* Select de estado */}
      <select
        value={status}
        onChange={handleStatusChange}
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-full sm:w-auto h-10"
      >
        <option value="">Todos</option>
        <option value="pending">Pendiente</option>
        <option value="confirmed">Confirmada</option>
        <option value="canceled">Cancelada</option>
        <option value="completed">Completada</option>
      </select>

      {/* Botones */}
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md px-4 py-2 w-full sm:w-auto hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Buscar
      </button>
      <button
        onClick={() => {
          setSearchInput("");
          setStatus("");
          setSearch({ name: "", status: "" });
        }}
        className="px-4 py-2 w-full sm:w-auto rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Limpiar
      </button>
    </form>

    {/* Botón de agregar */}
    <button
      onClick={handleAddReservation}
      className="bg-green-500 text-white px-4 py-2 rounded-md w-full lg:w-auto hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
    >
      Agregar Reserva
    </button>
  </div>

  {/* Contenedor del modal */}
  <ReservationModal
    reservationSelect={reservationSelect}
    mutate={mutate}
    openModal={openModal}
    setOpenModal={setOpenModal}
    closeModal={closeModal}
  />

  {/* Listado de reservas */}
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
