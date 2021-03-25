//formats output for user with time units specified by user
function formatOutput(periodType, periodCount, calculatorType) {
    let output = '';
    if (periodCount < 0) {
        return output;
    }
    if (periodType === 1) {
        output += 'Years'
    } else if (periodType === 12) {
        output += 'Months'
    }

    if (calculatorType === 'Target') {
        output += ' left until savings target: ';
    } else {
        output += ' left until debt payoff: ';
    }
        
    output += periodCount;

    return output;
    
}  

export default formatOutput;