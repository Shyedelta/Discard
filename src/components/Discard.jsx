import React, { useState, useRef, useEffect } from 'react';

const Discard = () => {
    const [secretCode, setSecretCode] = useState(generateCode());
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [history, setHistory] = useState([]);
    const [result, setResult] = useState('');
    const inputRef = useRef(null);
    const [gameOver, setGameOver] = useState(false);

    function generateCode() {
        let digits = [];
        while (digits.length < 4) {
            let digit = Math.floor(Math.random() * 10);
            if (!digits.includes(digit)) {
                digits.push(digit);
            }
        }
        return digits.join('');
    }
    function checkGuess() {

        if (history.some(item => item.guess === guess)) {
            setResult("Ya has intentado ese código.");
            return;
        }

        if (guess.length !== 4 || new Set(guess).size !== 4) {
            setResult("Por favor, ingresa un número de 4 dígitos únicos.");
            return;
        }

        let fixed = 0;
        let mobile = 0;

        for (let i = 0; i < 4; i++) {
            if (guess[i] === secretCode[i]) {
                fixed++;
            } else if (secretCode.includes(guess[i])) {
                mobile++;
            }
        }

        setAttempts(attempts + 1);

        if (fixed === 4) {
            setResult(`¡Felicidades! Adivinaste el código ${secretCode} en ${attempts + 1} intentos.`);
            setGameOver(true);
            setGuess('');
        } else {
            setResult(`${fixed} fijos y ${mobile} móviles.`);
            setHistory([{ guess, fixed, mobile }, ...history]);
            setGuess('');
        }

    }
    function handleKeyDown(event) {
        if (event.key === 'Enter' && !gameOver) {
            checkGuess();
        }
    }
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [guess, history, result]);
    return (
        <div className="flex justify-center items-center min-h-screen  text-center">
            <div className="flex justify-center items-center flex-wrap p-5 w-full gap-10">
                <div className="bg-white flex justify-center items-center flex-col p-8 rounded-lg shadow-md w-full min-h-[16em] max-w-[31em]">
                    <h1 className="text-2xl font-bold mb-4 tracking-wider ">Adivina el Código</h1>
                    <p className="text-sm mb-4 text-gray-400">El código es un número de 4 dígitos únicos del 0 al 9.</p>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            value={guess}
                            onKeyDown={handleKeyDown}
                            maxLength="4"
                            ref={inputRef}
                            className="border rounded-lg p-2 w-24 text-center text-lg"
                            disabled={gameOver}
                            placeholder={gameOver ? secretCode : "C O D E"}
                            pattern="\d*"  
                            inputMode="numeric"
                            onChange={(e) => {
                                const newValue = e.target.value.replace(/\D/g, ''); 
                                setGuess(newValue);
                              }}
                        />
                        <button
                            onClick={checkGuess}
                            className="ml-4 text-white py-2 px-4 rounded-lg ui-btn "
                            disabled={gameOver}
                        >
                            <span>Intentar</span>
                        </button>
                    </div>
                    <div className="mt-4 text-lg">
                        {result}
                    </div>
                </div>
                {attempts > 0 && <>
                    <div className="bg-gray-200 min-h-[16em] w-full max-w-[31em] p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold tracking-wider">Historial de Intentos</h2>

                        <div className="mt-4 max-h-[12em] overflow-y-scroll p-2 rounded-lg shadow-inner bg-gray-50  ">
                            {history.map((item, index) => (
                                <p key={index} className="text-xl first:font-bold mb-2 odd:bg-gray-100 ">
                                    <span className="tracking-widest">{item.guess}</span>
                                    <span className="font-normal">
                                        {" "} - <span className="text-green-400 font-bold">{item.fixed}</span> Fijos,{" "}
                                        <span className="text-orange-400 font-bold">{item.mobile}</span> Móviles
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>
                </>}
            </div>
        </div>
    );
}

export default Discard;
