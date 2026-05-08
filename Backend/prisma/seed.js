const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma/client");

const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const catalog = [
  {
    group: {
      title: "JavaScript Path",
      type: "JavaScript",
      description: "Core JavaScript from basics to asynchronous patterns.",
    },
    courses: [
      {
        title: "JavaScript Basics",
        description: "Variables, conditions, loops and core syntax.",
        language: "JavaScript",
        level: "beginner",
        points: 250,
        modules: [
          {
            title: "Variables and Data Types",
            theory:
              "In JavaScript, variables are containers for values. Use const for values that should not be reassigned and let for mutable bindings.",
            task: {
              title: "Create and return a constant",
              description: "Create a constant x with value 10 and return it.",
              starterCode: "function solve() {\n  // TODO\n}",
              solutionCode: "function solve() {\n  const x = 10;\n  return x;\n}",
              difficulty: "easy",
              tests: [{ input: "none", expectedOutput: "10" }],
            },
            quiz: {
              question: "Which keyword creates a block-scoped mutable variable?",
              answerVariants: ["var", "const", "let", "function"],
              correctAnswer: "let",
            },
          },
          {
            title: "Conditions and Loops",
            theory:
              "Conditions allow branching with if/else. Loops like for and while help repeat operations.",
            task: {
              title: "Sum first five numbers",
              description: "Return the sum of numbers from 1 to 5.",
              starterCode: "function solve() {\n  // TODO\n}",
              solutionCode:
                "function solve() {\n  let sum = 0;\n  for (let i = 1; i <= 5; i++) sum += i;\n  return sum;\n}",
              difficulty: "easy",
              tests: [{ input: "none", expectedOutput: "15" }],
            },
            quiz: {
              question: "Which loop executes while condition is true?",
              answerVariants: ["if", "switch", "while", "map"],
              correctAnswer: "while",
            },
          },
        ],
      },
      {
        title: "JavaScript Intermediate",
        description: "Functions, arrays, and object transformations.",
        language: "JavaScript",
        level: "intermediate",
        points: 350,
        modules: [
          {
            title: "Array Methods",
            theory:
              "map transforms arrays, filter keeps matching items, and reduce accumulates values into a single result.",
            task: {
              title: "Filter even numbers",
              description: "Return only even numbers from the input array.",
              starterCode:
                "function filterEvenNumbers(arr) {\n  // TODO\n}",
              solutionCode:
                "function filterEvenNumbers(arr) {\n  return arr.filter((n) => n % 2 === 0);\n}",
              difficulty: "easy",
              tests: [
                { input: "[1,2,3,4]", expectedOutput: "[2,4]" },
                { input: "[10,15,20]", expectedOutput: "[10,20]" },
              ],
            },
            quiz: {
              question: "What does map return?",
              answerVariants: [
                "A single value",
                "The original array",
                "A new transformed array",
                "undefined",
              ],
              correctAnswer: "A new transformed array",
            },
          },
          {
            title: "Objects and Destructuring",
            theory:
              "Objects store key-value pairs. Destructuring helps pull fields out of objects and arrays in a readable way.",
            task: {
              title: "Get full name",
              description: "Return `${firstName} ${lastName}` from a user object.",
              starterCode: "function solve(user) {\n  // TODO\n}",
              solutionCode:
                "function solve(user) {\n  const { firstName, lastName } = user;\n  return `${firstName} ${lastName}`;\n}",
              difficulty: "medium",
              tests: [{ input: "{firstName:'Ada',lastName:'Lovelace'}", expectedOutput: "Ada Lovelace" }],
            },
            quiz: {
              question: "What does object destructuring improve?",
              answerVariants: ["Bundle size", "Readability", "CPU frequency", "Encryption"],
              correctAnswer: "Readability",
            },
          },
        ],
      },
    ],
  },
  {
    group: {
      title: "React Path",
      type: "React",
      description: "Build modern UI with components and hooks.",
    },
    courses: [
      {
        title: "React Fundamentals",
        description: "Components, props and state management basics.",
        language: "JavaScript",
        level: "beginner",
        points: 300,
        modules: [
          {
            title: "Components and Props",
            theory:
              "React components are reusable UI building blocks. Props pass data from parent to child components.",
            task: {
              title: "Render greeting component",
              description: "Create a component that renders `Hello, {name}`.",
              starterCode:
                "export default function Greeting({ name }) {\n  // TODO\n}",
              solutionCode:
                "export default function Greeting({ name }) {\n  return <h1>Hello, {name}</h1>;\n}",
              difficulty: "easy",
              tests: [{ input: "name='Alex'", expectedOutput: "Hello, Alex" }],
            },
            quiz: {
              question: "How do props flow in React?",
              answerVariants: ["Child to parent", "Parent to child", "Two-way always", "Random"],
              correctAnswer: "Parent to child",
            },
          },
          {
            title: "State and Effects",
            theory:
              "useState stores local state; useEffect runs side effects like data fetching after render.",
            task: {
              title: "Counter with increment button",
              description: "Build a counter component with +1 button.",
              starterCode:
                "import { useState } from 'react';\nexport default function Counter() {\n  // TODO\n}",
              solutionCode:
                "import { useState } from 'react';\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
              difficulty: "medium",
              tests: [{ input: "click +1", expectedOutput: "count increments" }],
            },
            quiz: {
              question: "What hook is used for side effects?",
              answerVariants: ["useMemo", "useEffect", "useReducer", "useRef"],
              correctAnswer: "useEffect",
            },
          },
        ],
      },
    ],
  },
  {
    group: {
      title: "TypeScript Path",
      type: "TypeScript",
      description: "Type-safe development for scalable frontend and backend code.",
    },
    courses: [
      {
        title: "TypeScript Essentials",
        description: "Types, interfaces, unions and generics.",
        language: "TypeScript",
        level: "beginner",
        points: 280,
        modules: [
          {
            title: "Primitive and Object Types",
            theory:
              "TypeScript adds static typing to JavaScript. Types help catch bugs before runtime.",
            task: {
              title: "Type a user object",
              description: "Define interface User with id:number and name:string.",
              starterCode: "// TODO: add interface User\n",
              solutionCode: "interface User { id: number; name: string; }\n",
              difficulty: "easy",
              tests: [{ input: "User typing", expectedOutput: "id:number,name:string" }],
            },
            quiz: {
              question: "What does TypeScript primarily provide?",
              answerVariants: ["Runtime VM", "Static typing", "Browser engine", "Database"],
              correctAnswer: "Static typing",
            },
          },
          {
            title: "Generics",
            theory:
              "Generics let you write reusable functions/classes while preserving type information.",
            task: {
              title: "Generic identity function",
              description: "Implement identity<T>(value:T):T.",
              starterCode: "function identity(value) {\n  // TODO\n}\n",
              solutionCode: "function identity<T>(value: T): T {\n  return value;\n}\n",
              difficulty: "medium",
              tests: [{ input: "identity<number>(5)", expectedOutput: "5" }],
            },
            quiz: {
              question: "What is the key benefit of generics?",
              answerVariants: ["Smaller files", "Type-safe reuse", "Faster CPU", "No compilation"],
              correctAnswer: "Type-safe reuse",
            },
          },
        ],
      },
    ],
  },
];

