import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create an Admin
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@skill2success.com' },
    update: {},
    create: {
      email: 'admin@skill2success.com',
      password: 'hashed_password_placeholder', // We will hash this properly later
      name: 'Super Admin',
      role: 'ADMIN',
    },
  })

  // 2. Create an Instructor
  const instructor = await prisma.instructor.create({
    data: {
      name: 'John Smith',
      title: 'Senior AI Engineer & Educator',
      signature: '/images/signatures/john-smith.png',
    },
  })

  // 3. Create a Course
  const course = await prisma.course.create({
    data: {
      name: 'Artificial Intelligence',
      description: 'Comprehensive course on modern AI, Machine Learning, and Neural Networks.',
    },
  })

  // 4. Create Students and issue Certificates
  const studentNames = [
    'Zain Rashid',
    'Ali Khan',
    'Fatima Noor',
    'Ahmed Raza',
    'Aisha Tariq',
  ]

  for (let i = 0; i < studentNames.length; i++) {
    const student = await prisma.student.create({
      data: {
        name: studentNames[i],
        email: `student${i + 1}@example.com`,
      },
    })

    const credentialId = `AI-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    
    // We create a dummy hash for now. Later our HashService will generate this.
    const dummyHash = `sha256-dummy-hash-for-${credentialId}`

    await prisma.certificate.create({
      data: {
        credentialId,
        studentId: student.id,
        courseId: course.id,
        instructorId: instructor.id,
        completionDate: new Date('2026-06-15T00:00:00.000Z'),
        status: 'VALID',
        hash: dummyHash,
      },
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
