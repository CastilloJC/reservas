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
    <div className='overflow-x-auto'>
      <table className='min-w-full border-collapse border border-gray-300'>
        <thead>
          <tr>
            <th className='border border-gray-300 bg-gray-100 px-4 py-2 text-left'>
              Nombre de la reserva
            </th>
            <th className='border border-gray-300 bg-gray-100 px-4 py-2 text-left'>
              Fecha de la reserva
            </th>
            <th className='border border-gray-300 bg-gray-100 px-4 py-2 text-left'>Estado</th>
            <th className='border border-gray-300 bg-gray-100 px-4 py-2 text-center'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(reservation => (
            <tr key={reservation.id} className='hover:bg-gray-100'>
              <td className='border border-gray-300 px-4 py-2'>{reservation.name}</td>
              <td className='border border-gray-300 px-4 py-2'>
                {new Date(reservation.dateTime).toLocaleString()}
              </td>
              <td className='border border-gray-300 px-4 py-2 capitalize'>
                {translateStatus(reservation.status)}
              </td>
              <td className='border border-gray-300 px-4 py-2 text-center'>
                <button
                  onClick={() => handleEdit(reservation)}
                  className='mr-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200'>
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(reservation.id)}
                  className='px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200'>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
