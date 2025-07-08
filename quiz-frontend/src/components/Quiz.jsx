// This line tells our computer, "Hey, we need the special tools to build our React game!"
// `useState` is like a sticky note that helps us remember things that change.
// `useEffect` is like a little robot helper that automatically does tasks for us.
import React, { useState, useEffect } from 'react';
// This line says, "Also, bring in our special crayon box (CSS) named 'Quiz.css' to make things pretty!"
// *** IMPORTANT: Make sure your Quiz.css file is in the SAME folder (src/components/) as this Quiz.jsx file,
//              and that it is named exactly 'Quiz.css' (with capital Q and C). ***
import './Quiz.css';

// This is a special magic helper. Imagine sometimes words from the internet quiz
// come with funny symbols (like "rock &amp; roll" instead of "rock & roll").
// This helper makes those funny symbols look normal and nice for us.
function decodeHtml(html) {
    // We create a secret, temporary box in the computer's memory.
    var txt = document.createElement("textarea");
    // We put the funny-looking words into this secret box.
    // The secret box is smart and automatically cleans up the funny symbols!
    txt.innerHTML = html;
    // Then we take the cleaned-up, normal-looking words out of the box. Ta-da!
    return txt.value;
}

// This is another magic helper. Imagine you have a pile of answer cards,
// and you want to mix them up really, really well so the correct answer
// isn't always in the same spot (like always being the first choice).
function shuffleArray(array) {
    // We go through each card in the pile, starting from the very last one...
    for (let i = array.length - 1; i > 0; i--) {
        // We pick a random spot (let's call it `j`) somewhere before the current card (`i`).
        const j = Math.floor(Math.random() * (i + 1));
        // Then, we quickly swap the card at spot `i` with the card at spot `j`.
        // It's like a quick card swap trick! We do this many times to really mix them up.
        [array[i], array[j]] = [array[j], array[i]];
    }
    // After swapping a bunch, the whole array of cards is now nicely mixed!
    return array;
}

