import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';

/*npm start to run*/

/* 

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
  
  //compute periods until savings target is reached. periods is years, months, 2-weeks, or weeks, based
  //on selected contribution frequency. 
  periodsToTarget(target, principal, amount, interest, frequency) {
    let total = principal;
    let periods = 0;
    
    //adjust interest rate based on frequency by taking it to the power of 1/frequency
    //this ensures that savings grow at a rate equivalent to the inputted interest rate compounded annually
    //e.g. if annual interest is 1.05, then monthly interest has to be 1.05^(1/12) so that compounding once per month
    //leads to the same growth as compounding once per year at 1.05
    interest = Math.pow(1 + 0.01*interest, 1/frequency);
    
    if (amount < 0) {
      return "not gonna happen bud!";
    }
    while (total < target) {
      total += amount;
      total *= interest;
      periods += 1;
      if (periods > 100000) {
        return "not gonna happen bud!";
      }
 
    }
    return periods
  }
  
  updateState(param, event) {
    this.setState({[param]: parseFloat(event.target.value)});
    event.preventDefault();
  }

  //formats output to user, with time units specified by user
  formatOutput(outputFrequency, frequency, periods) {
    let output = '';
    if (outputFrequency == 1) {
      output += 'Years'
    } else if (outputFrequency == 12) {
      output += 'Months'
    }
    output += ' left until savings target: '

    //round number of periods to first decimal place, and multiple by ratio between 
    //number of output periods per year vs number of contribution periods per year
    if (isNaN(periods)) {
      output += periods;
    } else {
      output += Math.round(periods*(outputFrequency/frequency)*10) / 10;
    }
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

//inputs: loan balance, APR, compound period (default monthly), (minimum) payment
//output - time until loan paid off. also interest paid?
class LoanCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 1000,
      interest: 10,
      payment: 0,
      outputFrequency: 12,
      periods: 0,
      show: props.show};

    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //update this.state.show when parent state changes
  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.show });  
  }

  updateState(param, event) {
    this.setState({[param]: parseFloat(event.target.value)});
    event.preventDefault();
  }

  //it looks like credit card interest is usually reported as APR not APY. APR is just monthly interest * 12 (if it's monthly)
  //APY takes into effect compounding. So just divide APR by 12 to get the monthly interest rate.
  payoffTime(balance, interest, payment) {
    //let total = balance;
    let periods = 0;
    interest = 1 + 0.01*(interest/12); //assume monthly payment and APR interest for now
    if (payment <= 0) {
      return "not gonna happen bud";
    }
    while (balance > 0) {
      balance -= payment;
      balance *= interest;
      if (periods > 10000) {
        return "not gonna happen bud";
      }
      periods += 1;
    }
    //alert(periods);
    return periods;
  }

  formatOutput(outputFrequency, periods) {
    let output = '';
    if (outputFrequency == 1) {
      output += 'Years'
    } else if (outputFrequency == 12) {
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
  }

  handleSubmit(event) {
    
    this.setState({periods: 
      this.payoffTime(
        this.state.balance, 
        this.state.interest,
        this.state.payment)});
    event.preventDefault();
  }

  render() {
    if (this.state.show != 2) {
      return null;
    }
    return(
      <div>
        <p></p>
        <form onSubmit = {this.handleSubmit}>
          <label>
            Balance:&nbsp; 
            <input type="number" value={this.state.balance} min = {0} onChange={this.updateState.bind(this, "balance")}/>
          </label>
          <p></p>
          <label>
            APR (%):&nbsp; 
            <input type="number" step = "0.01" value={this.state.interest} min = {0} onChange={this.updateState.bind(this, "interest")}/>
          </label>
          <p></p>
          <label>
            Monthly payment:&nbsp; 
            <input type="number" value={this.state.payment} min = {0} onChange={this.updateState.bind(this, "payment")}/>
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
        <p>{this.formatOutput(this.state.outputFrequency, this.state.periods)}</p>
      </div>
    );
  }
}

//wrapper class that calls the two calculator types
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