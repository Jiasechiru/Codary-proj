import { Link, useParams } from "react-router";
import chevronleft from "../../assets/Icons/chevronleft.svg"
import chevronright from "../../assets/Icons/chevronright.svg"
import styles from "./TheoryPage.module.css";

const TheoryPage = () => {
    const { topicId } = useParams();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app/courses" className={styles.backLink}>
                    <img src={chevronleft} className={styles.smallIcon} />
                    Back to Courses
                </Link>
                <h1 className={styles.title}>Array Methods in JavaScript</h1>
                <p className={styles.subtitle}>Learn how to manipulate arrays using built-in methods</p>
            </div>

            <div className={styles.contentCard}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Introduction</h2>
                    <p className={styles.paragraph}>
                        JavaScript provides powerful array methods that make it easy to work with collections of data.
                        These methods allow you to transform, filter, and process arrays efficiently without writing
                        complex loops.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Common Array Methods</h2>

                    <div className={styles.methodBlock}>
                        <h3 className={styles.methodTitle}>map()</h3>
                        <p className={styles.paragraph}>
                            The <code className={styles.inlineCode}>map()</code> method creates a new array
                            by applying a function to each element.
                        </p>
                        <div className={styles.codeBlock}>
                            <pre>{`const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]`}</pre>
                        </div>
                    </div>

                    <div className={styles.methodBlock}>
                        <h3 className={styles.methodTitle}>filter()</h3>
                        <p className={styles.paragraph}>
                            The <code className={styles.inlineCode}>filter()</code> method creates a new array
                            with elements that pass a test.
                        </p>
                        <div className={styles.codeBlock}>
                            <pre>{`const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]`}</pre>
                        </div>
                    </div>

                    <div className={styles.methodBlock}>
                        <h3 className={styles.methodTitle}>reduce()</h3>
                        <p className={styles.paragraph}>
                            The <code className={styles.inlineCode}>reduce()</code> method reduces an array
                            to a single value.
                        </p>
                        <div className={styles.codeBlock}>
                            <pre>{`const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15`}</pre>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Key Takeaways</h2>
                    <ul className={styles.list}>
                        <li>Array methods like map, filter, and reduce make code more readable and maintainable</li>
                        <li>These methods don't modify the original array (they're immutable)</li>
                        <li>You can chain multiple array methods together for complex operations</li>
                        <li>Understanding these methods is essential for modern JavaScript development</li>
                    </ul>
                </section>
            </div>

            <div className={styles.footerActions}>
                <button className={styles.secondaryButton}>
                    <img src={chevronleft} className={styles.smallIcon} />
                    Previous Topic
                </button>
                <Link
                    to={`/app/quiz/${topicId || 'arrays'}`}
                    className={styles.primaryButton}
                >
                    Take Quiz
                </Link>
                <button className={styles.secondaryButton}>
                    Next Topic
                    <img src={chevronright} className={styles.smallIcon} />
                </button>
            </div>
        </div>
    );
}

export default TheoryPage;