import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';

/*npm start to run*/

/* customization frequency: dropdown after contribution box:
per year, per month, per week?

interest rate is ambiguous. assume it's an annualized interest rate compounded based on period length?
interest should get converted to period interest - e.g. if period is monthly then interest divided by 12
this should happen before periodsToTarget is called
*/

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {target: 100000, 
                 amount: 1000, 
                 interest: 5, 
                 principal: 0,
                 frequency: 1,
                 periods: 0,
                 outputFrequency: 1};
    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  periodsToTarget(target, principal, amount, interest, frequency) {
    let total = principal;
    let periods = 0;
    
    //for now, compounds at frequency equal to contribution frequency
    let percentInterest = 1 + 0.01*(interest/frequency);
    if (amount < 0) {
      return "not gonna happen bud!";
    }
    while (total < target) {
      total += amount;
      total *= percentInterest;
      periods += 1;
      if (periods > 10000) {
        return "not gonna happen bud!";
      }
 
    }
    //alert('final years:' + years)
    return periods

    //return Math.round( (periods/frequency) * 10 ) / 10;
  }
  
  updateState(param, event) {
    this.setState({[param]: parseFloat(event.target.value)});
    event.preventDefault();
  }

  //for now, updates whenever the dropdown is changed. could make it a state variable instead
  //of calculating directly in render()
  formatOutput(outputFrequency, frequency, periods) {
    let output = '';
    if (outputFrequency == 1) {
      output += 'Years'
    } else if (outputFrequency == 12) {
      output += 'Months'
    }
    output += ' left until savings target: '
    //return Math.round( (periods/frequency) * 10 ) / 10;
    output += Math.round((periods/frequency)*outputFrequency*10) / 10;
    return output;
  }
  
  handleSubmit(event) {
    
    this.setState({periods: 
      this.periodsToTarget(
        this.state.target, 
        this.state.principal, 
        this.state.amount, 
        this.state.interest,
        this.state.frequency)});
    event.preventDefault();

  }
  
  render() {
  return (<div>
      <h3>Savings Calculator</h3>
      
      <form onSubmit = {this.handleSubmit}>
        <label>
          Savings target:&nbsp; 
          <input type="number" value={this.state.target} onChange={this.updateState.bind(this, "target")}/>
        </label>
        <p> </p>
        <label>
          Contribution:&nbsp; 
          <input type="number" value={this.state.amount} onChange={this.updateState.bind(this, "amount")}/>
          <select value = {this.state.frequency} onChange={this.updateState.bind(this, "frequency")}>
            <option value = {1}>annually</option>
            <option value = {12}>monthly</option>
            <option value = {26}>biweekly</option>
            <option value = {52}>weekly</option>
          </select>
        </label>
        <p></p>
          <label>
          Interest rate (%):&nbsp; 
          <input type="number" value={this.state.interest} onChange={this.updateState.bind(this, "interest")}/>
          </label>
        <p></p>
          <label>
          Time period:&nbsp; 
          <select value = {this.state.outputFrequency} onChange={this.updateState.bind(this, "outputFrequency")}>
            <option value = {1}>years</option>
            <option value = {12}>months</option>
          </select>
          </label>
        <p></p>
        <input type="submit" value="Submit"/>
      </form>
      
      <p>{this.formatOutput(this.state.outputFrequency, this.state.frequency, this.state.periods)}
      </p>
      </div>);
  }  
}

ReactDOM.render(
  <Calculator />,
  //formatName(user),
  document.getElementById('root')
);

export default Calculator;