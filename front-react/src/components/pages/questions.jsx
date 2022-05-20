import React, { useState, useEffect } from 'react';

import NextStepButton from "../elements/nextStepButton"
import Question from './question';

import { fetchQuestions } from '../../network_operations';

function RecordMemories({ shouldUseVideo, handleNextGlobalStep, memoryUUID }) {
    const [currentQuestionId, setQuestionStep] = useState(0)
    const [questionsOver, setQuestionsOver] = useState(false)
    const [questions, setQuestions] = useState([])


    useEffect(() => {
        console.log("use effect")
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
        <>
            <h1>
                Les questions
            </h1>

            <Question
                question={currentQuestion}
                shouldUseVideo={shouldUseVideo}
                step={currentQuestionId + 1}
                numberOfQuestions={questionsNb}
                handleNextQuestion={nextQuestion}
                key={currentQuestionId}
                memoryUUID={memoryUUID}
            />

            {
                questionsOver ?
                    <div>
                        <NextStepButton handleNext={handleNextGlobalStep} label="Etape suivante" />
                    </div>
                    : ""
            }
        </>
    )
}

export default RecordMemories