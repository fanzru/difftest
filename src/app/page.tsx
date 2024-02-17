"use client"
import { useState, useEffect } from 'react';
import Question from './components/questions2';

interface QuestionData {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

// function isOneDigitDifference(num1: number, num2: number): boolean {
//   const str1 = num1.toString();
//   const str2 = num2.toString();
//   let diffCount = 0;

//   if (str1.length !== str2.length) {
//     return false;
//   }

//   for (let i = 0; i < str1.length; i++) {
//     if (str1[i] !== str2[i]) {
//       diffCount++;
//     }
//     if (diffCount > 1) {
//       return false;
//     }
//   }

//   return diffCount === 1;
// }

// const generateQuestionsData = (): QuestionData[] => {
//   const questionsData: QuestionData[] = [];

//   for (let i = 1; i <= 100; i++) {
//     const num1 = Math.floor(Math.random() * 100000000);
//     let num2 = num1;
//     while (num2 === num1 || !isOneDigitDifference(num1, num2)) {
//       num2 = Math.floor(Math.random() * 100000000);
//     }

//     const question: QuestionData = {
//       id: i,
//       question: `\n${num1}\u00A0\u00A0\u00A0${num2}\n`,
//       options: ['sama', 'beda'],
//       answer: 'beda'
//     };

//     questionsData.push(question);
//   }

//   return questionsData;
// };

// function oneDigitDiffer(num: number): number {
//   const numStr = num.toString();
//   const len = numStr.length;
//   for (let i = 0; i < len; i++) {
//     for (let j = 0; j < 10; j++) {
//       if (j !== parseInt(numStr[i])) {
//         const newNumStr = numStr.substring(0, i) + j.toString() + numStr.substring(i + 1);
//         const newNum = parseInt(newNumStr, 10);
//         if (newNum !== num) {
//           return newNum;
//         }
//       }
//     }
//   }
//   return num;  // No one-digit difference found
// }

// const generateQuestionsData = (): QuestionData[] => {
//   const questionsData: QuestionData[] = [];

//   for (let i = 1; i <= 100; i++) {
//     const isSame = Math.random() < 0.5; // Randomly decide if the numbers should be the same

//     let num1: number, num2: number;
//     if (isSame) {
//       num1 = Math.floor(Math.random() * 100000000);
//       num2 = num1; // If they should be the same, simply assign num2 = num1
//     } else {
//       num1 = Math.floor(Math.random() * 100000000);
//       num2 = oneDigitDiffer(num1); // If they should be different, use the oneDigitDiffer function
//     }

//     const question: QuestionData = {
//       id: i,
//       question: `\n${num1}\u00A0\u00A0\u00A0${num2}\n`,
//       options: ['sama', 'beda'],
//       answer: isSame ? 'sama' : 'beda', // Determine the answer based on whether they are the same or different
//     };

//     questionsData.push(question);
//   }

//   return questionsData;
// };

// const generateQuestionsData = (): QuestionData[] => {
//   const questionsData: QuestionData[] = [];

//   for (let i = 1; i <= 100; i++) {
//     const num1 = Math.floor(Math.random() * 100000000);
//     const num2 = oneDigitDiffer(num1);

//     const question: QuestionData = {
//       id: i,
//       question: `\n${num1}\u00A0\u00A0\u00A0${num2}\n`,
//       options: ['sama', 'beda'],
//       answer: num1 !== num2 ? 'beda' : 'sama',
//     };

//     questionsData.push(question);
//   }

//   return questionsData;
// };

const generateQuestionsData = (): QuestionData[] => {
  const questionsData: QuestionData[] = [];

  for (let i = 1; i <= 100; i++) {
    let num1 = generateRandomNumberString();
    let num2 = num1;

    // Gunakan Math.random() untuk menentukan apakah num2 akan diubah
    if (Math.random() < 0.5) {
      // Ubah satu angka pada num2
      const indexToChange = Math.floor(Math.random() * num2.length);
      const newDigit = (parseInt(num2[indexToChange]) + 1) % 10;
      num2 = num2.substring(0, indexToChange) + newDigit + num2.substring(indexToChange + 1);
    }

    const question: QuestionData = {
      id: i,
      question: `\n${num1}\u00A0\u00A0\u00A0${num2}\n`,
      options: ['sama', 'beda'],
      answer: num1 === num2 ? 'sama' : 'beda',
    };

    questionsData.push(question);
  }

  return questionsData;
};

// Fungsi untuk menghasilkan string angka acak
const generateRandomNumberString = (): string => {
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};


const Home: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>(new Array(100).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
  const [timer, setTimer] = useState<number>(0);
  
  const [start, setStart] = useState(false);
  useEffect(() => {
    setQuestionsData(generateQuestionsData());
  }, []);

    // Effect to update timer
    useEffect(() => {
      let timerID: NodeJS.Timeout;
  
      if (start && !submitted) {
        timerID = setInterval(() => {
          setTimer(prevTimer => prevTimer + 1);
        }, 1000); // Update timer every second
      }
  
      return () => {
        clearInterval(timerID);
      };
    }, [start, submitted]);
  
  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setEndTime(Date.now());

    let correctAnswers = 0;
    for (let i = 0; i < questionsData.length; i++) {
      if (answers[i] === questionsData[i].answer) {
        correctAnswers++;
      }
    }
    setScore(correctAnswers);
  };

  const handleStart = () => {
    if (questionsData.length === 100) {
      setSubmitted(false);
      setStartTime(Date.now());
      setTimer(0);
    }
    setStart(true)
  };

  return (
    <div className='bg-white text-black'>
      <div className="container mx-auto mt-10 bg-white">
        <h1 className="text-3xl font-bold mb-5 text-center w-full">Quiz</h1>
    
        <div className='w-full flex justify-center items-center'>
          {!submitted && questionsData.length === 100? (
              <button
                onClick={handleStart}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mb-5"
              >
                Start
              </button>
            ):<p>Sedang Proses Generate Soal!</p>}
        </div>
      {
        questionsData.length === 100? 
        <div className='w-full flex items-center justify-center'>
          <div className='px-10 border-2 mt-2 mb-2'>{`time : ${timer}`}</div>
        </div>
        :
        <></>
      }
        {start ? questionsData.map((question, index) => (
          <Question
            key={question.id}
            index={index}
            question={question}
            submitted={submitted}
            answer={answers[index]}
            onAnswerChange={handleAnswerChange}
          />
        )):<></>}
        <div className='w-full flex justify-center items-center flex-col mb-10'>
           {
            start?  <button
            disabled={submitted || questionsData.length !== 100}
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
          >
          Submit
        </button> : <></>
           }
          <div>
            {submitted && (
              <p className="mt-5 mb-10 text-center">
                Skor Anda: {score} / {questionsData.length} <br />
                Waktu yang diperlukan: {endTime && startTime ? `${(endTime - startTime) / 1000} detik` : '0 detik'}
              </p>
            )}
          </div>
        <div>
            
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
