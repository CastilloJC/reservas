import { Reservation } from '@prisma/client';

interface ReservationsPageProps {
  setReservationSelect: (reservation: Reservation) => void;
  data: Reservation[] | undefined;
  handleEdit: (reservation: Reservation) => void;
  handleDelete: (id: number) => void;
}

export default function ReservationTable({
  data,
  handleEdit,
  handleDelete,
}: ReservationsPageProps) {
  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'canceled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };

  return (
<div className="overflow-x-auto w-full bg-white shadow-md rounded-lg border border-gray-300">
  <table className="min-w-full table-fixed border-collapse">
    <thead className="bg-gray-200 sticky top-0 z-10">
      <tr>
        <th className="px-4 py-2 text-left w-1/4">Nombre de la reserva</th>
        <th className="px-4 py-2 text-left w-1/4">Fecha de la reserva</th>
        <th className="px-4 py-2 text-left w-1/4">Número de personas</th>
        
        <th className="px-4 py-2 text-left w-1/4">Estado</th>
        <th className="px-4 py-2 text-center w-1/4">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {data?.map((reservation) => (
        <tr
          key={reservation.id}
          className="hover:bg-gray-100 border-b transition duration-200"
        >
          <td className="border border-gray-300 px-4 py-2 text-sm truncate">
            {reservation.name}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-sm truncate">
            {new Date(reservation.dateTime).toLocaleString()}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-sm truncate">
            {reservation.numPeople}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-sm capitalize truncate">
            {translateStatus(reservation.status)}
          </td>
          <td className="px-4 py-2 text-center flex justify-center gap-2">
            <button
              onClick={() => handleEdit(reservation)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-600 text-sm"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => handleDelete(reservation.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 text-sm"
            >
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
