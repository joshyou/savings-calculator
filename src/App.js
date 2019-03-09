import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import firebase from './firebase.js';
import LoanCalculator from './LoanCalculator.js'
import TargetCalculator from './TargetCalculator.js'

/* 
two calculator options - time until savings target, time until loan is paid off
Calculator wrapper class calls classes for both calculator types */

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {calculatorType: 2};
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
        maxWidth: this.state.calculatorType === 1 ? 650:500,
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
      </Card>);
  }
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);

/*const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});*/

//export default withStyles(styles)(Calculator);

export default Calculator;