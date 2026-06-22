const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma/client");

const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

// Learning catalog. Conventions enforced by the code runner (src/adapters):
//   - JavaScript tasks define `solve(lines)`, where `lines` is the input split
//     by newline (empty lines removed). The harness compares
//     String(solve(lines)).trim() to the expected output.
//   - C tasks are full programs that read from stdin and print to stdout; the
//     program output is trimmed and compared to the expected output.
// Theory and task conditions are bilingual: English fields hold the default
// content, the *Ru fields hold the Russian translation. The frontend picks the
// variant based on the user's selected language.
const catalog = [
  {
    group: {
      title: "JavaScript & React Path",
      type: "JavaScript",
      description: "From core JavaScript syntax to the ideas behind React.",
    },
    courses: [
      {
        title: "JavaScript Basics",
        description: "Variables, strings, conditions and loops — the foundation of the language.",
        language: "JavaScript",
        level: "beginner",
        points: 250,
        modules: [
          {
            title: "Variables, Numbers and Input",
            theory:
              "Every program works with data, and in JavaScript that data lives inside variables. A variable is a named container that holds a value. You create one with the keywords let or const. Use const when the value should never be reassigned (the safe default), and let when you genuinely need to change the binding later. The old keyword var still works but is avoided in modern code because of its confusing scoping rules.\n\nJavaScript is a dynamically typed language: a variable does not declare which type it stores, and the type is determined by the value itself. The most common primitive types are number (both integers and decimals share this single type), string (text), boolean (true / false), as well as null and undefined for the absence of a value.\n\nText that comes from input always arrives as a string, even when it looks like a number. \"42\" is not the same as 42: adding the string \"42\" + 1 produces \"421\", while the number 42 + 1 produces 43. To do arithmetic you must first convert the text with Number(value) or the unary plus (+value).\n\nIn the tasks of this course your function is named solve and receives an array called lines — each element is one line of the program input. Read lines[0], lines[1] and so on, convert them when you need numbers, and return the result. Returning a value is different from printing it: the checker looks at what your function returns.",
            theoryRu:
              "Любая программа работает с данными, а в JavaScript данные хранятся в переменных. Переменная — это именованный контейнер для значения. Её объявляют ключевыми словами let или const. Используйте const, когда значение не должно переприсваиваться (это безопасный выбор по умолчанию), и let, когда привязку действительно нужно менять. Устаревшее var тоже работает, но в современном коде его избегают из-за запутанных правил области видимости.\n\nJavaScript — язык с динамической типизацией: переменная не указывает свой тип, он определяется самим значением. Основные примитивные типы: number (целые и дробные числа — это один тип), string (текст), boolean (true / false), а также null и undefined для обозначения отсутствия значения.\n\nТекст, пришедший из ввода, всегда является строкой, даже если выглядит как число. \"42\" — это не то же самое, что 42: выражение \"42\" + 1 даёт \"421\", а 42 + 1 даёт 43. Чтобы выполнять арифметику, сначала преобразуйте текст через Number(value) или унарный плюс (+value).\n\nВ заданиях этого курса ваша функция называется solve и принимает массив lines — каждый его элемент это одна строка ввода. Читайте lines[0], lines[1] и так далее, преобразуйте их в числа при необходимости и возвращайте результат. Возврат значения отличается от вывода на экран: проверяющая система смотрит именно на то, что возвращает функция.",
            task: {
              title: "Sum of two numbers",
              description:
                "Read two integers, each on its own line, and return their sum.",
              descriptionRu:
                "Прочитайте два целых числа, каждое на своей строке, и верните их сумму.",
              requirements: [
                "The input contains two integers, each on a separate line.",
                "Convert both lines to numbers before adding them.",
                "Return the numeric sum (for example 9, not the string \"9\").",
                "Negative numbers must be handled correctly.",
              ],
              requirementsRu: [
                "Во вводе два целых числа, каждое на отдельной строке.",
                "Преобразуйте обе строки в числа перед сложением.",
                "Верните числовую сумму (например 9, а не строку \"9\").",
                "Отрицательные числа должны обрабатываться корректно.",
              ],
              starterCode:
                "function solve(lines) {\n  // lines[0] and lines[1] are the two input rows\n  // TODO: convert them to numbers and return the sum\n}",
              solutionCode:
                "function solve(lines) {\n  const a = Number(lines[0]);\n  const b = Number(lines[1]);\n  return a + b;\n}",
              difficulty: "easy",
              tests: [
                { input: "4\n5", expectedOutput: "9" },
                { input: "100\n250", expectedOutput: "350" },
                { input: "-3\n8", expectedOutput: "5" },
              ],
            },
            quizzes: [
              {
                question: "Which keyword declares a value that cannot be reassigned?",
                questionRu: "Какое ключевое слово объявляет значение, которое нельзя переприсвоить?",
                answerVariants: ["let", "const", "var", "value"],
                correctAnswer: "const",
              },
              {
                question: "What does Number(\"42\") + 1 evaluate to?",
                questionRu: "Чему равно Number(\"42\") + 1?",
                answerVariants: ["43", "421", "NaN", "Error"],
                correctAnswer: "43",
              },
              {
                question: "Before conversion, what type is text read from input?",
                questionRu: "Какого типа текст, прочитанный из ввода, до преобразования?",
                answerVariants: ["number", "string", "boolean", "undefined"],
                correctAnswer: "string",
              },
            ],
          },
          {
            title: "Working with Strings",
            theory:
              "A string is a sequence of characters used to represent text. You can write string literals with single quotes, double quotes, or backticks. Backtick strings are called template literals and are especially useful because they allow interpolation: `Hello, ${name}!` embeds the value of name directly inside the text.\n\nStrings in JavaScript are immutable — none of their methods change the original string; they all return a new one. Some methods you will use constantly: length gives the number of characters, toUpperCase() / toLowerCase() change the case, includes(part) checks for a substring, slice(start, end) extracts a portion, and trim() removes whitespace from both ends.\n\nA very common pattern is converting between strings and arrays. split(separator) breaks a string into an array of pieces, and join(separator) glues an array back into a string. For example \"a,b,c\".split(\",\") gives [\"a\", \"b\", \"c\"], and [\"a\", \"b\"].join(\"-\") gives \"a-b\". Splitting on the empty string \"\" produces an array of single characters, which lets you process text letter by letter.\n\nReversing a string is a classic exercise that combines these ideas: turn the string into an array of characters, reverse the array, and join it back together. There is no built-in reverse() for strings, only for arrays, which is exactly why the split / reverse / join combination is so handy.",
            theoryRu:
              "Строка — это последовательность символов для представления текста. Строковые литералы можно записывать в одинарных, двойных или обратных кавычках. Строки в обратных кавычках называются шаблонными и особенно удобны, потому что поддерживают интерполяцию: `Hello, ${name}!` встраивает значение name прямо в текст.\n\nСтроки в JavaScript неизменяемы — ни один метод не меняет исходную строку, все они возвращают новую. Часто используемые методы: length возвращает количество символов, toUpperCase() / toLowerCase() меняют регистр, includes(part) проверяет наличие подстроки, slice(start, end) извлекает фрагмент, а trim() убирает пробелы по краям.\n\nОчень частый приём — преобразование между строками и массивами. split(separator) разбивает строку на массив частей, а join(separator) собирает массив обратно в строку. Например, \"a,b,c\".split(\",\") даёт [\"a\", \"b\", \"c\"], а [\"a\", \"b\"].join(\"-\") даёт \"a-b\". Разбиение по пустой строке \"\" даёт массив отдельных символов, что позволяет обрабатывать текст посимвольно.\n\nРазворот строки — классическое упражнение, объединяющее эти идеи: превратите строку в массив символов, разверните массив и соберите обратно. Встроенного reverse() для строк нет, он есть только у массивов, поэтому связка split / reverse / join так удобна.",
            task: {
              title: "Reverse a string",
              description: "Read a single line of text and return it reversed.",
              descriptionRu: "Прочитайте одну строку текста и верните её в обратном порядке.",
              requirements: [
                "Read one line of text from the input.",
                "Return a new string with the characters in reverse order.",
                "Letter case must be preserved exactly.",
                "Do not add or remove any characters.",
              ],
              requirementsRu: [
                "Прочитайте одну строку текста из ввода.",
                "Верните новую строку с символами в обратном порядке.",
                "Регистр букв должен сохраняться без изменений.",
                "Не добавляйте и не удаляйте символы.",
              ],
              starterCode:
                "function solve(lines) {\n  const text = lines[0];\n  // TODO: return the text with its characters reversed\n}",
              solutionCode:
                "function solve(lines) {\n  return lines[0].split(\"\").reverse().join(\"\");\n}",
              difficulty: "easy",
              tests: [
                { input: "hello", expectedOutput: "olleh" },
                { input: "JavaScript", expectedOutput: "tpircSavaJ" },
                { input: "ab", expectedOutput: "ba" },
              ],
            },
            quizzes: [
              {
                question: "Which expression splits a string into an array of single characters?",
                questionRu: "Какое выражение разбивает строку на массив отдельных символов?",
                answerVariants: ["text.split(\"\")", "text.join()", "text.reverse()", "text.chars()"],
                correctAnswer: "text.split(\"\")",
              },
              {
                question: "Are strings in JavaScript mutable?",
                questionRu: "Изменяемы ли строки в JavaScript?",
                answerVariants: [
                  "Yes, methods change them in place",
                  "No, methods return a new string",
                  "Only template literals are mutable",
                  "Only with the let keyword",
                ],
                correctAnswer: "No, methods return a new string",
              },
              {
                question: "Which method joins an array of strings into a single string?",
                questionRu: "Какой метод собирает массив строк в одну строку?",
                answerVariants: ["join", "split", "reverse", "slice"],
                correctAnswer: "join",
              },
            ],
          },
          {
            title: "Conditions and Loops",
            theory:
              "Programs become useful when they can make decisions and repeat work. Decisions are expressed with the if / else if / else statement. The condition inside the parentheses is evaluated to a boolean; if it is true, the corresponding block runs. Conditions are built from comparison operators (===, !==, <, >, <=, >=) and logical operators (&& for AND, || for OR, ! for NOT). Always prefer === over == because === compares without surprising type coercion.\n\nRepetition is expressed with loops. The for loop is ideal when you know how many iterations you need: it bundles the counter initialization, the continue condition, and the step into one line — for (let i = 1; i <= n; i++). The while loop repeats as long as its condition stays true and is better when the number of iterations is not known in advance.\n\nA frequent pattern is the accumulator: you declare a variable before the loop (for example let sum = 0), update it on every iteration (sum += i), and use it after the loop finishes. This is how you compute totals, counts, maximums, and many other aggregate results.\n\nBe careful with loop boundaries. Summing from 1 to N means the loop must include N, so the condition is i <= n, not i < n. Off-by-one mistakes at the boundaries are among the most common bugs in programming, so always check the first and last iteration by hand.",
            theoryRu:
              "Программы становятся полезными, когда умеют принимать решения и повторять действия. Решения выражаются инструкцией if / else if / else. Условие в скобках вычисляется в логическое значение; если оно истинно, выполняется соответствующий блок. Условия строятся из операторов сравнения (===, !==, <, >, <=, >=) и логических операторов (&& — И, || — ИЛИ, ! — НЕ). Всегда предпочитайте === вместо ==, потому что === сравнивает без неожиданного приведения типов.\n\nПовторение выражается циклами. Цикл for идеален, когда число итераций известно: он объединяет инициализацию счётчика, условие продолжения и шаг в одной строке — for (let i = 1; i <= n; i++). Цикл while повторяется, пока его условие истинно, и лучше подходит, когда число итераций заранее неизвестно.\n\nЧастый приём — аккумулятор: вы объявляете переменную до цикла (например let sum = 0), обновляете её на каждой итерации (sum += i) и используете после завершения цикла. Так вычисляются суммы, счётчики, максимумы и многие другие агрегаты.\n\nБудьте внимательны с границами цикла. Сумма от 1 до N означает, что цикл должен включать N, поэтому условие i <= n, а не i < n. Ошибки на единицу на границах — одни из самых частых, поэтому всегда проверяйте первую и последнюю итерации вручную.",
            task: {
              title: "Sum from 1 to N",
              description:
                "Read an integer N and return the sum of all integers from 1 to N.",
              descriptionRu:
                "Прочитайте целое число N и верните сумму всех целых чисел от 1 до N.",
              requirements: [
                "Read a single integer N from the input.",
                "Return the sum 1 + 2 + ... + N.",
                "If N is 1, the result must be 1.",
                "The returned value must be a number.",
              ],
              requirementsRu: [
                "Прочитайте одно целое число N из ввода.",
                "Верните сумму 1 + 2 + ... + N.",
                "Если N равно 1, результат должен быть 1.",
                "Возвращаемое значение должно быть числом.",
              ],
              starterCode:
                "function solve(lines) {\n  const n = Number(lines[0]);\n  // TODO: accumulate and return the sum from 1 to n\n}",
              solutionCode:
                "function solve(lines) {\n  const n = Number(lines[0]);\n  let sum = 0;\n  for (let i = 1; i <= n; i++) sum += i;\n  return sum;\n}",
              difficulty: "easy",
              tests: [
                { input: "5", expectedOutput: "15" },
                { input: "10", expectedOutput: "55" },
                { input: "1", expectedOutput: "1" },
              ],
            },
            quizzes: [
              {
                question: "Which loop is the most natural choice when the number of iterations is known in advance?",
                questionRu: "Какой цикл наиболее естественен, когда число итераций известно заранее?",
                answerVariants: ["for", "while", "do...while", "switch"],
                correctAnswer: "for",
              },
              {
                question: "Which comparison operator should you prefer in JavaScript?",
                questionRu: "Какой оператор сравнения предпочтителен в JavaScript?",
                answerVariants: ["==", "===", "=", "=>"],
                correctAnswer: "===",
              },
              {
                question: "To sum the integers from 1 to N inclusive, which loop condition is correct?",
                questionRu: "Чтобы просуммировать целые от 1 до N включительно, какое условие цикла верно?",
                answerVariants: ["i < n", "i <= n", "i > n", "i != n"],
                correctAnswer: "i <= n",
              },
            ],
          },
        ],
      },
      {
        title: "JavaScript Collections & Functions",
        description: "Arrays, higher-order functions and data transformations.",
        language: "JavaScript",
        level: "intermediate",
        points: 350,
        modules: [
          {
            title: "Array Methods: map, filter, reduce",
            theory:
              "Arrays are ordered lists of values and the workhorse data structure of JavaScript. Beyond simple indexing (arr[0]) and the length property, arrays shine through their built-in higher-order methods, which let you describe what you want instead of writing manual loops.\n\nmap(fn) creates a new array by applying a function to every element — perfect for transforming data, such as turning an array of strings into an array of numbers. filter(fn) creates a new array containing only the elements for which the function returns true — perfect for selecting a subset, such as keeping only even numbers. reduce(fn, initial) collapses an array into a single value by repeatedly combining elements with an accumulator — perfect for sums, products, or any aggregate.\n\nThese methods are pure: they never modify the original array, they return a new result. Because each returns an array (except reduce), they can be chained fluently: numbers.filter(isEven).map(double).reduce(add, 0). Reading such a chain from left to right tells the whole story of the transformation.\n\nWhen using reduce, always provide the initial value (the second argument). For a sum it is 0, for a product it is 1, for collecting into an array it is []. Supplying the initial value also makes reduce safe on empty arrays, where it simply returns that initial value instead of throwing an error.",
            theoryRu:
              "Массивы — это упорядоченные списки значений и основная рабочая структура данных в JavaScript. Помимо обращения по индексу (arr[0]) и свойства length, массивы сильны встроенными методами высшего порядка, которые позволяют описывать, что вы хотите получить, вместо написания ручных циклов.\n\nmap(fn) создаёт новый массив, применяя функцию к каждому элементу — идеально для преобразования данных, например превращения массива строк в массив чисел. filter(fn) создаёт новый массив только из элементов, для которых функция вернула true — идеально для выбора подмножества, например только чётных чисел. reduce(fn, initial) сворачивает массив в одно значение, последовательно объединяя элементы с аккумулятором — идеально для сумм, произведений и любых агрегатов.\n\nЭти методы чистые: они никогда не меняют исходный массив, а возвращают новый результат. Поскольку каждый из них (кроме reduce) возвращает массив, их можно объединять в цепочку: numbers.filter(isEven).map(double).reduce(add, 0). Чтение такой цепочки слева направо описывает всё преобразование целиком.\n\nИспользуя reduce, всегда указывайте начальное значение (второй аргумент). Для суммы это 0, для произведения 1, для сбора в массив []. Указание начального значения также делает reduce безопасным на пустом массиве, где он просто вернёт это значение, а не выбросит ошибку.",
            task: {
              title: "Sum of even numbers",
              description:
                "Read a line of space-separated integers and return the sum of the even ones.",
              descriptionRu:
                "Прочитайте строку из целых чисел через пробел и верните сумму чётных из них.",
              requirements: [
                "The input is a single line of integers separated by spaces.",
                "Keep only the even numbers (divisible by 2).",
                "Return the sum of those even numbers.",
                "If there are no even numbers, return 0.",
              ],
              requirementsRu: [
                "Во вводе одна строка целых чисел, разделённых пробелами.",
                "Оставьте только чётные числа (делящиеся на 2).",
                "Верните сумму этих чётных чисел.",
                "Если чётных чисел нет, верните 0.",
              ],
              starterCode:
                "function solve(lines) {\n  const numbers = lines[0].split(\" \").map(Number);\n  // TODO: sum only the even numbers\n}",
              solutionCode:
                "function solve(lines) {\n  return lines[0]\n    .split(\" \")\n    .map(Number)\n    .filter((n) => n % 2 === 0)\n    .reduce((acc, n) => acc + n, 0);\n}",
              difficulty: "medium",
              tests: [
                { input: "1 2 3 4 5 6", expectedOutput: "12" },
                { input: "10 15 20", expectedOutput: "30" },
                { input: "1 3 5", expectedOutput: "0" },
              ],
            },
            quizzes: [
              {
                question: "Which array method keeps only the elements that satisfy a condition?",
                questionRu: "Какой метод массива оставляет только элементы, удовлетворяющие условию?",
                answerVariants: ["map", "filter", "reduce", "forEach"],
                correctAnswer: "filter",
              },
              {
                question: "Which method transforms every element into a new array?",
                questionRu: "Какой метод преобразует каждый элемент в новый массив?",
                answerVariants: ["map", "filter", "reduce", "find"],
                correctAnswer: "map",
              },
              {
                question: "What initial value is typical for reduce when computing a sum?",
                questionRu: "Какое начальное значение обычно у reduce при вычислении суммы?",
                answerVariants: ["0", "1", "[]", "null"],
                correctAnswer: "0",
              },
            ],
          },
          {
            title: "Functions and Higher-Order Functions",
            theory:
              "Functions are reusable blocks of logic that take inputs (parameters) and produce an output (the return value). JavaScript offers several ways to define them: the classic function declaration (function add(a, b) { return a + b; }) and the concise arrow function ((a, b) => a + b). Arrow functions are especially common as short callbacks passed to other functions.\n\nIn JavaScript functions are first-class values: they can be stored in variables, passed as arguments, and returned from other functions. A higher-order function is simply a function that takes another function as an argument or returns one. The array methods map, filter and reduce are higher-order functions, and so is setTimeout. This concept is the backbone of functional-style JavaScript and of React's component callbacks.\n\nWhen processing text it is common to split a line into words. Splitting on a single space is fragile, because real input can contain multiple spaces. Splitting on the regular expression /\\s+/ (one or more whitespace characters) is far more robust. Pair it with trim() to remove leading and trailing spaces, and with filter(Boolean) to drop any empty pieces.\n\nA good function does one thing, has a clear name, and avoids side effects when possible. Functions that always return the same output for the same input and change nothing outside themselves are called pure functions; they are easy to test and to reason about, which is why they are favored throughout modern JavaScript and React.",
            theoryRu:
              "Функции — это переиспользуемые блоки логики, которые принимают входные данные (параметры) и возвращают результат (возвращаемое значение). В JavaScript есть несколько способов их объявления: классическое объявление функции (function add(a, b) { return a + b; }) и краткая стрелочная функция ((a, b) => a + b). Стрелочные функции особенно часто используются как короткие колбэки, передаваемые другим функциям.\n\nВ JavaScript функции — это полноценные значения: их можно хранить в переменных, передавать в аргументы и возвращать из других функций. Функция высшего порядка — это просто функция, которая принимает другую функцию как аргумент или возвращает её. Методы массивов map, filter и reduce являются функциями высшего порядка, как и setTimeout. Эта идея — основа функционального стиля в JavaScript и колбэков компонентов в React.\n\nПри обработке текста часто нужно разбить строку на слова. Разбиение по одиночному пробелу ненадёжно, потому что во вводе могут быть несколько пробелов подряд. Разбиение по регулярному выражению /\\s+/ (один или более пробельных символов) гораздо надёжнее. Сочетайте его с trim() для удаления крайних пробелов и с filter(Boolean) для отбрасывания пустых частей.\n\nХорошая функция делает одно дело, имеет понятное имя и по возможности избегает побочных эффектов. Функции, которые всегда возвращают один и тот же результат для одних и тех же входных данных и ничего не меняют вне себя, называются чистыми; их легко тестировать и понимать, поэтому они так ценятся в современном JavaScript и React.",
            task: {
              title: "Count words",
              description: "Read a line of text and return the number of words it contains.",
              descriptionRu: "Прочитайте строку текста и верните количество слов в ней.",
              requirements: [
                "Read one line of text from the input.",
                "Words are separated by one or more spaces.",
                "Return the number of words as a number.",
                "Leading and trailing spaces must not be counted as words.",
              ],
              requirementsRu: [
                "Прочитайте одну строку текста из ввода.",
                "Слова разделены одним или несколькими пробелами.",
                "Верните количество слов в виде числа.",
                "Пробелы в начале и конце не должны считаться словами.",
              ],
              starterCode:
                "function solve(lines) {\n  const text = lines[0];\n  // TODO: return how many words the line contains\n}",
              solutionCode:
                "function solve(lines) {\n  return lines[0].trim().split(/\\s+/).filter(Boolean).length;\n}",
              difficulty: "medium",
              tests: [
                { input: "hello world foo", expectedOutput: "3" },
                { input: "one", expectedOutput: "1" },
                { input: "a b c d", expectedOutput: "4" },
              ],
            },
            quizzes: [
              {
                question: "What is a higher-order function?",
                questionRu: "Что такое функция высшего порядка?",
                answerVariants: [
                  "A function declared at the top of a file",
                  "A function that takes or returns another function",
                  "A function that runs faster than others",
                  "A function with many parameters",
                ],
                correctAnswer: "A function that takes or returns another function",
              },
              {
                question: "Which is a concise arrow function that adds a and b?",
                questionRu: "Какая запись — это краткая стрелочная функция, складывающая a и b?",
                answerVariants: [
                  "function => a + b",
                  "(a, b) => a + b",
                  "=> (a + b)",
                  "a, b -> a + b",
                ],
                correctAnswer: "(a, b) => a + b",
              },
              {
                question: "Which regular expression reliably splits text into words by whitespace?",
                questionRu: "Какое регулярное выражение надёжно разбивает текст на слова по пробелам?",
                answerVariants: ["/ /", "/\\s+/", "/\\w/", "/,/"],
                correctAnswer: "/\\s+/",
              },
            ],
          },
          {
            title: "Objects and Aggregation",
            theory:
              "While arrays store ordered lists, objects store labeled data as key-value pairs: { firstName: \"Ada\", lastName: \"Lovelace\" }. You read properties with dot notation (user.firstName) or bracket notation (user[\"firstName\"]). Destructuring lets you pull several properties into variables in one readable line: const { firstName, lastName } = user.\n\nObjects and arrays are often combined: an array of objects is the everyday shape of data coming from an API, and is exactly what React renders into lists. Knowing how to transform, filter and aggregate such collections is a core skill.\n\nAggregation means deriving a single summary value from many. Finding a maximum is a typical example. The Math object provides Math.max(...values), and the spread operator (...) expands an array into individual arguments, so Math.max(...[3, 7, 2]) is the same as Math.max(3, 7, 2). Other handy helpers are Math.min, Math.round, Math.floor and Math.abs.\n\nWhen aggregating, always consider edge cases: a single-element list, repeated values, and negative numbers. A maximum function, for instance, must return the correct value even when every number is negative — there the answer is the value closest to zero, not zero itself.",
            theoryRu:
              "Если массивы хранят упорядоченные списки, то объекты хранят помеченные данные в виде пар ключ-значение: { firstName: \"Ada\", lastName: \"Lovelace\" }. Свойства читаются через точечную нотацию (user.firstName) или через скобки (user[\"firstName\"]). Деструктуризация позволяет вытащить несколько свойств в переменные одной читаемой строкой: const { firstName, lastName } = user.\n\nОбъекты и массивы часто сочетаются: массив объектов — обычная форма данных, приходящих из API, и именно её React превращает в списки. Умение преобразовывать, фильтровать и агрегировать такие коллекции — ключевой навык.\n\nАгрегация означает получение одного итогового значения из многих. Поиск максимума — типичный пример. Объект Math предоставляет Math.max(...values), а оператор расширения (...) разворачивает массив в отдельные аргументы, поэтому Math.max(...[3, 7, 2]) то же самое, что Math.max(3, 7, 2). Другие полезные помощники — Math.min, Math.round, Math.floor и Math.abs.\n\nПри агрегации всегда учитывайте граничные случаи: список из одного элемента, повторяющиеся значения и отрицательные числа. Например, функция поиска максимума должна вернуть правильное значение, даже если все числа отрицательны — там ответ это число, ближайшее к нулю, а не сам ноль.",
            task: {
              title: "Maximum value",
              description:
                "Read a line of space-separated integers and return the largest value.",
              descriptionRu:
                "Прочитайте строку из целых чисел через пробел и верните наибольшее значение.",
              requirements: [
                "The input is a single line of integers separated by spaces.",
                "Return the maximum value among them.",
                "The returned value must be a number.",
                "Negative numbers must be handled correctly.",
              ],
              requirementsRu: [
                "Во вводе одна строка целых чисел, разделённых пробелами.",
                "Верните максимальное значение среди них.",
                "Возвращаемое значение должно быть числом.",
                "Отрицательные числа должны обрабатываться корректно.",
              ],
              starterCode:
                "function solve(lines) {\n  const numbers = lines[0].split(\" \").map(Number);\n  // TODO: return the largest number\n}",
              solutionCode:
                "function solve(lines) {\n  return Math.max(...lines[0].split(\" \").map(Number));\n}",
              difficulty: "medium",
              tests: [
                { input: "3 7 2 9 1", expectedOutput: "9" },
                { input: "5 5 5", expectedOutput: "5" },
                { input: "-1 -7 -3", expectedOutput: "-1" },
              ],
            },
            quizzes: [
              {
                question: "Which built-in returns the largest of the given numbers?",
                questionRu: "Какая встроенная функция возвращает наибольшее из заданных чисел?",
                answerVariants: ["Math.max", "Math.floor", "Math.high", "Array.max"],
                correctAnswer: "Math.max",
              },
              {
                question: "How do you read a property using dot notation?",
                questionRu: "Как прочитать свойство через точечную нотацию?",
                answerVariants: ["user->firstName", "user.firstName", "user::firstName", "user(firstName)"],
                correctAnswer: "user.firstName",
              },
              {
                question: "What does the spread operator (...) do with an array in Math.max(...arr)?",
                questionRu: "Что делает оператор расширения (...) с массивом в Math.max(...arr)?",
                answerVariants: [
                  "Copies it into a string",
                  "Expands it into individual arguments",
                  "Sorts the array",
                  "Removes duplicate values",
                ],
                correctAnswer: "Expands it into individual arguments",
              },
            ],
          },
        ],
      },
      {
        title: "React Essentials",
        description: "The core mental model of React: components, props, state and lists.",
        language: "JavaScript",
        level: "intermediate",
        points: 300,
        modules: [
          {
            title: "Components and Props",
            theory:
              "React is a library for building user interfaces out of components. A component is a reusable, self-contained piece of UI described by a JavaScript function that returns markup written in JSX (an HTML-like syntax). A component named Greeting might return <h1>Hello!</h1>. Components can be composed: larger components render smaller ones, forming a tree that mirrors the screen.\n\nComponents receive their input through props — a single object of named values passed by the parent, much like function arguments. If a parent writes <Greeting name=\"Alice\" />, the Greeting function receives { name: \"Alice\" }. Data in React flows in one direction, from parent down to child through props; a child cannot reach up and change its parent's data directly. This one-way flow makes applications predictable.\n\nProps are read-only. A component must never modify the props it receives; it simply uses them to compute what to render. This is why so much of React is built on pure functions: given the same props, a component should produce the same output. The exercise in this module strips a component down to that pure core — taking an input value and returning the exact text that would be rendered.\n\nKeeping components small and focused, naming them clearly, and passing only the data they need through props are the habits that keep a React codebase maintainable as it grows.",
            theoryRu:
              "React — это библиотека для построения пользовательских интерфейсов из компонентов. Компонент — это переиспользуемый самостоятельный кусок интерфейса, описанный JavaScript-функцией, которая возвращает разметку на JSX (HTML-подобном синтаксисе). Компонент Greeting может вернуть <h1>Hello!</h1>. Компоненты можно вкладывать: крупные компоненты отображают более мелкие, образуя дерево, повторяющее структуру экрана.\n\nКомпоненты получают входные данные через пропсы (props) — единый объект именованных значений, передаваемый родителем, подобно аргументам функции. Если родитель пишет <Greeting name=\"Alice\" />, функция Greeting получает { name: \"Alice\" }. Данные в React текут в одном направлении — от родителя к потомку через пропсы; потомок не может напрямую изменить данные родителя. Этот однонаправленный поток делает приложение предсказуемым.\n\nПропсы доступны только для чтения. Компонент никогда не должен изменять полученные пропсы; он просто использует их для вычисления того, что нужно отобразить. Поэтому значительная часть React построена на чистых функциях: при одних и тех же пропсах компонент должен давать один и тот же результат. Задание этого модуля сводит компонент к этой чистой сути — принять входное значение и вернуть точный текст, который был бы отображён.\n\nМаленькие сфокусированные компоненты, понятные имена и передача только нужных данных через пропсы — привычки, которые сохраняют код React поддерживаемым по мере роста.",
            task: {
              title: "Greeting component",
              description:
                "A component receives a name and renders a greeting. Read a name and return the text 'Hello, <name>!'.",
              descriptionRu:
                "Компонент получает имя и отображает приветствие. Прочитайте имя и верните текст Hello, <имя>!",
              requirements: [
                "Read a single name from the input.",
                "Return the exact string in the format: Hello, <name>!",
                "Include the comma, the space and the exclamation mark.",
                "For the name Alice the result must be exactly: Hello, Alice!",
              ],
              requirementsRu: [
                "Прочитайте одно имя из ввода.",
                "Верните строку строго в формате: Hello, <имя>!",
                "Сохраните запятую, пробел и восклицательный знак.",
                "Для имени Alice результат должен быть строго: Hello, Alice!",
              ],
              starterCode:
                "function solve(lines) {\n  const name = lines[0];\n  // TODO: return the greeting text this component would render\n}",
              solutionCode:
                "function solve(lines) {\n  const name = lines[0];\n  return `Hello, ${name}!`;\n}",
              difficulty: "easy",
              tests: [
                { input: "Alice", expectedOutput: "Hello, Alice!" },
                { input: "Bob", expectedOutput: "Hello, Bob!" },
                { input: "React", expectedOutput: "Hello, React!" },
              ],
            },
            quizzes: [
              {
                question: "How does data flow between React components by default?",
                questionRu: "Как по умолчанию данные передаются между компонентами React?",
                answerVariants: [
                  "From child to parent",
                  "From parent to child via props",
                  "In both directions automatically",
                  "Only through global variables",
                ],
                correctAnswer: "From parent to child via props",
              },
              {
                question: "Can a component modify the props it receives?",
                questionRu: "Может ли компонент изменять полученные пропсы?",
                answerVariants: [
                  "Yes, at any time",
                  "No, props are read-only",
                  "Only inside useState",
                  "Only the parent's props",
                ],
                correctAnswer: "No, props are read-only",
              },
              {
                question: "What does a component function return?",
                questionRu: "Что возвращает функция-компонент?",
                answerVariants: ["A plain string only", "JSX markup", "A CSS file", "Nothing"],
                correctAnswer: "JSX markup",
              },
            ],
          },
          {
            title: "State and the useState Hook",
            theory:
              "Props describe data that comes from outside a component, but many components also need to remember information of their own that changes over time — a form input, a toggle, a counter. That memory is called state. In function components state is created with the useState hook: const [count, setCount] = useState(0). The first element is the current value, the second is the function used to update it, and the argument is the initial value.\n\nThe golden rule of state is to never mutate it directly. You do not write count = count + 1 or push into a state array. Instead you call the setter with a new value: setCount(count + 1). React compares references to decide what changed; if you mutate the existing object or array in place, its reference stays the same and React may not re-render. Producing new values keeps updates predictable.\n\nWhen you call the setter, React schedules a re-render: it runs your component function again, useState hands back the updated value, and the UI reflects the new state. This cycle — state changes, component re-renders — is the heartbeat of every React app.\n\nThe logic that turns a current value plus an action into a next value is, at its core, a pure function. This is exactly the idea behind reducers (and the useReducer hook). In this module you implement that pure update logic: starting from zero, fold a sequence of 'inc' and 'dec' actions into a final number, just as a reducer would compute the next state.",
            theoryRu:
              "Пропсы описывают данные, приходящие извне компонента, но многим компонентам нужно помнить собственную информацию, которая меняется со временем — значение поля формы, переключатель, счётчик. Эта память называется состоянием (state). В функциональных компонентах состояние создаётся хуком useState: const [count, setCount] = useState(0). Первый элемент — текущее значение, второй — функция для его обновления, а аргумент — начальное значение.\n\nГлавное правило состояния — никогда не менять его напрямую. Нельзя писать count = count + 1 или делать push в массив состояния. Вместо этого вызывайте сеттер с новым значением: setCount(count + 1). React сравнивает ссылки, чтобы понять, что изменилось; если изменить существующий объект или массив на месте, его ссылка останется прежней, и React может не перерисовать компонент. Создание новых значений делает обновления предсказуемыми.\n\nКогда вы вызываете сеттер, React планирует повторный рендер: он снова выполняет функцию компонента, useState возвращает обновлённое значение, и интерфейс отражает новое состояние. Этот цикл — изменение состояния, повторный рендер — сердцебиение любого приложения на React.\n\nЛогика, превращающая текущее значение плюс действие в следующее значение, по своей сути является чистой функцией. Именно на этом основана идея редьюсеров (и хука useReducer). В этом модуле вы реализуете такую чистую логику обновления: начиная с нуля, сверните последовательность действий inc и dec в итоговое число, как это сделал бы редьюсер.",
            task: {
              title: "Counter reducer",
              description:
                "A counter starts at 0. Apply a sequence of commands ('inc' or 'dec') and return the final value.",
              descriptionRu:
                "Счётчик начинается с 0. Примените последовательность команд (inc или dec) и верните итоговое значение.",
              requirements: [
                "The input is a single line of space-separated commands.",
                "Each command is either 'inc' (add 1) or 'dec' (subtract 1).",
                "The counter starts at 0.",
                "Return the final counter value as a number.",
              ],
              requirementsRu: [
                "Во вводе одна строка команд, разделённых пробелами.",
                "Каждая команда — это либо inc (прибавить 1), либо dec (вычесть 1).",
                "Счётчик начинается с 0.",
                "Верните итоговое значение счётчика в виде числа.",
              ],
              starterCode:
                "function solve(lines) {\n  const commands = lines[0].split(\" \");\n  // TODO: fold the commands into the final counter value\n}",
              solutionCode:
                "function solve(lines) {\n  return lines[0]\n    .split(\" \")\n    .reduce((count, cmd) => (cmd === \"inc\" ? count + 1 : count - 1), 0);\n}",
              difficulty: "medium",
              tests: [
                { input: "inc inc dec inc", expectedOutput: "2" },
                { input: "dec dec", expectedOutput: "-2" },
                { input: "inc", expectedOutput: "1" },
              ],
            },
            quizzes: [
              {
                question: "Why must you not mutate React state directly?",
                questionRu: "Почему нельзя изменять состояние React напрямую?",
                answerVariants: [
                  "It is slower than mutation",
                  "React relies on new references to detect changes and re-render",
                  "JavaScript forbids it",
                  "It increases the bundle size",
                ],
                correctAnswer: "React relies on new references to detect changes and re-render",
              },
              {
                question: "What does useState return?",
                questionRu: "Что возвращает useState?",
                answerVariants: [
                  "Only the current value",
                  "A value and a setter function",
                  "A reducer function",
                  "The previous value",
                ],
                correctAnswer: "A value and a setter function",
              },
              {
                question: "How do you correctly update state?",
                questionRu: "Как правильно обновлять состояние?",
                answerVariants: [
                  "Assign the variable directly",
                  "Call the setter with a new value",
                  "Push into the state array",
                  "Reassign it with =",
                ],
                correctAnswer: "Call the setter with a new value",
              },
            ],
          },
          {
            title: "Rendering Lists",
            theory:
              "Most interfaces display collections: a list of products, messages, or to-dos. In React you render a collection by mapping an array of data to an array of elements. Because map returns a new array, you can place its result directly inside JSX, and React renders each produced element in order.\n\nWhen rendering a list, React asks for a special key prop on each item — a stable, unique identifier (usually an id from your data). Keys let React match elements between renders so it can update, reorder, or remove just the items that actually changed, instead of rebuilding the whole list. Using the array index as a key is a last resort and can cause subtle bugs when items are inserted or reordered.\n\nThe transformation from data to display strings is plain JavaScript, and that is what this module practises. Given a list of items, you build a numbered representation — one line per item, each prefixed with its position. The map callback receives both the element and its index, which is exactly how you generate the numbering.\n\nJoining the produced lines with the newline character \"\\n\" yields the final multi-line text. The same map-then-render thinking scales from this simple string up to complex component trees in real React applications.",
            theoryRu:
              "Большинство интерфейсов отображают коллекции: список товаров, сообщений или задач. В React коллекция отображается путём преобразования массива данных в массив элементов. Поскольку map возвращает новый массив, его результат можно поместить прямо в JSX, и React отрисует каждый полученный элемент по порядку.\n\nПри отображении списка React просит специальный проп key у каждого элемента — стабильный уникальный идентификатор (обычно id из ваших данных). Ключи позволяют React сопоставлять элементы между рендерами, чтобы обновлять, переставлять или удалять только реально изменившиеся элементы, а не перестраивать весь список. Использование индекса массива в качестве ключа — крайняя мера, которая может приводить к трудноуловимым ошибкам при вставке или перестановке элементов.\n\nПреобразование данных в отображаемые строки — это обычный JavaScript, и именно его отрабатывает этот модуль. Имея список элементов, вы строите нумерованное представление — по одной строке на элемент, каждая с префиксом-номером. Колбэк map получает и элемент, и его индекс, что и используется для нумерации.\n\nОбъединение полученных строк символом перевода строки \"\\n\" даёт итоговый многострочный текст. Тот же подход map-затем-render масштабируется от этой простой строки до сложных деревьев компонентов в реальных приложениях на React.",
            task: {
              title: "Render a numbered list",
              description:
                "Given a line of space-separated items, return them as a numbered list, one item per line, in the format '1. item'.",
              descriptionRu:
                "Имея строку элементов через пробел, верните их в виде нумерованного списка — по одному элементу на строку в формате 1. элемент.",
              requirements: [
                "The input is a single line of items separated by spaces.",
                "Return a string with one item per line.",
                "Each line must use the format '<position>. <item>', numbering from 1.",
                "Lines must be separated by a single newline character.",
              ],
              requirementsRu: [
                "Во вводе одна строка элементов, разделённых пробелами.",
                "Верните строку, где каждый элемент на отдельной строке.",
                "Каждая строка должна иметь формат <номер>. <элемент>, нумерация с 1.",
                "Строки должны разделяться одним символом перевода строки.",
              ],
              starterCode:
                "function solve(lines) {\n  const items = lines[0].split(\" \");\n  // TODO: build the numbered list, one item per line\n}",
              solutionCode:
                "function solve(lines) {\n  return lines[0]\n    .split(\" \")\n    .map((item, index) => `${index + 1}. ${item}`)\n    .join(\"\\n\");\n}",
              difficulty: "medium",
              tests: [
                { input: "apple banana cherry", expectedOutput: "1. apple\n2. banana\n3. cherry" },
                { input: "x", expectedOutput: "1. x" },
                { input: "a b", expectedOutput: "1. a\n2. b" },
              ],
            },
            quizzes: [
              {
                question: "Why does React want a key prop when rendering a list?",
                questionRu: "Зачем React нужен проп key при отрисовке списка?",
                answerVariants: [
                  "To apply styling to items",
                  "To help React identify which items changed",
                  "To sort the list automatically",
                  "Keys are optional and have no effect",
                ],
                correctAnswer: "To help React identify which items changed",
              },
              {
                question: "Which method turns a data array into a list of elements?",
                questionRu: "Какой метод превращает массив данных в список элементов?",
                answerVariants: ["map", "filter", "reduce", "forEach"],
                correctAnswer: "map",
              },
              {
                question: "What is a good value to use for a list item key?",
                questionRu: "Что хорошо подходит в качестве ключа элемента списка?",
                answerVariants: [
                  "The array index in every case",
                  "A stable unique id",
                  "A random number",
                  "The element's text",
                ],
                correctAnswer: "A stable unique id",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    group: {
      title: "C Path",
      type: "C",
      description: "Systems-level programming with C: syntax, algorithms, arrays and strings.",
    },
    courses: [
      {
        title: "C Basics",
        description: "Program structure, input/output, conditions and loops in C.",
        language: "C",
        level: "beginner",
        points: 260,
        modules: [
          {
            title: "Program Structure and I/O",
            theory:
              "C is a compiled, statically typed language that sits close to the hardware and has influenced almost every language that came after it. Every C program is built from functions, and execution always begins in the function called main, which returns an int (0 means the program finished successfully).\n\nFunctionality that is not part of the core language lives in libraries that you include with preprocessor directives. The line #include <stdio.h> brings in the Standard Input/Output library, which provides printf for writing to the screen and scanf for reading from the keyboard. Without that include the compiler would not know what printf and scanf are.\n\nUnlike JavaScript, C requires you to declare the type of every variable before using it: int for whole numbers, double for decimals, char for a single character. printf and scanf use format specifiers to describe these types — %d for an int, %lld for a long long, %f for a double, %c for a char, and %s for a string. With scanf you must pass the address of the variable using the & operator, as in scanf(\"%d\", &n), because the function needs to know where in memory to store what it reads.\n\nA single scanf(\"%d %d\", &a, &b) reads two integers and conveniently skips any spaces or newlines between them, so the same code works whether the numbers are on one line or two. Always make sure the number and types of your format specifiers match the variables you pass.",
            theoryRu:
              "C — компилируемый язык со статической типизацией, близкий к аппаратуре и повлиявший почти на все появившиеся после него языки. Любая программа на C состоит из функций, а выполнение всегда начинается с функции main, которая возвращает int (0 означает успешное завершение).\n\nВозможности, не входящие в ядро языка, находятся в библиотеках, которые подключаются директивами препроцессора. Строка #include <stdio.h> подключает стандартную библиотеку ввода-вывода, предоставляющую printf для вывода на экран и scanf для чтения с клавиатуры. Без этого подключения компилятор не знал бы, что такое printf и scanf.\n\nВ отличие от JavaScript, C требует объявлять тип каждой переменной до использования: int для целых чисел, double для дробных, char для одного символа. printf и scanf используют спецификаторы формата для описания типов — %d для int, %lld для long long, %f для double, %c для char, %s для строки. В scanf нужно передавать адрес переменной через оператор &, как в scanf(\"%d\", &n), потому что функции нужно знать, куда в памяти записать прочитанное.\n\nОдин вызов scanf(\"%d %d\", &a, &b) читает два целых числа и удобно пропускает пробелы и переводы строк между ними, поэтому код работает независимо от того, на одной строке числа или на разных. Всегда следите, чтобы количество и типы спецификаторов формата совпадали с передаваемыми переменными.",
            task: {
              title: "Sum of two numbers",
              description:
                "Read two integers from standard input and print their sum.",
              descriptionRu:
                "Прочитайте два целых числа со стандартного ввода и выведите их сумму.",
              requirements: [
                "Read two integers from standard input (they may be separated by a space or a newline).",
                "Print only their sum.",
                "Do not print any extra text, labels or trailing characters.",
                "Negative numbers must be supported.",
              ],
              requirementsRu: [
                "Прочитайте два целых числа со стандартного ввода (они могут быть разделены пробелом или переводом строки).",
                "Выведите только их сумму.",
                "Не выводите лишний текст, подписи или завершающие символы.",
                "Отрицательные числа должны поддерживаться.",
              ],
              starterCode:
                "#include <stdio.h>\n\nint main() {\n    int a, b;\n    // TODO: read a and b, then print a + b\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf(\"%d %d\", &a, &b);\n    printf(\"%d\", a + b);\n    return 0;\n}",
              difficulty: "easy",
              tests: [
                { input: "4 5", expectedOutput: "9" },
                { input: "100 250", expectedOutput: "350" },
                { input: "-3 8", expectedOutput: "5" },
              ],
            },
            quizzes: [
              {
                question: "Which function reads formatted input from the keyboard in C?",
                questionRu: "Какая функция читает форматированный ввод с клавиатуры в C?",
                answerVariants: ["printf", "scanf", "gets", "cin"],
                correctAnswer: "scanf",
              },
              {
                question: "Where does a C program start executing?",
                questionRu: "С чего начинается выполнение программы на C?",
                answerVariants: [
                  "At the first #include",
                  "In the main function",
                  "At the last function",
                  "In printf",
                ],
                correctAnswer: "In the main function",
              },
              {
                question: "Which symbol passes a variable's address to scanf?",
                questionRu: "Какой символ передаёт адрес переменной в scanf?",
                answerVariants: ["*", "&", "%", "#"],
                correctAnswer: "&",
              },
            ],
          },
          {
            title: "Making Decisions",
            theory:
              "Conditional statements let a C program choose between different actions. The if statement runs its block only when its condition is true (in C, any non-zero value counts as true and zero counts as false). An optional else block handles the opposite case, and chains of else if let you test several possibilities in order.\n\nConditions are built from relational operators — == (equal), != (not equal), <, >, <=, >= — and logical operators — && (and), || (or), ! (not). A classic beginner mistake is writing a single = (assignment) where == (comparison) is meant; the compiler may accept it and the logic silently breaks, so watch for it.\n\nThe modulo operator % returns the remainder of an integer division. It is the standard tool for many checks: a number is even exactly when n % 2 == 0, and divisible by k when n % k == 0. Combined with if, modulo answers a huge range of questions about numbers.\n\nFor simple either/or choices C also offers the ternary operator condition ? valueIfTrue : valueIfFalse, which is a compact expression rather than a statement. For example n % 2 == 0 ? \"Even\" : \"Odd\" evaluates to one of two strings, which you can hand straight to printf.",
            theoryRu:
              "Условные инструкции позволяют программе на C выбирать между разными действиями. Инструкция if выполняет свой блок только когда условие истинно (в C любое ненулевое значение считается истиной, а ноль — ложью). Необязательный блок else обрабатывает противоположный случай, а цепочки else if проверяют несколько вариантов по порядку.\n\nУсловия строятся из операторов отношения — == (равно), != (не равно), <, >, <=, >= — и логических операторов — && (и), || (или), ! (не). Классическая ошибка новичка — написать одиночное = (присваивание) там, где имелось в виду == (сравнение); компилятор может это принять, и логика тихо сломается, поэтому будьте внимательны.\n\nОператор остатка % возвращает остаток от целочисленного деления. Это стандартный инструмент для многих проверок: число чётно ровно тогда, когда n % 2 == 0, и делится на k, когда n % k == 0. В сочетании с if остаток отвечает на огромное число вопросов о числах.\n\nДля простого выбора из двух вариантов в C есть тернарный оператор condition ? значениеЕслиИстина : значениеЕслиЛожь, который является выражением, а не инструкцией. Например, n % 2 == 0 ? \"Even\" : \"Odd\" вычисляется в одну из двух строк, которую можно сразу передать в printf.",
            task: {
              title: "Even or Odd",
              description:
                "Read an integer and print \"Even\" if it is even, otherwise print \"Odd\".",
              descriptionRu:
                "Прочитайте целое число и выведите Even, если оно чётное, иначе выведите Odd.",
              requirements: [
                "Read a single integer from the input.",
                "Print exactly Even or Odd, capitalized, with no extra text.",
                "A number is even when it is divisible by 2.",
                "Zero must be reported as Even.",
              ],
              requirementsRu: [
                "Прочитайте одно целое число из ввода.",
                "Выведите ровно Even или Odd, с заглавной буквы, без лишнего текста.",
                "Число чётное, когда делится на 2.",
                "Ноль должен считаться чётным (Even).",
              ],
              starterCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO: print \"Even\" or \"Odd\"\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"%s\", n % 2 == 0 ? \"Even\" : \"Odd\");\n    return 0;\n}",
              difficulty: "easy",
              tests: [
                { input: "4", expectedOutput: "Even" },
                { input: "7", expectedOutput: "Odd" },
                { input: "0", expectedOutput: "Even" },
              ],
            },
            quizzes: [
              {
                question: "What does the operator % compute?",
                questionRu: "Что вычисляет оператор %?",
                answerVariants: ["The division result", "The remainder of a division", "A percentage", "A power"],
                correctAnswer: "The remainder of a division",
              },
              {
                question: "In C, which value is treated as false?",
                questionRu: "Какое значение в C считается ложью?",
                answerVariants: ["0", "1", "-1", "any non-zero value"],
                correctAnswer: "0",
              },
              {
                question: "Which operator tests equality between two values?",
                questionRu: "Какой оператор проверяет равенство двух значений?",
                answerVariants: ["=", "==", "!=", "=>"],
                correctAnswer: "==",
              },
            ],
          },
          {
            title: "Loops and Accumulation",
            theory:
              "Loops let a C program repeat work without duplicating code. The for loop gathers three parts in its header — initialization, condition, and step: for (int i = 1; i <= n; i++). It is the natural choice when the number of repetitions is known. The while loop repeats as long as its condition holds and suits situations where you cannot predict the count up front, while do...while always runs its body at least once.\n\nThe accumulator pattern is fundamental: declare a variable before the loop, update it on each iteration, and read it afterwards. To sum the integers from 1 to N you start sum at 0 and add i on every pass. Choosing the right type for the accumulator matters — a sum can grow beyond the range of int, so long long is a safer choice for results that may become large.\n\nPay close attention to the loop's boundaries. To include N in the sum the condition must be i <= n; using i < n would stop one step early. Checking the first and last iterations by hand is the simplest way to catch these off-by-one errors.\n\nLoops also pair naturally with the conditions from the previous module: inside a loop body you can branch, accumulate selectively, or stop early. Mastering this combination of repetition and decision-making is enough to express a large share of all everyday algorithms.",
            theoryRu:
              "Циклы позволяют программе на C повторять действия без дублирования кода. Цикл for собирает три части в своём заголовке — инициализацию, условие и шаг: for (int i = 1; i <= n; i++). Это естественный выбор, когда число повторений известно. Цикл while повторяется, пока условие истинно, и подходит, когда число итераций заранее не предсказать, а do...while всегда выполняет тело хотя бы один раз.\n\nПриём аккумулятора фундаментален: объявите переменную до цикла, обновляйте её на каждой итерации и читайте после. Чтобы просуммировать целые от 1 до N, начните sum с 0 и прибавляйте i на каждом проходе. Выбор типа аккумулятора важен — сумма может выйти за пределы int, поэтому long long безопаснее для потенциально больших результатов.\n\nОбращайте пристальное внимание на границы цикла. Чтобы включить N в сумму, условие должно быть i <= n; i < n остановится на шаг раньше. Проверка первой и последней итераций вручную — самый простой способ поймать ошибки на единицу.\n\nЦиклы естественно сочетаются с условиями из предыдущего модуля: внутри тела цикла можно ветвиться, выборочно накапливать или досрочно прерываться. Освоение этого сочетания повторения и принятия решений достаточно, чтобы выразить большую часть всех повседневных алгоритмов.",
            task: {
              title: "Sum from 1 to N",
              description:
                "Read an integer N and print the sum of all integers from 1 to N.",
              descriptionRu:
                "Прочитайте целое число N и выведите сумму всех целых чисел от 1 до N.",
              requirements: [
                "Read a single integer N.",
                "Print the sum 1 + 2 + ... + N.",
                "Use a loop to accumulate the result.",
                "For N = 1 the output is 1.",
              ],
              requirementsRu: [
                "Прочитайте одно целое число N.",
                "Выведите сумму 1 + 2 + ... + N.",
                "Используйте цикл для накопления результата.",
                "При N = 1 вывод равен 1.",
              ],
              starterCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO: accumulate and print the sum from 1 to n\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long sum = 0;\n    for (int i = 1; i <= n; i++) sum += i;\n    printf(\"%lld\", sum);\n    return 0;\n}",
              difficulty: "easy",
              tests: [
                { input: "5", expectedOutput: "15" },
                { input: "10", expectedOutput: "55" },
                { input: "1", expectedOutput: "1" },
              ],
            },
            quizzes: [
              {
                question: "Which loop bundles initialization, condition and step in its header?",
                questionRu: "Какой цикл объединяет инициализацию, условие и шаг в своём заголовке?",
                answerVariants: ["do...while", "for", "goto", "switch"],
                correctAnswer: "for",
              },
              {
                question: "Which type safely holds a potentially large sum?",
                questionRu: "Какой тип безопасно хранит потенциально большую сумму?",
                answerVariants: ["int", "char", "long long", "short"],
                correctAnswer: "long long",
              },
              {
                question: "Which loop always runs its body at least once?",
                questionRu: "Какой цикл всегда выполняет тело хотя бы один раз?",
                answerVariants: ["for", "while", "do...while", "if"],
                correctAnswer: "do...while",
              },
            ],
          },
        ],
      },
      {
        title: "C Functions and Algorithms",
        description: "Functions, iterative algorithms and decision logic.",
        language: "C",
        level: "intermediate",
        points: 360,
        modules: [
          {
            title: "Functions",
            theory:
              "As programs grow, putting all logic inside main becomes unmanageable. Functions let you name a piece of behavior, give it inputs (parameters), and reuse it. A C function has a return type, a name, a parameter list, and a body: long long factorial(int n) { ... }. The return statement sends a value back to the caller and ends the function.\n\nC needs to know a function's signature before it is called. You either define the function above main, or provide a prototype — the header line followed by a semicolon — near the top of the file. Forgetting this leads to compiler warnings or errors. A function whose return type is void returns no value and is used purely for its effect, such as printing.\n\nParameters in C are passed by value: the function receives copies, so changing a parameter inside the function does not affect the caller's variable. (To let a function modify the caller's data you pass a pointer — the address of the variable — which you will meet when working with arrays and strings.)\n\nChoosing the right return type is important for correctness. A factorial grows extremely fast — 13! already exceeds the range of a 32-bit int — so returning long long protects the result from overflow for reasonable inputs. Designing small, well-named functions with sensible types is the foundation of readable, bug-resistant C code.",
            theoryRu:
              "По мере роста программы держать всю логику внутри main становится неудобно. Функции позволяют дать имя поведению, задать ему входные данные (параметры) и переиспользовать его. Функция в C имеет тип возврата, имя, список параметров и тело: long long factorial(int n) { ... }. Инструкция return отправляет значение вызывающему коду и завершает функцию.\n\nC нужно знать сигнатуру функции до её вызова. Либо определяйте функцию выше main, либо задавайте прототип — строку-заголовок с точкой с запятой — в начале файла. Забыв об этом, вы получите предупреждения или ошибки компилятора. Функция с типом возврата void не возвращает значения и используется только ради эффекта, например для вывода.\n\nПараметры в C передаются по значению: функция получает копии, поэтому изменение параметра внутри функции не влияет на переменную вызывающего кода. (Чтобы функция могла менять данные вызывающего, передают указатель — адрес переменной, с чем вы встретитесь при работе с массивами и строками.)\n\nВыбор правильного типа возврата важен для корректности. Факториал растёт чрезвычайно быстро — уже 13! выходит за пределы 32-битного int — поэтому возврат long long защищает результат от переполнения для разумных входных значений. Проектирование маленьких, хорошо названных функций с подходящими типами — основа читаемого и устойчивого к ошибкам кода на C.",
            task: {
              title: "Factorial",
              description:
                "Read a non-negative integer n and print n! (the factorial).",
              descriptionRu:
                "Прочитайте неотрицательное целое число n и выведите n! (факториал).",
              requirements: [
                "Read a single non-negative integer n.",
                "Print n! = 1 * 2 * ... * n.",
                "0! must print 1.",
                "Use an integer type large enough to hold the result (long long).",
              ],
              requirementsRu: [
                "Прочитайте одно неотрицательное целое число n.",
                "Выведите n! = 1 * 2 * ... * n.",
                "0! должно выводить 1.",
                "Используйте целочисленный тип, достаточный для результата (long long).",
              ],
              starterCode:
                "#include <stdio.h>\n\nlong long factorial(int n) {\n    // TODO: compute and return n!\n    return 0;\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"%lld\", factorial(n));\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nlong long factorial(int n) {\n    long long result = 1;\n    for (int i = 2; i <= n; i++) result *= i;\n    return result;\n}\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"%lld\", factorial(n));\n    return 0;\n}",
              difficulty: "medium",
              tests: [
                { input: "5", expectedOutput: "120" },
                { input: "0", expectedOutput: "1" },
                { input: "6", expectedOutput: "720" },
              ],
            },
            quizzes: [
              {
                question: "What must a non-void C function do before it ends?",
                questionRu: "Что должна сделать функция в C с ненулевым типом возврата перед завершением?",
                answerVariants: [
                  "Print something",
                  "Return a value of its declared type",
                  "Call main again",
                  "Free all memory",
                ],
                correctAnswer: "Return a value of its declared type",
              },
              {
                question: "Why return long long from a factorial function?",
                questionRu: "Зачем возвращать long long из функции факториала?",
                answerVariants: [
                  "To run faster",
                  "To avoid integer overflow",
                  "To save memory",
                  "It is required by C",
                ],
                correctAnswer: "To avoid integer overflow",
              },
              {
                question: "How are parameters passed in C by default?",
                questionRu: "Как по умолчанию передаются параметры в C?",
                answerVariants: [
                  "By reference",
                  "By value (copies)",
                  "By name",
                  "As global variables",
                ],
                correctAnswer: "By value (copies)",
              },
            ],
          },
          {
            title: "Iterative Algorithms",
            theory:
              "Many problems are solved by carrying a few values forward through a loop, updating them step by step. The Fibonacci sequence is a perfect example: it starts 0, 1, and each later number is the sum of the two before it (0, 1, 1, 2, 3, 5, 8, 13, ...). A naive recursive definition recomputes the same values exponentially many times; an iterative version computes each number once.\n\nThe iterative approach keeps just two variables, a and b, representing consecutive Fibonacci numbers. On each step you compute the next value and shift the pair forward. Doing this n times leaves a holding F(n). Because you touch each position a constant amount of work, the algorithm runs in linear time, O(n), and uses only O(1) extra memory.\n\nUpdating two variables in lockstep requires care so that you do not overwrite a value you still need. Using a temporary variable to hold the old value, or computing the new pair before assigning, avoids this classic trap. As with sums, the numbers grow quickly, so a long long accumulator is the safe choice.\n\nThinking iteratively — identifying the small amount of state that must be carried between steps — is a transferable skill. The same mindset solves running totals, running maxima, digit-by-digit number processing, and countless other problems with simple, efficient loops.",
            theoryRu:
              "Многие задачи решаются переносом нескольких значений вперёд через цикл, обновляя их шаг за шагом. Последовательность Фибоначчи — идеальный пример: она начинается с 0, 1, и каждое следующее число равно сумме двух предыдущих (0, 1, 1, 2, 3, 5, 8, 13, ...). Наивное рекурсивное определение пересчитывает одни и те же значения экспоненциально много раз; итеративная версия вычисляет каждое число один раз.\n\nИтеративный подход хранит лишь две переменные, a и b, представляющие соседние числа Фибоначчи. На каждом шаге вы вычисляете следующее значение и сдвигаете пару вперёд. Сделав это n раз, вы оставите в a значение F(n). Поскольку на каждую позицию приходится постоянный объём работы, алгоритм работает за линейное время O(n) и использует лишь O(1) дополнительной памяти.\n\nОбновление двух переменных синхронно требует аккуратности, чтобы не перезаписать значение, которое ещё нужно. Использование временной переменной для хранения старого значения или вычисление новой пары до присваивания позволяет избежать этой классической ловушки. Как и с суммами, числа быстро растут, поэтому аккумулятор типа long long — безопасный выбор.\n\nУмение мыслить итеративно — выделять небольшой объём состояния, который нужно переносить между шагами — это переносимый навык. Тот же подход решает текущие суммы, текущие максимумы, обработку чисел по цифрам и множество других задач простыми и эффективными циклами.",
            task: {
              title: "Nth Fibonacci number",
              description:
                "Read an integer n and print the n-th Fibonacci number, where F(0) = 0 and F(1) = 1.",
              descriptionRu:
                "Прочитайте целое число n и выведите n-е число Фибоначчи, где F(0) = 0 и F(1) = 1.",
              requirements: [
                "Read a single non-negative integer n.",
                "Fibonacci is defined as F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).",
                "Print F(n).",
                "Use an iterative approach (a loop), not naive recursion.",
              ],
              requirementsRu: [
                "Прочитайте одно неотрицательное целое число n.",
                "Фибоначчи определяется как F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).",
                "Выведите F(n).",
                "Используйте итеративный подход (цикл), а не наивную рекурсию.",
              ],
              starterCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO: print the n-th Fibonacci number\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        long long t = a;\n        a = b;\n        b = t + b;\n    }\n    printf(\"%lld\", a);\n    return 0;\n}",
              difficulty: "medium",
              tests: [
                { input: "7", expectedOutput: "13" },
                { input: "0", expectedOutput: "0" },
                { input: "10", expectedOutput: "55" },
              ],
            },
            quizzes: [
              {
                question: "What is the time complexity of the iterative Fibonacci algorithm?",
                questionRu: "Какова временная сложность итеративного алгоритма Фибоначчи?",
                answerVariants: ["O(1)", "O(log n)", "O(n)", "O(2^n)"],
                correctAnswer: "O(n)",
              },
              {
                question: "How many values does the iterative Fibonacci carry forward each step?",
                questionRu: "Сколько значений переносит вперёд итеративный Фибоначчи на каждом шаге?",
                answerVariants: ["One", "Two", "Three", "n"],
                correctAnswer: "Two",
              },
              {
                question: "What are F(0) and F(1) in the Fibonacci sequence?",
                questionRu: "Чему равны F(0) и F(1) в последовательности Фибоначчи?",
                answerVariants: ["1 and 1", "0 and 1", "1 and 2", "0 and 0"],
                correctAnswer: "0 and 1",
              },
            ],
          },
          {
            title: "Decision Logic",
            theory:
              "Selecting a value based on comparisons is one of the most common tasks in programming. Finding the maximum of several numbers is the canonical example and teaches a pattern you will reuse everywhere: keep a 'best so far' variable, then compare each remaining candidate against it and update when you find something better.\n\nFor three numbers you can start by assuming the first is the maximum, then run two if checks: if the second is larger, take it; if the third is larger than the current best, take that. This generalizes directly to a loop over an array of any size, which you will see in the next course.\n\nWriting clear conditions matters. The relational operators <, >, <=, >= compare values, and choosing > versus >= changes how ties are treated. For a maximum it does not matter which equal value you keep, but in other problems the difference between strict and non-strict comparisons is significant, so be deliberate.\n\nEdge cases deserve attention: all three numbers equal, the maximum appearing first or last, and all values negative. A correct maximum routine returns the value closest to positive infinity even when every input is negative — for -1, -5, -3 the answer is -1. Testing these boundary situations is how you gain confidence that your decision logic is right.",
            theoryRu:
              "Выбор значения на основе сравнений — одна из самых частых задач в программировании. Поиск максимума из нескольких чисел — канонический пример, обучающий приёму, который вы будете переиспользовать везде: храните переменную «лучшее на данный момент», затем сравнивайте каждого следующего кандидата с ней и обновляйте, когда находите нечто лучшее.\n\nДля трёх чисел можно начать с предположения, что первое — максимум, затем выполнить две проверки if: если второе больше, берём его; если третье больше текущего лучшего, берём его. Это напрямую обобщается на цикл по массиву любого размера, что вы увидите в следующем курсе.\n\nВажно писать понятные условия. Операторы отношения <, >, <=, >= сравнивают значения, и выбор > или >= меняет обработку равных значений. Для максимума неважно, какое из равных значений сохранить, но в других задачах разница между строгим и нестрогим сравнением существенна, поэтому будьте осознанны.\n\nГраничные случаи заслуживают внимания: все три числа равны, максимум стоит первым или последним, все значения отрицательны. Корректная функция максимума возвращает значение, ближайшее к плюс бесконечности, даже когда все входные данные отрицательны — для -1, -5, -3 ответ это -1. Тестирование этих граничных ситуаций даёт уверенность, что ваша логика выбора верна.",
            task: {
              title: "Maximum of three numbers",
              description: "Read three integers and print the largest one.",
              descriptionRu: "Прочитайте три целых числа и выведите наибольшее из них.",
              requirements: [
                "Read three integers separated by spaces.",
                "Print the largest of the three.",
                "If several values equal the maximum, print that value.",
                "Negative numbers must be handled correctly.",
              ],
              requirementsRu: [
                "Прочитайте три целых числа, разделённых пробелами.",
                "Выведите наибольшее из трёх.",
                "Если несколько значений равны максимуму, выведите это значение.",
                "Отрицательные числа должны обрабатываться корректно.",
              ],
              starterCode:
                "#include <stdio.h>\n\nint main() {\n    int a, b, c;\n    scanf(\"%d %d %d\", &a, &b, &c);\n    // TODO: print the maximum of a, b and c\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nint main() {\n    int a, b, c;\n    scanf(\"%d %d %d\", &a, &b, &c);\n    int max = a;\n    if (b > max) max = b;\n    if (c > max) max = c;\n    printf(\"%d\", max);\n    return 0;\n}",
              difficulty: "medium",
              tests: [
                { input: "3 9 5", expectedOutput: "9" },
                { input: "10 2 7", expectedOutput: "10" },
                { input: "-1 -5 -3", expectedOutput: "-1" },
              ],
            },
            quizzes: [
              {
                question: "Which operator checks whether one value is greater than another?",
                questionRu: "Какой оператор проверяет, что одно значение больше другого?",
                answerVariants: ["=>", ">", "=>=", ">>"],
                correctAnswer: ">",
              },
              {
                question: "When scanning for a maximum, what do you keep track of?",
                questionRu: "При поиске максимума во время прохода что вы храните?",
                answerVariants: [
                  "Only the first value",
                  "The best value seen so far",
                  "The running sum",
                  "The count of values",
                ],
                correctAnswer: "The best value seen so far",
              },
              {
                question: "For the inputs -1, -5 and -3, what is the maximum?",
                questionRu: "Для чисел -1, -5 и -3 чему равен максимум?",
                answerVariants: ["-5", "-1", "-3", "0"],
                correctAnswer: "-1",
              },
            ],
          },
        ],
      },
      {
        title: "C Arrays and Strings",
        description: "Storing collections, reading many values, and processing text.",
        language: "C",
        level: "advanced",
        points: 380,
        modules: [
          {
            title: "Arrays",
            theory:
              "An array is a fixed-size, contiguous block of memory that stores many values of the same type under one name. You declare it with a size, as in int numbers[100], and access elements by index starting at 0: numbers[0] is the first element, numbers[n-1] is the last. Because the storage is contiguous, indexing is extremely fast.\n\nC does not track how many elements you have actually filled, nor does it stop you from reading or writing past the end of an array — doing so is undefined behavior and a frequent source of crashes and security bugs. You are responsible for keeping a separate count of meaningful elements and for staying within the declared bounds.\n\nA very common input format states a count N on the first line, followed by N values. The idiom is to read N, then loop exactly N times reading one value per iteration. You do not even need to store the values in an array if you only want an aggregate such as a sum — you can read each value into a single temporary variable and add it to an accumulator immediately, which also saves memory.\n\nWhen you do store values, processing them is just a loop from 0 to N-1. The combination of a counted loop and a contiguous array underlies sorting, searching, statistics, and most classic algorithms, so getting comfortable with index-based iteration is essential.",
            theoryRu:
              "Массив — это блок памяти фиксированного размера, расположенный непрерывно, который хранит много значений одного типа под одним именем. Он объявляется с размером, как int numbers[100], а доступ к элементам идёт по индексу, начиная с 0: numbers[0] — первый элемент, numbers[n-1] — последний. Благодаря непрерывному расположению индексация выполняется очень быстро.\n\nC не отслеживает, сколько элементов вы реально заполнили, и не мешает читать или писать за пределами массива — это неопределённое поведение и частый источник падений и уязвимостей. Вы сами отвечаете за хранение отдельного счётчика значимых элементов и за нахождение в границах объявленного размера.\n\nОчень частый формат ввода указывает количество N на первой строке, за которым следуют N значений. Приём такой: прочитать N, затем повторить цикл ровно N раз, читая по одному значению за итерацию. При этом необязательно хранить значения в массиве, если нужен только агрегат вроде суммы — можно читать каждое значение в одну временную переменную и сразу прибавлять к аккумулятору, что также экономит память.\n\nКогда значения всё же хранятся, их обработка — это просто цикл от 0 до N-1. Сочетание счётного цикла и непрерывного массива лежит в основе сортировки, поиска, статистики и большинства классических алгоритмов, поэтому уверенная работа с итерацией по индексу необходима.",
            task: {
              title: "Sum of an array",
              description:
                "The first value is N, the count. The next N values are integers. Print their sum.",
              descriptionRu:
                "Первое значение — это N, количество. Следующие N значений — целые числа. Выведите их сумму.",
              requirements: [
                "First read the count N.",
                "Then read N integers (they may be on the same line or separate lines).",
                "Print the sum of all N integers.",
                "Use a loop to read and accumulate the values.",
              ],
              requirementsRu: [
                "Сначала прочитайте количество N.",
                "Затем прочитайте N целых чисел (они могут быть на одной строке или на разных).",
                "Выведите сумму всех N целых чисел.",
                "Используйте цикл для чтения и накопления значений.",
              ],
              starterCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO: read n integers and print their sum\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long sum = 0;\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf(\"%d\", &x);\n        sum += x;\n    }\n    printf(\"%lld\", sum);\n    return 0;\n}",
              difficulty: "medium",
              tests: [
                { input: "5\n1 2 3 4 5", expectedOutput: "15" },
                { input: "3\n10 20 30", expectedOutput: "60" },
                { input: "1\n42", expectedOutput: "42" },
              ],
            },
            quizzes: [
              {
                question: "How are the elements of a C array stored in memory?",
                questionRu: "Как элементы массива в C хранятся в памяти?",
                answerVariants: [
                  "In random, scattered locations",
                  "In one contiguous block",
                  "Only on disk",
                  "As separate linked nodes",
                ],
                correctAnswer: "In one contiguous block",
              },
              {
                question: "What is the index of the first element of an array?",
                questionRu: "Какой индекс у первого элемента массива?",
                answerVariants: ["0", "1", "-1", "the length"],
                correctAnswer: "0",
              },
              {
                question: "Does C stop you from writing past the end of an array?",
                questionRu: "Останавливает ли C запись за пределами массива?",
                answerVariants: [
                  "Yes, it throws an error",
                  "No, it is undefined behavior",
                  "Only in debug mode",
                  "Yes, it resizes the array",
                ],
                correctAnswer: "No, it is undefined behavior",
              },
            ],
          },
          {
            title: "Strings",
            theory:
              "In C there is no dedicated string type. A string is simply an array of char that ends with a special null character, written '\\0', whose numeric value is 0. This terminator marks where the text stops, which is how functions know the length of a string even though the array itself may be larger. A buffer like char word[1000] can therefore hold any word shorter than 1000 characters plus its terminator.\n\nThe standard library <string.h> provides functions that operate on these null-terminated strings. The most basic is strlen, which counts the characters up to (but not including) the terminator. Others include strcpy for copying, strcmp for comparing, and strcat for concatenation. All of them rely on the '\\0' being present, so never overwrite or lose it.\n\nReading a word with scanf(\"%s\", word) stops at the first whitespace and automatically appends the null terminator for you. Note that with %s you pass the array name without an & — an array name already represents the address of its first element. To read a whole line including spaces you would use a different approach such as fgets.\n\nstrlen returns a value of type size_t, an unsigned integer type. When printing it you can use the %lu specifier with an (unsigned long) cast, or simply assign it to an int for small lengths. Understanding the null terminator is the key that unlocks all string handling in C.",
            theoryRu:
              "В C нет отдельного строкового типа. Строка — это просто массив char, оканчивающийся специальным нулевым символом, который записывается '\\0' и имеет числовое значение 0. Этот терминатор отмечает, где текст заканчивается, благодаря чему функции знают длину строки, даже если сам массив больше. Буфер вроде char word[1000] может хранить любое слово короче 1000 символов плюс его терминатор.\n\nСтандартная библиотека <string.h> предоставляет функции для работы с такими строками с нулевым окончанием. Самая базовая — strlen, которая считает символы до терминатора (не включая его). Другие — strcpy для копирования, strcmp для сравнения, strcat для конкатенации. Все они полагаются на наличие '\\0', поэтому никогда не затирайте и не теряйте его.\n\nЧтение слова через scanf(\"%s\", word) останавливается на первом пробельном символе и автоматически добавляет нулевой терминатор за вас. Обратите внимание, что с %s имя массива передаётся без & — имя массива уже представляет адрес его первого элемента. Чтобы прочитать целую строку с пробелами, используют другой подход, например fgets.\n\nstrlen возвращает значение типа size_t — беззнакового целого. При выводе можно использовать спецификатор %lu с приведением (unsigned long) либо просто присвоить значение int для небольших длин. Понимание нулевого терминатора — ключ, открывающий всю работу со строками в C.",
            task: {
              title: "String length",
              description:
                "Read a single word (without spaces) and print the number of characters in it.",
              descriptionRu:
                "Прочитайте одно слово (без пробелов) и выведите количество символов в нём.",
              requirements: [
                "Read one word from input; it contains no spaces.",
                "Print the number of characters in the word.",
                "Do not count the terminating null character.",
                "You may use a library function or count manually.",
              ],
              requirementsRu: [
                "Прочитайте одно слово из ввода; оно не содержит пробелов.",
                "Выведите количество символов в слове.",
                "Не считайте завершающий нулевой символ.",
                "Можно использовать библиотечную функцию или посчитать вручную.",
              ],
              starterCode:
                "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char word[1000];\n    scanf(\"%s\", word);\n    // TODO: print the length of the word\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char word[1000];\n    scanf(\"%s\", word);\n    printf(\"%lu\", (unsigned long) strlen(word));\n    return 0;\n}",
              difficulty: "medium",
              tests: [
                { input: "hello", expectedOutput: "5" },
                { input: "C", expectedOutput: "1" },
                { input: "programming", expectedOutput: "11" },
              ],
            },
            quizzes: [
              {
                question: "How does C mark the end of a string?",
                questionRu: "Как в C обозначается конец строки?",
                answerVariants: [
                  "With a newline character",
                  "With a null character '\\0'",
                  "With a trailing space",
                  "Only with EOF",
                ],
                correctAnswer: "With a null character '\\0'",
              },
              {
                question: "What does strlen count?",
                questionRu: "Что считает strlen?",
                answerVariants: [
                  "Characters including the terminator",
                  "Characters up to the null terminator",
                  "The array capacity",
                  "Only the vowels",
                ],
                correctAnswer: "Characters up to the null terminator",
              },
              {
                question: "How do you pass an array name to scanf with %s?",
                questionRu: "Как передать имя массива в scanf со спецификатором %s?",
                answerVariants: [
                  "With & before it",
                  "Without & (the name is the address)",
                  "With * before it",
                  "As a number",
                ],
                correctAnswer: "Without & (the name is the address)",
              },
            ],
          },
          {
            title: "Processing Text",
            theory:
              "Once you can read a string, the next step is to inspect it character by character. Because a C string is just an array of char ending in '\\0', the standard idiom is a loop that advances an index until it reaches the terminator: for (int i = 0; word[i] != '\\0'; i++). Inside the loop word[i] is the current character.\n\nIndividual characters in C are really small integers holding their character codes, so you can compare them directly with literals: word[i] == 'a'. Counting how many characters satisfy a condition follows the same accumulator pattern you used with numbers — start a counter at 0 and increment it whenever the test passes. Counting vowels, digits, or a specific letter all share this shape.\n\nThe header <ctype.h> offers helpers like tolower, toupper, isdigit and isalpha that make character classification cleaner and case-insensitive when needed. For lowercase-only input you can compare against 'a', 'e', 'i', 'o', 'u' directly, but on mixed-case text converting with tolower first avoids duplicating every check.\n\nCharacter-by-character processing is the basis of more advanced text work: tokenizing, validating formats, transforming case, and simple parsing. Combined with arrays, loops, and conditions, it lets you build surprisingly capable text tools in plain C.",
            theoryRu:
              "Когда вы умеете читать строку, следующий шаг — разбирать её посимвольно. Поскольку строка в C — это просто массив char, оканчивающийся '\\0', стандартный приём — цикл, продвигающий индекс, пока он не достигнет терминатора: for (int i = 0; word[i] != '\\0'; i++). Внутри цикла word[i] — текущий символ.\n\nОтдельные символы в C на самом деле являются маленькими целыми числами, хранящими свои коды, поэтому их можно напрямую сравнивать с литералами: word[i] == 'a'. Подсчёт того, сколько символов удовлетворяют условию, следует тому же приёму аккумулятора, что и с числами — начните счётчик с 0 и увеличивайте его всякий раз, когда проверка проходит. Подсчёт гласных, цифр или конкретной буквы устроены одинаково.\n\nЗаголовок <ctype.h> предлагает помощников вроде tolower, toupper, isdigit и isalpha, которые делают классификацию символов чище и позволяют не зависеть от регистра. Для ввода только в нижнем регистре можно сравнивать напрямую с 'a', 'e', 'i', 'o', 'u', но для текста со смешанным регистром преобразование через tolower избавляет от дублирования каждой проверки.\n\nПосимвольная обработка — основа более сложной работы с текстом: токенизации, проверки форматов, преобразования регистра и простого разбора. В сочетании с массивами, циклами и условиями она позволяет строить на чистом C на удивление мощные инструменты для работы с текстом.",
            task: {
              title: "Count vowels",
              description:
                "Read a single lowercase word and print how many vowels (a, e, i, o, u) it contains.",
              descriptionRu:
                "Прочитайте одно слово в нижнем регистре и выведите, сколько в нём гласных (a, e, i, o, u).",
              requirements: [
                "Read one lowercase word from input (no spaces).",
                "Count the vowels: a, e, i, o, u.",
                "Print the number of vowels.",
                "If the word contains no vowels, print 0.",
              ],
              requirementsRu: [
                "Прочитайте одно слово в нижнем регистре из ввода (без пробелов).",
                "Посчитайте гласные: a, e, i, o, u.",
                "Выведите количество гласных.",
                "Если в слове нет гласных, выведите 0.",
              ],
              starterCode:
                "#include <stdio.h>\n\nint main() {\n    char word[1000];\n    scanf(\"%s\", word);\n    // TODO: count and print the number of vowels\n    return 0;\n}",
              solutionCode:
                "#include <stdio.h>\n\nint main() {\n    char word[1000];\n    scanf(\"%s\", word);\n    int count = 0;\n    for (int i = 0; word[i] != '\\0'; i++) {\n        char c = word[i];\n        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;\n    }\n    printf(\"%d\", count);\n    return 0;\n}",
              difficulty: "medium",
              tests: [
                { input: "education", expectedOutput: "5" },
                { input: "sky", expectedOutput: "0" },
                { input: "aeiou", expectedOutput: "5" },
              ],
            },
            quizzes: [
              {
                question: "Which set lists the English vowels?",
                questionRu: "В каком наборе перечислены английские гласные?",
                answerVariants: ["a, e, i, o, u", "all consonants", "only a and e", "the digits 0-9"],
                correctAnswer: "a, e, i, o, u",
              },
              {
                question: "How do you detect the end of a C string while looping?",
                questionRu: "Как определить конец строки C в цикле?",
                answerVariants: [
                  "When you reach a space",
                  "When the character equals '\\0'",
                  "After exactly 1000 characters",
                  "When the character is a digit",
                ],
                correctAnswer: "When the character equals '\\0'",
              },
              {
                question: "Characters in C are essentially what?",
                questionRu: "Чем по сути являются символы в C?",
                answerVariants: [
                  "Full strings",
                  "Small integers (character codes)",
                  "Floating-point numbers",
                  "Pointers only",
                ],
                correctAnswer: "Small integers (character codes)",
              },
            ],
          },
        ],
      },
    ],
  },
];

async function clearDatabase() {
  await prisma.userDailyChallenge.deleteMany();
  await prisma.dailyChallenge.deleteMany();
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
            contentRu: moduleData.theoryRu ?? null,
          },
        });

        const task = await prisma.task.create({
          data: {
            moduleId: module.id,
            title: moduleData.task.title,
            description: moduleData.task.description,
            descriptionRu: moduleData.task.descriptionRu ?? null,
            starterCode: moduleData.task.starterCode,
            solutionCode: moduleData.task.solutionCode,
            difficulty: moduleData.task.difficulty,
            requirements: moduleData.task.requirements ?? [],
            requirementsRu: moduleData.task.requirementsRu ?? [],
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

        for (const quizData of moduleData.quizzes) {
          const quiz = await prisma.quiz.create({
            data: {
              moduleId: module.id,
              question: quizData.question,
              questionRu: quizData.questionRu ?? null,
              answerVariants: quizData.answerVariants,
              correctAnswer: quizData.correctAnswer,
            },
          });
          quizIds.push(quiz.id);
        }
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
          language: user.username === "maria" ? "en" : "ru",
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

// Standalone daily challenges. JavaScript solutions define `solve(lines)` where
// `lines` is the input split by newline; C solutions read from stdin and print
// to stdout. Both conventions match the language adapters in src/adapters.
const dailyChallenges = [
  {
    title: "Sum of Two Numbers",
    description: "Read two integers (each on its own line) and return their sum.",
    language: "javascript",
    difficulty: "easy",
    starterCode: "function solve(lines) {\n  // lines is an array of input rows\n  return 0;\n}",
    solutionCode:
      "function solve(lines) {\n  const a = Number(lines[0]);\n  const b = Number(lines[1]);\n  return a + b;\n}",
    tests: [
      { input: "2\n3", expectedOutput: "5" },
      { input: "10\n20", expectedOutput: "30" },
      { input: "-5\n5", expectedOutput: "0" },
    ],
  },
  {
    title: "Reverse a String",
    description: "Return the given string reversed.",
    language: "javascript",
    difficulty: "easy",
    starterCode: "function solve(lines) {\n  return lines[0];\n}",
    solutionCode: 'function solve(lines) {\n  return lines[0].split("").reverse().join("");\n}',
    tests: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "world", expectedOutput: "dlrow" },
      { input: "abc", expectedOutput: "cba" },
    ],
  },
  {
    title: "Factorial",
    description: "Read a non-negative integer n and return n! (factorial).",
    language: "javascript",
    difficulty: "medium",
    starterCode: "function solve(lines) {\n  const n = Number(lines[0]);\n  // TODO\n  return 0;\n}",
    solutionCode:
      "function solve(lines) {\n  const n = Number(lines[0]);\n  let result = 1;\n  for (let i = 2; i <= n; i++) result *= i;\n  return result;\n}",
    tests: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "6", expectedOutput: "720" },
    ],
  },
  {
    title: "Maximum in a List",
    description: "Read a line of space-separated integers and return the largest one.",
    language: "javascript",
    difficulty: "medium",
    starterCode: "function solve(lines) {\n  const numbers = lines[0].split(' ').map(Number);\n  // TODO\n  return 0;\n}",
    solutionCode:
      "function solve(lines) {\n  const numbers = lines[0].split(' ').map(Number);\n  return Math.max(...numbers);\n}",
    tests: [
      { input: "3 7 2 9 1", expectedOutput: "9" },
      { input: "10 2 30", expectedOutput: "30" },
      { input: "5", expectedOutput: "5" },
    ],
  },
  {
    title: "Count Vowels",
    description: "Return how many vowels (a, e, i, o, u) the given string contains.",
    language: "javascript",
    difficulty: "hard",
    starterCode: "function solve(lines) {\n  const text = lines[0];\n  // TODO\n  return 0;\n}",
    solutionCode:
      "function solve(lines) {\n  const matches = lines[0].match(/[aeiou]/gi);\n  return matches ? matches.length : 0;\n}",
    tests: [
      { input: "education", expectedOutput: "5" },
      { input: "sky", expectedOutput: "0" },
      { input: "AeIoU", expectedOutput: "5" },
    ],
  },
  {
    title: "Sum of Two Numbers",
    description: "Read two integers from standard input and print their sum.",
    language: "c",
    difficulty: "easy",
    starterCode:
      "#include <stdio.h>\n\nint main() {\n    // read two integers and print their sum\n    return 0;\n}",
    solutionCode:
      "#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf(\"%d %d\", &a, &b);\n    printf(\"%d\", a + b);\n    return 0;\n}",
    tests: [
      { input: "2 3", expectedOutput: "5" },
      { input: "10 20", expectedOutput: "30" },
      { input: "-5 5", expectedOutput: "0" },
    ],
  },
  {
    title: "Even or Odd",
    description: "Read an integer and print \"Even\" if it is even, otherwise \"Odd\".",
    language: "c",
    difficulty: "easy",
    starterCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO\n    return 0;\n}",
    solutionCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"%s\", n % 2 == 0 ? \"Even\" : \"Odd\");\n    return 0;\n}",
    tests: [
      { input: "4", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" },
      { input: "0", expectedOutput: "Even" },
    ],
  },
  {
    title: "Factorial",
    description: "Read a non-negative integer n and print n! (factorial).",
    language: "c",
    difficulty: "medium",
    starterCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO\n    return 0;\n}",
    solutionCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long result = 1;\n    for (int i = 2; i <= n; i++) result *= i;\n    printf(\"%lld\", result);\n    return 0;\n}",
    tests: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "6", expectedOutput: "720" },
    ],
  },
  {
    title: "Square of a Number",
    description: "Read an integer and print its square.",
    language: "c",
    difficulty: "medium",
    starterCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO\n    return 0;\n}",
    solutionCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    printf(\"%d\", n * n);\n    return 0;\n}",
    tests: [
      { input: "5", expectedOutput: "25" },
      { input: "12", expectedOutput: "144" },
      { input: "0", expectedOutput: "0" },
    ],
  },
  {
    title: "Sum from 1 to N",
    description: "Read an integer N and print the sum of all integers from 1 to N.",
    language: "c",
    difficulty: "hard",
    starterCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // TODO\n    return 0;\n}",
    solutionCode:
      "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    long long sum = 0;\n    for (int i = 1; i <= n; i++) sum += i;\n    printf(\"%lld\", sum);\n    return 0;\n}",
    tests: [
      { input: "5", expectedOutput: "15" },
      { input: "10", expectedOutput: "55" },
      { input: "1", expectedOutput: "1" },
    ],
  },
];

async function seedDailyChallenges() {
  for (const challenge of dailyChallenges) {
    await prisma.dailyChallenge.create({ data: challenge });
  }
  return dailyChallenges.length;
}

async function main() {
  await clearDatabase();

  const ids = await seedLearningCatalog();
  const achievements = await seedAchievements();
  const users = await seedUsers(ids, achievements);
  const dailyCount = await seedDailyChallenges();

  // eslint-disable-next-line no-console
  console.log("Seed data created successfully");
  // eslint-disable-next-line no-console
  console.log(`Users: ${users.length}, courses: ${ids.courseIds.length}, modules: ${ids.moduleIds.length}, daily challenges: ${dailyCount}`);
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
