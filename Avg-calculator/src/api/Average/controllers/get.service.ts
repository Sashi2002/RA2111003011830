import { NextFunction, Request, Response } from 'express'
const fs = require('fs')
export const calculate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const storedState = fs.readFileSync('state.json', 'utf8')
        const windowPrevSate = JSON.parse(storedState)
        const windowSize = 10
        const numbers = [2, 4, 6, 5, 8]
        let windowCurrState = numbers

        if (windowCurrState.length > windowSize) {
            const startIndex = numbers.length - 10
            for (let i = startIndex; i < numbers.length; i++) {
                windowCurrState.push(numbers[i])
            }
        }

        let sum = 0
        windowCurrState.forEach(function (number) {
            sum += number
        })
        const avg = sum / windowCurrState.length
        res.status(200).json({
            numbers,
            windowPrevSate,
            windowCurrState,
            avg,
        })
    } catch (error) {
        console.log(error)
    }
}
