import React, { useState } from 'react';

const Worksheet = () => {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    { id: 1, question: "17 rounded off to the nearest 10 is..", options: [10, 20, 17], correct: 20 },
    { id: 2, question: "45 rounded off to the nearest 10 is..", options: [50, 45, 40], correct: 50 },
    { id: 3, question: "75 rounded off to the nearest 10 is..", options: [70, 80, 175], correct: 80 },
    { id: 4, question: "19 rounded to the nearest 10 is..", options: [20, 10, 19], correct: 20 },
    { id: 5, question: "64 rounded off to the nearest 10 is..", options: [64, 70, 60], correct: 60 },
    { id: 6, question: "0 rounded off to the nearest 10 is..", options: [10, 1, 0], correct: 0 },
    { id: 7, question: "98 rounded off to the nearest 10 is..", options: [80, 100, 89], correct: 100 },
    { id: 8, question: "199 rounded off to the nearest 10 is..", options: [190, 100, 200], correct: 200 },
    { id: 9, question: "94 rounded off to the nearest 10 is..", options: [100, 94, 90], correct: 90 },
    { id: 10, question: "165 rounded off to the nearest 10 is..", options: [160, 170, 150], correct: 170 },
    { id: 11, question: "445 rounded off to the nearest 10 is..", options: [450, 440, 500], correct: 450 },
    { id: 12, question: "999 rounded off to the nearest 10 is..", options: [990, 1000, 909], correct: 1000 }
  ];

  const handleAnswerSelect = (questionId, answer) => {
    if (!isSubmitted) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setShowNameAlert(true);
      setTimeout(() => setShowNameAlert(false), 3000);
      return;
    }

    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setScore(null);
    setIsSubmitted(false);
    setShowNameAlert(false);
  };

  const getScoreColor = () => {
    if (score === null) return '';
    if (score >= 10) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (score === null) return '';
    if (score === 12) return 'Perfect! 🎉';
    if (score >= 10) return 'Excellent! 👏';
    if (score >= 7) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Rounding Off to Nearest 10
            </h1>
            <p className="text-gray-600 text-lg">Circle the correct answers</p>
          </div>
          
          {/* Name Input and Score Section */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                placeholder="Enter your name"
                disabled={isSubmitted}
              />
              {showNameAlert && (
                <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm animate-pulse">
                  Please enter your name before submitting!
                </div>
              )}
            </div>
            
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Score:</label>
              <div className={`text-3xl font-bold ${getScoreColor()} transition-all duration-500`}>
                {score !== null ? `${score}/12` : '___/12'}
              </div>
              {score !== null && (
                <div className="text-sm mt-1 animate-bounce">
                  {getScoreMessage()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {question.question}
              </h3>
              
              <div className="space-y-3">
                {['a', 'b', 'c'].map((letter, optionIndex) => {
                  const optionValue = question.options[optionIndex];
                  const isSelected = answers[question.id] === optionValue;
                  const isCorrect = optionValue === question.correct;
                  const showCorrect = isSubmitted && isCorrect;
                  const showIncorrect = isSubmitted && isSelected && !isCorrect;
                  
                  return (
                    <label
                      key={letter}
                      className={`
                        flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300
                        ${!isSubmitted ? 'hover:bg-blue-50' : ''}
                        ${isSelected && !isSubmitted ? 'bg-blue-100 border-2 border-blue-300' : ''}
                        ${showCorrect ? 'bg-green-100 border-2 border-green-400' : ''}
                        ${showIncorrect ? 'bg-red-100 border-2 border-red-400' : ''}
                        ${!isSelected && !showCorrect ? 'border border-gray-200' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionValue}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.id, optionValue)}
                        className="sr-only"
                        disabled={isSubmitted}
                      />
                      
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all duration-300
                        ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                        ${showCorrect ? 'border-green-500 bg-green-500' : ''}
                        ${showIncorrect ? 'border-red-500 bg-red-500' : ''}
                      `}>
                        {(isSelected || showCorrect) && (
                          <div className="w-2 h-2 bg-white rounded-full animate-scale-in"></div>
                        )}
                        {showCorrect && (
                          <span className="text-white text-xs">✓</span>
                        )}
                        {showIncorrect && (
                          <span className="text-white text-xs">✗</span>
                        )}
                      </div>
                      
                      <span className="font-medium text-gray-700">
                        {letter}. {optionValue}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Reset
          </button>
          
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Submit
            </button>
          )}
        </div>

        {/* Results Summary */}
        {isSubmitted && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Results for {name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(answers).length}</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{Math.round((score/12) * 100)}%</div>
                <div className="text-sm text-gray-600">Score Percentage</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Worksheet;