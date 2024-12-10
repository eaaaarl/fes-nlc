import { hashPassword } from "../lib/password";
import prisma from "../lib/db";
import { env } from "../lib/env";

async function main() {
  const encryptPass = await hashPassword(env.ADMIN_PASS);
  await prisma.user.upsert({
    where: { username: env.ADMIN_USER },
    update: {
      password: encryptPass,
    },
    create: {
      username: env.ADMIN_USER,
      password: encryptPass,
      Role: "ADMINISTRATOR",
    },
  });

  /* const categoryData = [
    {
      categoryName: "COMMITMENT",
      questions: [
        "Demonstrate sensitivity to students ability to attend and absorb content information.",
        "Integrates sensitively his/her learning objectives with those of the students in a collaborative process.",
        "Makes self-available to students beyond official time.",
        "Regularly comes to class on time, well-groomed and well prepared to complete assigned responsibilities.",
        "Keeps accurate records of students performance and prompt submission of the same.",
      ],
    },
    {
      categoryName: "KNOWLEDGE OF SUBJECT",
      questions: [
        "Demonstrated mastery of the subject matter (explain the subject matter without relying solely on the prescribed textbook).",
        "Draws and share information on the state on the art of theory and practice in his/her discipline.",
        "Integrates subject to practical circumstances and learning intents/purposes of students.",
        "Explains the relevance of present topics to the previous lessons, and relates the subject matter to relevant current issues and/or daily life activities.",
        "Demonstrates up-to-date knowledge and/or awareness on current trends and issues of the subject",
      ],
    },
    {
      categoryName: "TEACHING FOR INDEPENDENT LEARNING",
      questions: [
        "Creates teaching strategies that allow students to practice using concepts they need to understand (interactive discussion)",
        "Enhances students’ self-esteem and/or gives due recognition to students’ performance/potentials.",
        "Allows students to create their own course with objectives and realistically defined student-professor rules and make them accountable for their performance.",
        "Allows students to think independently and make their own decisions and holding them accountable for their performance based largely on their success in executing decisions.",
        "Encourages students to learn beyond what is required and help/guide the students how to apply the concepts learned.    ",
      ],
    },
    {
      categoryName: "MANAGEMENT OF LEARNING",
      questions: [
        "Creates opportunities for intensive and/or extensive contribution of students in the class activities (e.g. breaks class into dyads, triads or buzz/task groups).",
        "Assumes roles as facilitator, resource person, coach inquisitor, integrator, referee in drawing students to contribute to knowledge and understanding of the concepts at hands.",
        "Designs and implements learning conditions and experience that promotes healthy exchange and/or confrontations.",
        "Structures/re-structures learning and teaching-learning context to enhance attainment of collective learning objectives.",
        "Use of instructional materials (audio/video materials, fieldtrips, film showing, computer-aided instruction, etc.) to reinforce learning process.",
      ],
    },
  ];

  const ratingScaleData = [
    { rating: 1, description: "POOR" },
    { rating: 2, description: "FAIR" },
    { rating: 3, description: "SATISFACTORY" },
    { rating: 4, description: "VERY SATISFACTORY" },
    { rating: 5, description: "OUTSTANDING" },
  ];

  for (const category of categoryData) {
    const existingCategory = await prisma.category.findUnique({
      where: { categoryName: category.categoryName },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: {
          categoryName: category.categoryName,
          questions: {
            create: category.questions.map((questionName) => ({
              questionName,
            })),
          },
        },
      });
      console.log(`Created category: ${category.categoryName}`);
    } else {
      console.log(
        `Category "${category.categoryName}" already exists. Skipping.`
      );
    }
  }

  for (const scale of ratingScaleData) {
    const existingScale = await prisma.ratingScale.findFirst({
      where: {
        rating: scale.rating,
        description: scale.description,
      },
    });

    if (!existingScale) {
      await prisma.ratingScale.create({
        data: {
          rating: scale.rating,
          description: scale.description,
        },
      });
      console.log(`Created rating scale: ${scale.description}`);
    } else {
      console.log(
        `Rating scale "${scale.description}" already exists. Skipping.`
      );
    }
  } */
  /* await prisma.subject.createMany({
    data: [
      {
        subjectName: "Automata Theory and Formal Languages",
      },
      {
        subjectName: "Application Devt & Emerging Tech",
      },
      {
        subjectName: "Life and Works of Rizal",
      },
      {
        subjectName: "System Fundamentals",
      },
      {
        subjectName: "Architecture and Organization",
      },
      {
        subjectName: "Web System and Technologies 2",
      },
      {
        subjectName: "Information Assurance and Security",
      },
      {
        subjectName: "Data Structures and Algorithms",
      },
      {
        subjectName:
          "Menu of Dance, Sports, Martial Arts, Group Exercise, Outdoor and Adventure Activities",
      },
      {
        subjectName: "Object-Oriented Programming",
      },
      {
        subjectName: "Discrete Structure 2",
      },
      {
        subjectName: "Embedded Systems",
      },
      {
        subjectName: "The Entrepreneurial Mind",
      },
      {
        subjectName: "Arts Appreciation",
      },
    ],
  }); */
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
