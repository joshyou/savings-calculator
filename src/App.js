import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';

/*npm start to run*/

/* customization frequency: dropdown after contribution box:
per year, per month, per week?

interest rate is ambiguous. assume it's an annualized interest rate compounded based on period length?
interest should get converted to period interest - e.g. if period is monthly then interest divided by 12
this should happen before periodsToTarget is called

compounding options - right now it's compounded based on contribution frequency.
this is arbitrary and not realistic.
options - allow user to specify how often to compound
-always compound once per year, because interest rates are usually expressed
as annualized
-compound daily or continuously, but calculate the interest rate to be equivalent 
to compounding once per year at the inputted interest rate
this is NOT equivalent to just dividing the interest rate by 365 and compounding daily
as doing that leads to faster growth than compounding once per year
*/


class SavingsCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {target: 100000, 
                 amount: 1000, 
                 interest: 5, 
                 principal: 1000,
                 frequency: 1,
                 periods: 0,
                 outputFrequency: 1,
                 show: props.show};
    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //update this.state.show when parent state changes
  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.show });  
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
    return periods
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
    if (this.state.show != 1) {
      return null;
    }
    return (<div>
      <form onSubmit = {this.handleSubmit}>
        <label>
          Savings target:&nbsp; 
          <input type="number" value={this.state.target} min = {0} onChange={this.updateState.bind(this, "target")}/>
        </label>
        <p> </p>
        <label>
          Principal:&nbsp; 
          <input type="number" value={this.state.principal} onChange={this.updateState.bind(this, "principal")}/>
          </label>
        <p></p>
        <label>
          Contribution:&nbsp; 
          <input type="number" value={this.state.amount} min = {this.state.principal > 0 ? 0 : 1} onChange={this.updateState.bind(this, "amount")}/>
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
          <input type="number" value={this.state.interest} min = {0} onChange={this.updateState.bind(this, "interest")}/>
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

//design: loan balance
//APY
//compound period (default monthly)
//(minimum) payment
//output - time until loan paid off. also interest paid?
class LoanCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //balance: 1000
      show: props.show};
    this.updateState = this.updateState.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  //update this.state.show when parent state changes
  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.show });  
  }

  updateState(param, event) {
    this.setState({[param]: parseFloat(event.target.value)});
    event.preventDefault();
  }

  render() {
    if (this.state.show != 2) {
      return null;
    }
    return(
      <div>
        <p>LOAN CALC</p>
      </div>
    );
  }
}
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
    return (
      <div>
        <h3>Savings Calculator</h3>
        <label>
          Calculator Type:&nbsp;
          <select value = {this.state.calculatorType} onChange={this.updateState.bind(this,"calculatorType")}>
            <option value = {1}>Time until savings target</option>
            <option value = {2}>Loan payment calculator</option>
          </select>
        </label>
        <p></p>
        <SavingsCalculator show={this.state.calculatorType}/>
        <LoanCalculator show={this.state.calculatorType}/>
        
      </div>);
  }
}

ReactDOM.render(
  <Calculator />,
  //formatName(user),
  document.getElementById('root')
);

export default Calculator;