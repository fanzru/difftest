// components/Question.tsx
import React from 'react';

interface QuestionProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, options, selectedOption, onSelectOption }) => {
  return (
    <div>
      <h2>{question}</h2>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            <input
              type="radio"
              id={`option-${index}`}
              name="options"
              value={option}
              checked={selectedOption === option}
              onChange={() => onSelectOption(option)}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
