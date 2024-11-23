import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// POST: Crear una nueva reserva
export async function POST(req: NextRequest) {
  const { name, numPeople, dateTime, status } = await req.json();

  try {
    const reservation = await prisma.reservation.create({
      data: {
        name,
        numPeople: parseInt(numPeople, 10),
        dateTime: new Date(dateTime),
        status: status || 'Pendiente',
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

// GET: Obtener todas las reservas
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const nameFilter = searchParams.get('name') || '';
  const statusFilter = searchParams.get('status') || '';

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        name: {
          contains: nameFilter, 
          mode: 'insensitive', 
        },
        status: statusFilter || undefined,
      },
      orderBy: { dateTime: 'asc' },
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

// PUT: Actualizar una reserva por ID
export async function PUT(req: NextRequest) {
  const { id, name, numPeople, dateTime, status } = await req.json();

  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        numPeople: parseInt(numPeople, 10),
        dateTime: new Date(dateTime),
        status,
      },
    });

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}

// DELETE: Eliminar una reserva por ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');
  try {
    await prisma.reservation.delete({
      where: { id: parseInt(id || '', 10) },
    });

    return NextResponse.json({ message: 'Reservation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }

}