async function clearDatabase() {
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.activityHistory.deleteMany();
  await prisma.pointsHistory.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.taskAIMessage.deleteMany();
  await prisma.taskAIChat.deleteMany();
  await prisma.globalAIMessage.deleteMany();
  await prisma.globalAIChat.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.userModuleProgress.deleteMany();
  await prisma.userQuizProgress.deleteMany();
  await prisma.userTaskProgress.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.codeTest.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.task.deleteMany();
  await prisma.theory.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.courseGroup.deleteMany();
  await prisma.user.deleteMany();
}

async function seedLearningCatalog() {
  const moduleIds = [];
  const taskIds = [];
  const quizIds = [];
  const courseIds = [];

  for (const groupData of catalog) {
    const group = await prisma.courseGroup.create({ data: groupData.group });

    for (const courseData of groupData.courses) {
      const { modules, ...courseMeta } = courseData;
      const course = await prisma.course.create({
        data: {
          ...courseMeta,
          courseGroupId: group.id,
        },
      });
      courseIds.push(course.id);

      let index = 1;
      for (const moduleData of modules) {
        const module = await prisma.module.create({
          data: {
            courseId: course.id,
            title: moduleData.title,
            orderIndex: index++,
          },
        });
        moduleIds.push(module.id);

        await prisma.theory.create({
          data: {
            moduleId: module.id,
            content: moduleData.theory,
          },
        });

        const task = await prisma.task.create({
          data: {
            moduleId: module.id,
            title: moduleData.task.title,
            description: moduleData.task.description,
            starterCode: moduleData.task.starterCode,
            solutionCode: moduleData.task.solutionCode,
            difficulty: moduleData.task.difficulty,
          },
        });
        taskIds.push(task.id);

        await prisma.codeTest.createMany({
          data: moduleData.task.tests.map((test) => ({
            taskId: task.id,
            input: test.input,
            expectedOutput: test.expectedOutput,
          })),
        });

        const quiz = await prisma.quiz.create({
          data: {
            moduleId: module.id,
            question: moduleData.quiz.question,
            answerVariants: moduleData.quiz.answerVariants,
            correctAnswer: moduleData.quiz.correctAnswer,
          },
        });
        quizIds.push(quiz.id);
      }
    }
  }

  return { moduleIds, taskIds, quizIds, courseIds };
}

