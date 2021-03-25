import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import LoanCalculator from './LoanCalculator.js'
import TargetCalculator from './TargetCalculator.js'

/* 
Two calculator options: time until savings target, time until loan is paid off
*/

const Calculator = () => {
    const [calculatorType, setCalculatorType] = useState('Target');

    return (
        <Card style={{
        width: '55%',
        maxWidth: calculatorType === 'Target' ? 570 : 500,
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#eff0f4',
        overflowX: 'auto'
      }}>
        <CardActions>
        <div>
          <h3>Savings Calculator</h3>
          <FormControl>
          <InputLabel>Calculator Type</InputLabel>
            <Select native 
            value = {calculatorType} 
            onChange={(e) => setCalculatorType(e.target.value)}
            inputProps={{
              name: 'Calculator Type',
              id: 'calculator-type',
            }}>
              <option value = {'Target'}>Time until savings target</option>
              <option value = {'Loan'}>Loan payment calculator</option>
            </Select>
          </FormControl>
          <p></p>
          {calculatorType === 'Target' ?
            <TargetCalculator /> :
            <LoanCalculator />
          }
        </div>
        </CardActions>
      </Card>
    )
}

export default Calculator;