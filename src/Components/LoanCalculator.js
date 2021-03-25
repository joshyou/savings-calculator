import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import formatOutput from '../Helpers/formatOutput.js';
import {periodsToTarget, payoffTime} from '../Helpers/calculate.js';
import Tooltip from '@material-ui/core/Tooltip';

//inputs: loan balance, APR, compound period (default monthly), (minimum) payment
//output - time until loan paid off. also interest paid?
class LoanCalculator extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        balance: 10000,
        interest: 10,
        payment: 250,
        minpayment: 25,
        snowball: true,
        outputFrequency: 12,
        periods: -1,
        output: ''};
  
      this.updateState = this.updateState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    updateState(param, event) {
      this.setState({[param]: parseFloat(event.target.value)});
      event.preventDefault();
    }
    //same as UpdateState, but don't parse float
    updateCheck(event) {
      this.setState({snowball: !this.state.snowball});
      event.preventDefault();
    }
  
    handleSubmit(event) {
      let new_periods = payoffTime(
        this.state.balance, 
        this.state.interest,
        this.state.payment,
        this.state.minpayment,
        this.state.snowball,
        this.state.outputFrequency);

      let new_output = formatOutput(
        this.state.outputFrequency, 
        new_periods, 
        'Loan')

      this.setState({periods:new_periods, output: new_output});
      event.preventDefault();
    }
  
    render() {
      return(
        <div>
          <p></p>
          <form onSubmit = {this.handleSubmit}>
            <label>
              Balance: $&nbsp; 
              <input type="number" value={this.state.balance} 
              min = {0} 
              onChange={this.updateState.bind(this, "balance")}
              style={{width:'80px'}}/>
            </label>
            <p></p>
            <label>
              Monthly payment: $&nbsp; 
              <input type="number" value={this.state.payment} 
              min = {0} 
              onChange={this.updateState.bind(this, "payment")}
              style={{width:'60px'}}/>
            </label>
            <p></p>
            <label>
              Minimum payment: $&nbsp; 
              <input type="number" value={this.state.minpayment} 
              min = {0} 
              onChange={this.updateState.bind(this, "minpayment")}
              style={{width:'60px'}}/>
            </label>
            <Tooltip title="Apply interest savings from excess payments as extra payments">
            <label>
              &nbsp;Snowball&nbsp; 
              <input type="checkbox" checked={this.state.snowball} 
              onChange={this.updateCheck.bind(this)}
              />
            </label>
            </Tooltip>
            <p></p>
            <label>
              APR:&nbsp; 
              <input type="number" step = "0.01" value={this.state.interest} 
              min = {0}
              onChange={this.updateState.bind(this, "interest")}
              style={{width:'37px'}}/>
            </label>
            &nbsp;%
            <p></p>
            
            <FormControl>
              <InputLabel>Time period</InputLabel>
              <Select 
                native
                value = {this.state.outputFrequency} 
                onChange={this.updateState.bind(this, "outputFrequency")}
                >
                <option value = {1}>years</option>
                <option value = {12}>months</option>
              </Select>
            </FormControl>
            <p></p>
            <Button type="submit" variant="contained" color="primary">Calculate</Button><p></p>
          </form>
          <p class="output">{this.state.output}</p>
        </div>
      );
    }
}

export default LoanCalculator;