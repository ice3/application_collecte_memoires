import React, { useState } from 'react';

import NextStepButton from "../elements/nextStepButton"
import Question from './question';

const questions = [
    { secondsDuration: 10, value: "Nous souhaitons mieux vous connaître, pourriez-vous vous présenter rapidement ? Et nous dire de qui vous allez parler ?" },
    { secondsDuration: 10, value: " Choisissez un moment marquant de votre migration : votre départ, votre voyage ou votre arrivée. Décrivez-le-nous ?" },
    { secondsDuration: 10, value: "Si vous deviez citer un seul objet, symbole ou souvenir qui serait caractéristique de votre témoignage, ce serait lequel ? et pourquoi ?" },
]

function RecordMemories({ shouldUseVideo, handleNextGlobalStep }) {
    const questionsNb = questions.length
    const [currentQuestionId, setQuestionStep] = useState(0)
    const [questionsOver, setQuestionsOver] = useState(false)
    const nextQuestion = () => {
        if (currentQuestionId < questionsNb - 1) {
            setQuestionStep(currentQuestionId + 1)
        }
        // currentQUestionId is not modified, we need to do strange stuff
        if (currentQuestionId == (questionsNb - 2)) {
            setQuestionsOver(true)
        }
    }
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