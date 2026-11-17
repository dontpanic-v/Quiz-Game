/**
 * QuestionEditor
 * ──────────────
 * FILE    src/components/QuizBuilder/QuestionEditor.jsx  (+ QuestionEditor.module.css)
 * OWNER   tesroth (only tesroth edits this file)
 *
 * PURPOSE
 *   Form block for ONE question inside CreateQuizPage. Controlled component:
 *   no own copy of the data, every change goes up through onChange.
 *
 * EXPORT
 *   export default function QuestionEditor({ index, value, errors, onChange, onRemove, canRemove })
 *
 * PROPS
 *   index      number            0-based, shown as "Question 1"
 *   value      { id, question, answers: string[], correctAnswer }
 *   errors     { question?: string, answers?: string, correctAnswer?: string }
 *   onChange   (nextValue) => void   always pass a NEW object (no mutation)
 *   onRemove   () => void
 *   canRemove  boolean           false when it's the only question
 *
 * REQUIREMENTS
 *   1. <fieldset> with <legend>"Question {index + 1}"</legend>
 *   2. Textarea for the question text
 *   3. 2–4 answer rows: radio "correct" + text input + remove (×) when more than 2
 *      "Add answer" button while fewer than 4
 *   4. Typing in an answer that is the correctAnswer keeps it selected (update both)
 *   5. Error messages under the matching field, inputs get aria-invalid
 *   6. Every input has a <label> (visually hidden is fine for answer inputs)
 */
