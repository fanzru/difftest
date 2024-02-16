"use client"
import { useState } from 'react';
import Question from './components/questions2';

interface QuestionData {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

// Fungsi untuk memeriksa apakah dua angka hanya berbeda satu digit
function isOneDigitDifference(num1: number, num2: number): boolean {
  const str1 = num1.toString();
  const str2 = num2.toString();
  let diffCount = 0;

  if (str1.length !== str2.length) {
    return false;
  }

  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) {
      diffCount++;
    }
    if (diffCount > 1) {
      return false;
    }
  }

  return diffCount === 1;
}

// Inisialisasi array untuk pertanyaan
const questionsData: QuestionData[] = [];

// Generate 100 pertanyaan
for (let i = 1; i <= 100; i++) {
  // Generate dua angka acak
  const num1 = Math.floor(Math.random() * 100000000);
  let num2 = num1;
  while (num2 === num1 || !isOneDigitDifference(num1, num2)) {
    num2 = Math.floor(Math.random() * 100000000);
  }

  const question: QuestionData = {
    id: i,
    question: `\n${num1}\u00A0\u00A0\u00A0${num2}\n`,
    options: ['sama', 'beda'],
    answer: 'beda' // Jika angka berbeda, jawabannya akan selalu 'beda'
  };

  questionsData.push(question);
}


export default function Home() {
  // Fungsi untuk mengacak array
// Fungsi untuk mengacak array
// Array kata-kata sehari-hari


  const [answers, setAnswers] = useState<string[]>(new Array(questionsData.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Calculate score
    let correctAnswers = 0;
    for (let i = 0; i < questionsData.length; i++) {
      if (answers[i] === questionsData[i].answer) {
        correctAnswers++;
      }
    }
    setScore(correctAnswers);
    
  };

  return (
    <div className='bg-white text-black'>
      <div className="container mx-auto mt-10 bg-white">
      <h1 className="text-3xl font-bold mb-5">Quiz</h1>
      {questionsData.map((question, index) => (
        <Question
          key={question.id}
          index={index}
          question={question}
          submitted={submitted}
          answer={answers[index]}
          onAnswerChange={handleAnswerChange}
        />
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
      >
        Submit
      </button>
      {submitted && (
        <p className="mt-5">
          Skor Anda: {score} / {questionsData.length}
        </p>
      )}
    </div>
    </div>
  );
}
