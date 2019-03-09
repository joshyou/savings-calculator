import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import firebase from './firebase.js';
import FormatOutput from './FormatOutput.js';

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
  
    //it looks like credit card interest is usually reported as APR not APY. APR is just monthly interest * 12 (if it's monthly)
    //APY takes into effect compounding. So just divide APR by 12 to get the monthly interest rate.
    payoffTime(balance, interest, payment, minpayment, snowball, outputFrequency) {
      //alert(snowball);
      let periods = 0;
      interest = 1 + 0.01*(interest/12); //assume monthly payment and APR interest for now
      if (payment <= 0) {
        return "forever";
      }
      //track cumulative payments in excess of minimum payments
      let excess = 0;
      while (balance > 0) {
        excess += (payment - minpayment);
        balance -= payment;
        if (snowball) {
          //subtract interest savings from excess payments
          balance -= ((interest - 1) * excess);
        }
        
        balance *= interest;
        if (periods > 10000) {
          return "forever";
        }
        periods += 1;
      }
      //alert(periods);
      return Math.round(periods*(outputFrequency/12)*10) / 10;
    }
  
    /*formatOutput(outputFrequency, periods) {
      let output = '';
      if (outputFrequency === 1) {
        output += 'Years'
      } else if (outputFrequency === 12) {
        output += 'Months'
      }
      output += ' left until debt payoff: '
  
      //round number of periods to first decimal place, and multiple by ratio between 
      //number of output periods per year vs number of contribution periods per year
      if (isNaN(periods)) {
        output += periods;
      } else {
        output += Math.round(periods*(outputFrequency/12)*10) / 10;
      }
      return output;
    }*/
  
    handleSubmit(event) {
      let new_periods = this.payoffTime(
        this.state.balance, 
        this.state.interest,
        this.state.payment,
        this.state.minpayment,
        this.state.snowball,
        this.state.outputFrequency);

      let new_output = FormatOutput({outputFrequency: this.state.outputFrequency, periods: new_periods})

      /*let new_output = this.formatOutput(
        this.state.outputFrequency, 
        new_periods
      );*/
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
            <label>
              &nbsp;Snowball&nbsp; 
              <input type="checkbox" checked={this.state.snowball} 
              onChange={this.updateCheck.bind(this)}
              />
            </label>
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