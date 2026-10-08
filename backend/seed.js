const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found. Please register a user first.");
    return;
  }

  console.log("Seeding data for user:", user.email);

  const projects = [
    { name: "Website Redesign", description: "Overhaul the main marketing site", status: "IN_PROGRESS" },
    { name: "Mobile App V2", description: "React Native rewrite for better performance", status: "IN_PROGRESS" },
    { name: "Q4 Marketing Campaign", description: "Holiday season marketing push", status: "NOT_STARTED" },
    { name: "Database Migration", description: "Move from MySQL to PostgreSQL", status: "COMPLETED" },
    { name: "User Research", description: "Conduct interviews for new feature", status: "IN_PROGRESS" },
    { name: "Security Audit", description: "Annual penetration testing and fixes", status: "NOT_STARTED" },
  ];

  const tasksData = [
    { name: "Design new homepage", priority: "HIGH" },
    { name: "Setup CI/CD pipeline", priority: "HIGH" },
    { name: "Write copy for landing page", priority: "MEDIUM" },
    { name: "Fix navigation bug", priority: "HIGH" },
    { name: "Update user profile UI", priority: "LOW" },
    { name: "Draft announcement email", priority: "MEDIUM" },
    { name: "Review pull requests", priority: "HIGH" },
    { name: "Schedule team meeting", priority: "LOW" },
    { name: "Optimize database queries", priority: "HIGH" },
    { name: "Test payment gateway", priority: "HIGH" },
  ];

  for (const p of projects) {
    const project = await prisma.project.create({
      data: {
        name: p.name,
        description: p.description,
        status: p.status,
        owner_id: user.id
      }
    });

    for (let i = 0; i < 3; i++) {
      const taskT = tasksData[Math.floor(Math.random() * tasksData.length)];
      await prisma.task.create({
        data: {
          name: taskT.name + " - " + p.name,
          description: "Details for " + taskT.name,
          status: Math.random() > 0.5 ? "PENDING" : "COMPLETED",
          priority: taskT.priority,
          project_id: project.id
        }
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
