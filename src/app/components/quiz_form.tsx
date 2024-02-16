// components/QuizForm.tsx
"use client"
import React, { useState } from 'react';
import Question from './questions';

interface QuizFormProps {
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

const QuizForm: React.FC<QuizFormProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string | null }>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelectOption = (option: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: option
    });
  };

  const handleSubmit = () => {
    setShowResult(true);
    // Lakukan logika untuk menghitung skor di sini
  };

  return (
    <div>
      {showResult ? (
        // Komponen untuk menampilkan hasil
        <div>Result Component</div>
      ) : (
        <div>
          <h1>Quiz</h1>
          <Question
            question={questions[currentQuestionIndex].question}
            options={questions[currentQuestionIndex].options}
            selectedOption={selectedOptions[currentQuestionIndex]}
            onSelectOption={handleSelectOption}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default QuizForm;
