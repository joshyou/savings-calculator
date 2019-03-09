//generates output for user, with time units specified by user
function FormatOutput(props) {
    let output = '';
    if (props.periods < 0) {
        return output;
    }
    if (props.outputFrequency === 1) {
        output += 'Years'
    } else if (props.outputFrequency === 12) {
        output += 'Months'
    }

    if (props.calculatorType === 1) {
        output += ' left until savings target: ';
    } else {
        output += ' left until debt payoff: ';
    }
        
    if (isNaN(props.periods)) {
        output += props.periods;
    } else {
        output += props.periods;//Math.round(periods*(outputFrequency/frequency)*10) / 10;
    }
    return output;
    
}  

export default FormatOutput;