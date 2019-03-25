import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
//import firebase from './firebase.js';
import LoanCalculator from './LoanCalculator.js'
import TargetCalculator from './TargetCalculator.js'

/* 
to do:

username input (separate section - menu?). allow adding usernames to store info
dialog to explain compound interest calculation
add tests
loading animation

two calculator options - time until savings target, time until loan is paid off
Calculator wrapper class calls classes for both calculator types */

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {calculatorType: 1};
    this.updateState = this.updateState.bind(this);
  }

  updateState(param, event) {
    this.setState({[param]: parseFloat(event.target.value)});
    event.preventDefault();
  }

  render() {
    let calculator;
    //determine which calculator is shown
    if (this.state.calculatorType === 1) {
      calculator = <TargetCalculator />
    } else {
      calculator = <LoanCalculator />
    }

    return (
      <Card style={{
        width: '55%',
        maxWidth: this.state.calculatorType === 1 ? 570:500,
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
            value = {this.state.calculatorType} 
            onChange={this.updateState.bind(this,"calculatorType")}
            inputProps={{
              name: 'Calculator Type',
              id: 'calculator-type',
            }}>
              <option value = {1}>Time until savings target</option>
              <option value = {2}>Loan payment calculator</option>
            </Select>
          </FormControl>
          <p></p>
          {calculator}
        </div>
        </CardActions>
      </Card>
    );
  }
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);

export default Calculator;