async function seedAchievements() {
  const achievements = await prisma.$transaction([
    prisma.achievement.create({
      data: {
        title: "First Steps",
        description: "Complete your first task",
      },
    }),
    prisma.achievement.create({
      data: {
        title: "Quiz Starter",
        description: "Pass your first quiz",
      },
    }),
    prisma.achievement.create({
      data: {
        title: "Streak 7",
        description: "Maintain a 7-day activity streak",
      },
    }),
    prisma.achievement.create({
      data: {
        title: "Task Crusher",
        description: "Complete 10 tasks",
      },
    }),
    prisma.achievement.create({
      data: {
        title: "Consistent Learner",
        description: "Study at least 30 minutes for 10 different days",
      },
    }),
  ]);

  return achievements;
}

async function seedUsers(ids, achievements) {
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        username: "alex",
        passwordHash,
        totalPoints: 980,
        level: "intermediate",
        daysStreak: 12,
      },
    }),
    prisma.user.create({
      data: {
        username: "maria",
        passwordHash,
        totalPoints: 1250,
        level: "advanced",
        daysStreak: 18,
      },
    }),
    prisma.user.create({
      data: {
        username: "david",
        passwordHash,
        totalPoints: 680,
        level: "intermediate",
        daysStreak: 6,
      },
    }),
    prisma.user.create({
      data: {
        username: "sophia",
        passwordHash,
        totalPoints: 430,
        level: "beginner",
        daysStreak: 4,
      },
    }),
    prisma.user.create({
      data: {
        username: "mentor_demo",
        passwordHash,
        totalPoints: 320,
        level: "beginner",
        daysStreak: 3,
      },
    }),
  ]);

  for (const user of users) {
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        settings: {
          theme: user.username === "alex" ? "dark" : "light",
          notifications: true,
          aiEnabled: true,
          autoSuggestions: true,
          dailyReminders: true,
        },
      },
    });
  }

  const activityTemplate = [60 * 45, 60 * 30, 60 * 20, 60 * 55, 60 * 35, 60 * 25, 60 * 40];
  for (const user of users) {
    for (let i = 0; i < 14; i++) {
      await prisma.activityHistory.create({
        data: {
          userId: user.id,
          date: daysAgo(i),
          timeSpentSeconds: activityTemplate[i % activityTemplate.length],
        },
      });
    }
  }

  const userAchievementMap = [
    [users[0].id, [achievements[0].id, achievements[1].id, achievements[2].id]],
    [users[1].id, achievements.map((a) => a.id)],
    [users[2].id, [achievements[0].id, achievements[1].id]],
    [users[3].id, [achievements[0].id]],
    [users[4].id, [achievements[0].id]],
  ];

  for (const [userId, achievementIds] of userAchievementMap) {
    for (const achievementId of achievementIds) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId,
        },
      });
    }
  }

  const completedTaskIdsByUser = [
    ids.taskIds.slice(0, 6),
    ids.taskIds.slice(0, 8),
    ids.taskIds.slice(0, 4),
    ids.taskIds.slice(0, 3),
    ids.taskIds.slice(0, 2),
  ];
  const completedQuizIdsByUser = [
    ids.quizIds.slice(0, 6),
    ids.quizIds.slice(0, 8),
    ids.quizIds.slice(0, 4),
    ids.quizIds.slice(0, 3),
    ids.quizIds.slice(0, 2),
  ];

  for (let index = 0; index < users.length; index++) {
    const userId = users[index].id;
    const taskIds = completedTaskIdsByUser[index];
    const quizIds = completedQuizIdsByUser[index];

    for (const taskId of taskIds) {
      await prisma.userTaskProgress.create({
        data: {
          userId,
          taskId,
          isCompleted: true,
          completedAt: daysAgo(Math.floor(Math.random() * 8)),
        },
      });

      await prisma.attempt.create({
        data: {
          userId,
          taskId,
          code: "function solve(){ return 'correct'; }",
          isCorrect: true,
          createdAt: daysAgo(Math.floor(Math.random() * 8)),
        },
      });

      await prisma.pointsHistory.create({
        data: {
          userId,
          delta: 10,
          createdAt: daysAgo(Math.floor(Math.random() * 8)),
        },
      });
    }

    for (const quizId of quizIds) {
      await prisma.userQuizProgress.create({
        data: {
          userId,
          quizId,
          isCompleted: true,
        },
      });
    }
  }

  for (const user of users) {
    for (const moduleId of ids.moduleIds) {
      const tasksInModule = await prisma.task.count({ where: { moduleId } });
      const quizzesInModule = await prisma.quiz.count({ where: { moduleId } });
      const completedTasks = await prisma.userTaskProgress.count({
        where: {
          userId: user.id,
          isCompleted: true,
          task: { moduleId },
        },
      });
      const completedQuizzes = await prisma.userQuizProgress.count({
        where: {
          userId: user.id,
          isCompleted: true,
          quiz: { moduleId },
        },
      });

      await prisma.userModuleProgress.create({
        data: {
          userId: user.id,
          moduleId,
          isCompleted:
            tasksInModule > 0 &&
            quizzesInModule > 0 &&
            completedTasks === tasksInModule &&
            completedQuizzes === quizzesInModule,
        },
      });
    }

    for (const courseId of ids.courseIds) {
      const totalModules = await prisma.module.count({ where: { courseId } });
      const completedModules = await prisma.userModuleProgress.count({
        where: {
          userId: user.id,
          isCompleted: true,
          module: { courseId },
        },
      });

      const percentage = totalModules ? (completedModules / totalModules) * 100 : 0;
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          courseId,
          percentage,
          startDate: daysAgo(20),
          endDate: percentage === 100 ? daysAgo(1) : null,
        },
      });
    }
  }

  return users;
}

async function main() {
  await clearDatabase();

  const ids = await seedLearningCatalog();
  const achievements = await seedAchievements();
  const users = await seedUsers(ids, achievements);

  // eslint-disable-next-line no-console
  console.log("Seed data created successfully");
  // eslint-disable-next-line no-console
  console.log(`Users: ${users.length}, courses: ${ids.courseIds.length}, modules: ${ids.moduleIds.length}`);
  // eslint-disable-next-line no-console
  console.log("Demo credentials: alex / password123");
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
