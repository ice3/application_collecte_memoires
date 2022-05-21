import React, { useState, useEffect } from 'react';

import {Button, ButtonNegative, ButtonPositive} from "../elements/button"
import Question from './question';

import { fetchQuestions } from '../../network_operations';

function RecordMemories({ shouldUseVideo, handleNextGlobalStep, memoryUUID }) {
    const [currentQuestionId, setQuestionStep] = useState(0)
    const [questionsOver, setQuestionsOver] = useState(false)
    const [questions, setQuestions] = useState([])


    useEffect(() => {
        fetchQuestions(setQuestions)
    }, []);

    const nextQuestion = () => {
        if (currentQuestionId < questionsNb - 1) {
            setQuestionStep(currentQuestionId + 1)
        }
        // currentQUestionId is not modified, we need to do strange stuff
        if (currentQuestionId == (questionsNb - 2)) {
            setQuestionsOver(true)
        }
    }

    console.log(questions, questions.length === 0)
    if (questions.length === 0){
        return ""
    }
    
    const questionsNb = questions.length
    const currentQuestion = questions[currentQuestionId]

    return (
        <div className="container">
            <h1 className="texte-left full-width">
                Question {currentQuestionId + 1} / {questionsNb}
            </h1>

            <Question
                question={currentQuestion}
                shouldUseVideo={shouldUseVideo}
                step={currentQuestionId + 1}
                numberOfQuestions={questionsNb}
                handleNextQuestion={nextQuestion}
                key={currentQuestionId}
                memoryUUID={memoryUUID}
                questionsOver={questionsOver}
                handleNextGlobalStep={handleNextGlobalStep}
            />
        </div>
    )
}

export default RecordMemories