const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const habits = [
    { name: 'Leer', description: 'Mínimo 30 minutos de lectura', emoji: '📚', color: '#3b82f6' },
    { name: 'Ejercicio', description: 'Cardio o pesas', emoji: '💪', color: '#ef4444' },
    { name: 'Meditar', description: '10 minutos de mindfulness', emoji: '🧘', color: '#a855f7' }
  ]
  
  for (const habit of habits) {
    await prisma.habit.create({ data: habit })
    console.log('Hábito creado:', habit.name)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