// This is where our main Quiz game building block (component) really starts!
// It's like the master control panel for our quiz game.
const Quiz = () => {
    // -- Our Game's Memory (using `useState` sticky notes) --

    // This sticky note will hold a list of all the different types of quizzes we can play
    // (like "Sports Quiz", "History Quiz"). It starts empty, like an empty list.
    const [categories, setCategories] = useState([]);
    // This sticky note remembers which quiz type (category) we've chosen by its special ID number.
    // It starts as "nothing chosen" (`null`).
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    // This sticky note holds all the actual quiz questions we get for our chosen quiz type.
    // It starts empty, like an empty pile of question cards.
    const [questions, setQuestions] = useState([]);
    // This sticky note keeps track of which question we are on right now.
    // It starts at the very first question, which is always number `0` in computer counting.
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // This sticky note remembers how many points we have scored in the quiz! It starts at `0`.
    const [score, setScore] = useState(0);
    // This sticky note is like a "Please Wait..." sign.
    // It's `true` when the computer is busy getting information, and `false` when it's done.
    // It starts as `true` because we're waiting for the categories to load first.
    const [isLoading, setIsLoading] = useState(true);
    // This sticky note is for any "Oops! Something went wrong!" messages. It starts empty.
    const [error, setError] = useState(null);
    // This sticky note is like a "Game Started!" flag.
    // It's `false` until we pick a category and press the "Start Quiz" button.
    const [quizStarted, setQuizStarted] = useState(false);
    // This sticky note remembers the answer we clicked for the current question.
    // It starts as "no answer clicked" (`null`).
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    // This sticky note remembers if the answer we picked was right or wrong.
    // It starts empty, as we haven't answered yet.
    const [answerStatus, setAnswerStatus] = useState(null); // Can be 'correct', 'incorrect', or `null`

    // NEW TIMER STICKY NOTES!
    // This sticky note will count down the seconds for each question.
    // Let's start each question with 15 seconds.
    const [timeLeft, setTimeLeft] = useState(15);
    // This sticky note will tell us if the timer should be running.
    const [timerRunning, setTimerRunning] = useState(false);


    // -- Our Little Robot Helpers (`useEffect`s) --

    // This is our first little robot helper. It runs when the Quiz game piece first appears on the screen.
    // Its job is to go fetch the list of all the different quiz categories from the internet.
    useEffect(() => {
        // This is a special set of instructions for the robot to do its fetching work.
        const fetchCategories = async () => {
            try {
                // The robot bravely goes to this special internet address to get the category list.
                // `await` means the robot will wait here until it gets a response back.
                const response = await fetch('https://opentdb.com/api_category.php');
                // If the internet connection wasn't good (like a broken link), the robot shouts an error message.
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                // If everything is fine, the robot takes the information it got and understands it (by turning it into a JavaScript object).
                const data = await response.json();
                // The robot then puts the list of categories it found onto our 'categories' sticky note.
                setCategories(data.trivia_categories);
            } catch (err) {
                // If the robot finds any problem, it writes an "Oops!" message on the 'error' sticky note.
                setError('Failed to load quiz categories. Please try again later.');
            } finally {
                // `finally` means: No matter what happened (success or error), after all that,
                // the robot takes down the "Please Wait..." sign (`isLoading` becomes `false`).
                setIsLoading(false);
            }
        };

        fetchCategories(); // The robot starts its job as soon as the game loads for the very first time.
    }, []); // The empty square brackets `[]` here mean: "Robot, only do this job ONCE when the game starts, and never again."

    // This is our second little robot helper. It's a bit smarter and only runs when certain things change.
    // Its job is to go fetch the actual quiz questions for the category we chose.
    useEffect(() => {
        // This is a special set of instructions for the robot to do its question-fetching work.
        const fetchQuestions = async () => {
            // The robot only starts fetching questions if these two conditions are true:
            // 1. We've picked a category (so `selectedCategoryId` has a number, not `null`).
            // 2. The "Game Started!" flag is ON (`quizStarted` is `true`).
            if (selectedCategoryId && quizStarted) {
                setIsLoading(true); // Put up the "Please Wait..." sign again for fetching questions.
                setError(null); // Wipe off any old "Oops!" messages.
                setQuestions([]); // Empty the old pile of questions, ready for new ones.

                try {
                    // The robot goes to this *new* internet address to get 10 questions for our chosen category.
                    // The numbers after `?` are like special instructions for the website:
                    // `amount=10` means "give me 10 questions".
                    // `category=${selectedCategoryId}` means "for the category with this ID number".
                    // `type=multiple` means "make sure each question has 4 choices".
                    const response = await fetch(
                        `https://opentdb.com/api.php?amount=10&category=${selectedCategoryId}&type=multiple`
                    );
                    // If the connection wasn't good, the robot shouts an error.
                    if (!response.ok) {
                        throw new Error('Failed to fetch questions');
                    }
                    // The robot understands the information it gets.
                    const data = await response.json();

                    // If the internet gives us no questions at all for that category (e.g., category is empty),
                    // the robot writes an error message and turns off the "Game Started!" flag
                    // so we can go back and pick a new category.
                    if (data.results.length === 0) {
                        setError('No questions found for this category. Please try another.');
                        setQuizStarted(false); // Go back to category selection if no questions.
                        return; // Stop here, no more work for this robot helper.
                    }

                    // For each question the robot got from the internet:
                    const formattedQuestions = data.results.map((q) => {
                        // The robot gathers all the incorrect answers and cleans their words using our `decodeHtml` helper.
                        const incorrectAnswers = q.incorrect_answers.map(decodeHtml);
                        // The robot makes one big list of ALL answers (the wrong ones and the right one).
                        // It also mixes them up randomly using our `shuffleArray` helper!
                        const allAnswers = shuffleArray([
                            ...incorrectAnswers, // This spreads out all the wrong answers into our new list.
                            decodeHtml(q.correct_answer), // Don't forget to add the cleaned-up correct answer!
                        ]);

                        // The robot makes a neat little card for each question with cleaned words and mixed answers.
                        return {
                            question: decodeHtml(q.question), // The cleaned-up question text.
                            correct_answer: decodeHtml(q.correct_answer), // The cleaned-up correct answer text.
                            options: allAnswers, // Our mixed-up list of choices for this question.
                        };
                    });
                    // The robot then puts this new, neat pile of questions onto our 'questions' sticky note.
                    setQuestions(formattedQuestions);
                } catch (err) {
                    // If something went wrong while getting questions, the robot writes an "Oops!" message.
                    setError('Failed to load questions. Please try again.');
                } finally {
                    // After trying to get questions (success or error), the robot takes down the "Please Wait..." sign.
                    setIsLoading(false);
                }
            }
        };

        fetchQuestions(); // This robot starts its job when it's supposed to.
    // These square brackets mean: "Robot, do this job AGAIN if the 'selectedCategoryId' sticky note changes
    // OR if the 'quizStarted' flag changes. Otherwise, don't bother."
    }, [selectedCategoryId, quizStarted]);


    // NEW TIMER ROBOT HELPER!
    // This is our third little robot helper! Its job is to manage the timer.
    // It wakes up when `quizStarted`, `currentQuestionIndex`, or `timerRunning` sticky notes change.
    useEffect(() => {
        let timer; // This is a tiny temporary note just for this robot.

        // This robot only does its job if the quiz has started and the timer is supposed to be running.
        // It also checks if there's time left and if an answer hasn't been picked yet.
        if (quizStarted && timerRunning && timeLeft > 0 && selectedAnswer === null) {
            // This tells the robot to do something every 1000 milliseconds (which is 1 second).
            timer = setInterval(() => {
                // Every second, make the 'timeLeft' sticky note go down by 1.
                // `prevTime` is just a way to say "whatever the time was *before* this second."
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        }

        // Logic: What happens if the time runs out?
        // If 'timeLeft' becomes 0, and the quiz is still going, and we haven't picked an answer yet:
        if (timeLeft === 0 && quizStarted && selectedAnswer === null) {
            setAnswerStatus('incorrect'); // Mark the question as incorrect.
            setSelectedAnswer('time_out'); // Mark that time ran out (this is a special value, not a real answer).
            setScore(score); // Keep the score as it is (no points for running out of time).
            setTimerRunning(false); // Stop the timer robot.
        }

        // This is important! When the robot is no longer needed (e.g., question changes, or game ends),
        // it cleans up its `setInterval` so it doesn't keep counting forever in the background.
        // This is like telling the robot, "Okay, your job here is done, you can stop now."
        return () => {
            clearInterval(timer); // Stop the timer's counting job.
        };
    // This robot runs when these sticky notes change:
    // - `timeLeft`: Because it needs to know when time hits 0.
    // - `quizStarted`: When the game starts/stops.
    // - `currentQuestionIndex`: When a new question loads, we need a new timer.
    // - `timerRunning`: To start/stop counting.
    // - `selectedAnswer`: To stop the timer if an answer is selected.
    // - `score`: To keep track of the score when time runs out.
    }, [timeLeft, quizStarted, currentQuestionIndex, timerRunning, selectedAnswer, score]);


    // -- Our Game Manager Buttons (Functions) --

    // This is what happens when you click on a category button (like "Sports" or "History").
    const handleCategorySelect = (id) => {
        setSelectedCategoryId(id); // Write the chosen category's ID number onto the 'selectedCategoryId' sticky note.
        setQuizStarted(false); // Make sure the "Game Started!" flag is OFF for now.
        setQuestions([]); // Empty any old questions from previous games.
        setCurrentQuestionIndex(0); // Reset the question counter to the very first question spot.
        setScore(0); // Reset our score to zero.
        setSelectedAnswer(null); // Forget any old chosen answers.
        setAnswerStatus(null); // Clear any old notes about answer correctness.
        setError(null); // Clear any old "Oops!" messages.
        setIsLoading(false); // Make sure the loading sign is off initially, will be turned on by useEffect if questions are fetched.
        setTimeLeft(15); // NEW: Reset timer to starting value (15 seconds)
        setTimerRunning(false); // NEW: Stop the timer robot
    };

    // This is what happens when you click the big "Start Quiz!" button.
    const startQuiz = () => {
        // We only let the game start if we've actually picked a category.
        if (selectedCategoryId) {
            setQuizStarted(true); // Flip the "Game Started!" flag to ON.
            setCurrentQuestionIndex(0); // Make sure we start at the first question.
            setScore(0); // Make sure score is zero.
            setSelectedAnswer(null); // Clear any old chosen answers.
            setAnswerStatus(null); // Clear any old answer correctness notes.
            setTimeLeft(15); // NEW: Reset for the first question
            setTimerRunning(true); // NEW: START THE TIMER ROBOT!
        } else {
            // If no category was picked, show an "Oops!" message.
            setError('Please select a category to start the quiz!');
        }
    };

    // This is what happens when you click on one of the answer buttons for a question.
    const handleAnswerClick = (answer) => {
        // Logic: If we've already picked an answer for this question, don't let us pick again!
        // `selectedAnswer !== null` means "Is there already something written on the 'selectedAnswer' sticky note?"
        // `return` means stop doing anything more in this function.
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answer); // Remember which answer we picked on the 'selectedAnswer' sticky note.
        setTimerRunning(false); // NEW: Tell the timer robot to STOP counting when an answer is clicked.
        // Why it's here: Once an answer is chosen, the time for that question is over.
        // What if it didn't exist: The timer would keep counting down even after you've answered, which isn't how quizzes work.

        // Find the question we are currently on from our list of questions.
        const currentQuestion = questions[currentQuestionIndex];
        // Logic: Check if the answer we picked is the same as the correct answer for this question.
        if (answer === currentQuestion.correct_answer) {
            setScore(score + 1); // If correct, give us one more point!
            setAnswerStatus('correct'); // Write "correct" on the 'answerStatus' sticky note.
        } else {
            setAnswerStatus('incorrect'); // Otherwise, write "incorrect".
        }
    };

    // This is what happens when you click the "Next Question" button.
    const handleNextQuestion = () => {
        // Logic: Only let us go to the next question if we have already picked an answer for the current one.
        if (selectedAnswer === null) return;

        setSelectedAnswer(null); // Forget the answer we picked for the *last* question.
        setAnswerStatus(null); // Clear the correctness note for the *last* question.

        // Logic: Check if there are more questions left in our 'questions' list.
        // `questions.length - 1` is the number of the very last question (remember, computer counting starts at 0!).
        if (currentQuestionIndex < questions.length - 1) {
            // If yes, move the 'currentQuestionIndex' sticky note to the next number (go to the next question).
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(15); // NEW: Reset the timer to 15 seconds for the new question.
            setTimerRunning(true); // NEW: Start the timer robot for the new question.
            // Why it's here: Each new question should have a fresh timer starting.
            // What if it didn't exist: The timer wouldn't reset for the next question; it would either stay at 0 or continue from where it left off.
        } else {
            // If no more questions are left, the game is over!
            // (The screen will automatically change to the "Quiz Finished!" message.)
            setTimerRunning(false); // NEW: Stop the timer robot when the quiz ends.
            // Why it's here: The quiz is over, so the timer is no longer needed.
            // What if it didn't exist: The timer might keep running even after the quiz is finished.
        }
    };

    // This is what happens when you click the "Play Again!" button at the end of the quiz.
    const resetQuiz = () => {
        setQuizStarted(false); // Turn off the "Game Started!" flag.
        setSelectedCategoryId(null); // Forget the old chosen category.
        setQuestions([]); // Empty the questions list.
        setCurrentQuestionIndex(0); // Reset the question counter to the very first spot.
        setScore(0); // Reset our score to zero.
        setSelectedAnswer(null); // Clear selected answer.
        setAnswerStatus(null); // Clear answer status.
        setError(null); // Clear any error messages.
        setIsLoading(false); // Make sure the "Please Wait" sign is off.
        setTimeLeft(15); // NEW: Reset timer to starting value (15 seconds)
        setTimerRunning(false); // NEW: Stop the timer robot
        // Why it's here: To make sure everything is clean and ready for a brand new game.
        // What if it didn't exist: The timer might show an old time or start counting incorrectly for the new game.
    };

    // -- What Our Quiz Game Building Block Will Show on the Screen --
    // This is the blueprint for how our Quiz component will look.
    return (
        // This is the very big outer box for our whole quiz game area.
        // It has a class name 'quiz-outer-container' so we can draw it with CSS.
        <div className="quiz-outer-container">
            {/* This is the main box inside, where all the quiz content goes. */}
            {/* It has a class name 'quiz-content-box' for styling. */}
            <div className="quiz-content-box">
                {/* The big title for our quiz game. */}
                <h1 className="quiz-title">Quiz Zone!</h1>

                {/* This part only shows if the 'isLoading' sticky note says true. */}
                {/* It's like having a little sign that says "Please Wait..." */}
                {isLoading && (
                    <p className="loading-message">
                        {/* This part makes a little spinning circle animation! */}
                        <span className="spinner"></span>
                        Loading categories...
                    </p>
                )}

                {/* This part only shows if the 'error' sticky note has a message. */}
                {/* It's like an "Oops!" alert box. */}
                {error && (
                    <div className="error-message" role="alert">
                        <strong className="error-strong">Error:</strong>
                        <span className="error-text">{error}</span>
                    </div>
                )}

                {/* This big section shows if the game HASN'T started AND we're NOT busy loading. */}
                {/* This is where you choose your quiz category. */}
                {!quizStarted && !isLoading && (
                    <div className="category-selection-area">
                        {/* A title to tell us to pick a quiz type. */}
                        <h2 className="category-heading">Choose a Quiz Game Table:</h2>
                        {/* This makes a grid (like a tic-tac-toe board) for our category buttons. */}
                        <div className="category-grid">
                            {/* For each category in our 'categories' list, we make a button. */}
                            {categories.map((category) => (
                                <button
                                    key={category.id} // Each button needs a unique ID, like a name tag.
                                    onClick={() => handleCategorySelect(category.id)} // When clicked, call handleCategorySelect.
                                    // This uses different CSS classes to make the button look selected or not.
                                    className={`category-button ${selectedCategoryId === category.id ? 'selected' : ''}`}
                                >
                                    {category.name} {/* Show the name of the category (e.g., "History"). */}
                                </button>
                            ))}
                        </div>
                        {/* The "Start Quiz!" button. */}
                        <button
                            onClick={startQuiz} // When clicked, call startQuiz.
                            // This button is greyed out (disabled) if we haven't picked a category or if we're busy loading.
                            disabled={!selectedCategoryId || isLoading}
                            className="start-quiz-button"
                        >
                            Start Quiz!
                        </button>
                    </div>
                )}

                {/* This big section shows if the game HAS started AND we have questions AND we're NOT done with all questions. */}
                {/* This is the main quiz playing area. */}
                {quizStarted && questions.length > 0 && currentQuestionIndex < questions.length && (
                    <div className="quiz-playing-area">
                        {/* A line showing "Question 1 / 10", "Score: 5", AND THE TIMER! */}
                        <div className="quiz-info-bar">
                            <p className="question-counter">Question {currentQuestionIndex + 1} / {questions.length}</p>
                            {/* NEW: Display the timer here! */}
                            <p className="timer-display">Time: {timeLeft}s</p>
                            <p className="score-display">Score: {score}</p>
                        </div>

                        {/* The actual question text. */}
                        <h2 className="question-text">
                            {questions[currentQuestionIndex].question}
                        </h2>

                        {/* This makes a grid for our answer buttons. */}
                        <div className="options-grid">
                            {/* For each answer option for the current question, we make a button. */}
                            {questions[currentQuestionIndex].options.map((option, index) => (
                                <button
                                    key={index} // Each answer button needs a unique ID.
                                    onClick={() => handleAnswerClick(option)} // When clicked, check the answer.
                                    disabled={selectedAnswer !== null} // Grey out after an answer is chosen.
                                    // More CSS classes to change button colors based on correct/incorrect and selection.
                                    className={`
                                        option-button
                                        ${selectedAnswer === option
                                            ? (answerStatus === 'correct' ? 'option-correct-selected' : 'option-incorrect-selected')
                                            : ''
                                        }
                                        ${selectedAnswer !== null && option === questions[currentQuestionIndex].correct_answer
                                            ? 'option-correct-highlight'
                                            : ''
                                        }
                                        ${selectedAnswer !== null ? 'option-disabled' : ''}
                                    `}
                                >
                                    {option} {/* Show the answer text. */}
                                </button>
                            ))}
                        </div>

                        {/* The "Next Question" or "Finish Quiz" button. Only shows after an answer is picked. */}
                        {selectedAnswer !== null && (
                            <button
                                onClick={handleNextQuestion} // When clicked, go to the next question.
                                className="next-question-button"
                            >
                                {/* Text changes based on whether it's the last question or not. */}
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </button>
                        )}
                    </div>
                )}

                {/* This big section shows if the game HAS started AND we have questions AND we ARE done with all questions. */}
                {/* This is the "Quiz Finished!" summary screen. */}
                {quizStarted && questions.length > 0 && currentQuestionIndex === questions.length && (
                    <div className="quiz-finished-area">
                        {/* "Quiz Finished!" title. */}
                        <h2 className="quiz-finished-heading">Quiz Finished!</h2>
                        {/* Your big score display! */}
                        <p className="final-score">Your Score: {score} / {questions.length}</p>
                        {/* "Play Again!" button. */}
                        <button
                            onClick={resetQuiz} // When clicked, reset everything for a new game.
                            className="play-again-button"
                        >
                            Play Again!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// This line is like saying, "Okay, this 'Quiz' game piece is ready to be used by other parts of our app!"
export default Quiz;
