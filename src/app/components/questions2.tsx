// components/Question.tsx
import React, { useState } from 'react';

interface QuestionProps {
  index: number;
  question: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  };
  submitted: boolean;
  answer: string;
  onAnswerChange: (index: number, answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ index, question, submitted, answer, onAnswerChange }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerChange(index, e.target.value);
  };

  return (
    <div className="mb-5 border-2 p-4 text-black">
      <p className="font-bold">{question.question}</p>
      {question.options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex items-center">
          <input
            type="radio"
            id={`option-${index}-${optionIndex}`}
            name={`question-${index}`}
            value={option}
            onChange={handleChange}
            disabled={submitted}
            checked={answer === option}
            className="mr-2"
          />
          <label htmlFor={`option-${index}-${optionIndex}`}>{option}</label>
        </div>
      ))}
      {submitted && (
        <div>
          <p>Kunci Jawaban: {question.answer}</p>
          <p>Jawaban Anda: {answer}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
