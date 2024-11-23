import { Reservation } from '@prisma/client';
import ReservationTable from './Tables/ReservationTable';

interface ReservationsPageProps {
  setReservationSelect: (reservation: Reservation) => void;
  data: Reservation[] | undefined;
  handleEdit: (reservation: Reservation) => void;
  handleDelete: (id: number) => void;
}

export default function ReservationList({ setReservationSelect, data, handleDelete, handleEdit }: ReservationsPageProps) {

  return (
    <div>
        <ReservationTable data={data} setReservationSelect={setReservationSelect} handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
}
