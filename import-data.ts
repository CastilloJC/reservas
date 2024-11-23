import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  // Leer el archivo data.json
  const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

  // Insertar los datos en la base de datos
  for (const record of data) {
    await prisma.reservation.create({
      data: {
        name: record.name,
        numPeople: record.numPeople,
        dateTime: new Date(record.dateTime),
        status: record.status,
      },
    });
  }

  console.log('Datos importados con éxito.');
}

main()
  .catch((e) => {
    console.error('Error al importar los datos:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();

    // Eliminar el archivo generado después de la ejecución
    if (fs.existsSync('import-data.js')) {
      fs.unlinkSync('import-data.js');
      console.log('Archivo import-data.js eliminado.');
    }
  });
