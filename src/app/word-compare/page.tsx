"use client"
import { useState, useEffect } from 'react';
import Question from '../components/questions2';
import axios from 'axios';

interface QuestionData {
  id: number;
  question: string;
  options: string[];
  answer: string;
}


const Home: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo-16k-0613',
                messages: [
                {
                    role: 'user',
                    content: `
                        instruktusi:
                        - buatkan 50 soal untuk psikotest terkait test persamaan kata atau boleh lebih dari 1 kata maksimal 2-3 kata, seacak mungkin!
                        - dari 50 soal, buatkan 25 kata yang "sama" dan 25 kata yang "beda", dan acak letaknya jadi agar tidak bergrombol!!!
                        
                        cth: 
                            - Johnson Abigael : Jhonson Abigael
                            - Ananda Affan : Ananda Affan
                        
                     
                        notes: 
                            - tolong untuk yang beda dibuatkan bedanya maksimal 2 huruf saja dengan ditukar atau diganti
                            - pastikan panjang stringnya sama
                            - minimal panjang string nya 10 
                        `
                }
                ],
                functions: [
                {
                    name: "get_words",
                    description: "buatkan dua kata yang bedanya hanya 1 huruf untuk soal psikotest",
                    parameters: {
                    type: "object",
                    properties: {
                        list_soal: {
                        type: "array",
                        description: `
                            buatkan word_1 dan word_2, dimana word 1 misal:
                            
                                Nomor 1. 
                                    word_1: "Johnson Abigael" : word_2: "Jhonson Abigael", word_1 dan word_2 BEDA
                                Nomor 2. 
                                    word_2: "Ananda Affan" : word_2: "Ananda Affan", word_1 dan word_2 SAMA
                            
                            buatkan 50 nomor, nomor 1-25  word_1 dan word_2 harus sama dan nomor 26-50  harus beda, dengan letak nomor yang acak!!!
                
                        `,
                        items: {
                            type: "object",
                            properties: {
                            
                                    word_1: {
                                        type: "string",
                                        description: "kata pertama"
                                    },
                                    word_2: {
                                        type: "string",
                                        description: "kata kedua"
                                    }
                                },
                            required: [
                            "word_1",
                            "word_2"
                            ]
                        }
                        }
                    },
                    required: [
                        "list_soal"
                    ]
                    }
                }
                ],
                function_call: "auto",
                temperature: 0,
                max_tokens: 10000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            },
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
               // 'Cookie': '__cf_bm=wEZ1tj7OQ.UQvaFtu2rpmIFaHvayLQ7FXh22XMHLfu0-1708238035-1.0-AUJTi0RaQNfYfHdjSb/KP6hMnjMXy/P4vZvb/3dxJmapCkt/JEWAyAsWriJCKsy5NUbk92C21jvpGcj/byzqD9g=; _cfuvid=uiHReGXAVgRf7fAzjZ7NNne5gtAg48dQ85KesaTEYys-1708234082636-0.0-604800000'
                }
            }
            );

            // Ambil data dari respons dan set state questionsData
            const { data } = response;

            if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.function_call && data.choices[0].message.function_call.arguments) {

                const wordList = data.choices[0].message.function_call.arguments;

                const jsonData = JSON.parse(wordList);
                const listSoal = jsonData.list_soal
                const generatedQuestions = listSoal.map((wordPair: any, index:any) => {

                const word_1 = wordPair.word_1
                const word_2 = wordPair.word_2
                const isSame = word_1.toLowerCase() === word_2.toLowerCase();
    
                return {
                id: index + 1,
                question: `${word_1} - ${word_2}`,
                options: ['sama', 'beda'],
                answer: isSame ? 'sama' : 'beda',
                };
            });

            setQuestionsData(generatedQuestions);
            }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally{
                setIsLoading(false)
            }
        };

        fetchData();
    }, []);
    const [answers, setAnswers] = useState<string[]>(new Array(100).fill(''));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
    const [timer, setTimer] = useState<number>(0);
    
    const [start, setStart] = useState(false);


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
    console.log("-- sumbit ; ", correctAnswers)
    setScore(correctAnswers);
  };

  const handleStart = () => {
    if (isLoading === false) {
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
          {!submitted && isLoading===false? (
              <button
                onClick={handleStart}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mb-5"
              >
                Start
              </button>
            ):<p>Sedang Proses Generate Soal!</p>}
        </div>
      {
       isLoading===false? 
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
            disabled={submitted || isLoading}
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
