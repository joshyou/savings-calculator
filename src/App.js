import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';

/*
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;*/

/*
user input - target, principal, amount, interest rate.

prints number of years
*/

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
    this.state= {target: 100000, 
                 amount: 1000, 
                 interest: 5, 
                 principal: 0,
                 frequency: 1,
                 periods: 0};
    this.updateTarget = this.updateTarget.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.updateInterest = this.updateInterest.bind(this);
    this.updateFrequency = this.updateFrequency.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  periodsToTarget(target, principal, amount, interest, frequency) {
    let total = principal;
    let periods = 0;
    //amount = parseFloat(amount);
    //alert('frequency:' + frequency)
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
    return periods/frequency;
  }
  
  updateTarget(event) {
    this.setState({target: parseFloat(event.target.value)});
    event.preventDefault();
  }
  
  updateAmount(event) {
    this.setState({amount: parseFloat(event.target.value)});
    event.preventDefault();
  }
  
  updateInterest(event) {
   // percentInterest = 1 + 0.01*parseFloat(event.target.value)
    this.setState({interest: parseFloat(event.target.value)});
    event.preventDefault();
  }

  updateFrequency(event) {
    this.setState({frequency: parseFloat(event.target.value)});
    event.preventDefault();
  }
  
  handleSubmit(event) {
    
    //this.setState({years:0});
    this.setState({periods: 
      this.periodsToTarget(
        this.state.target, 
        this.state.principal, 
        this.state.amount, 
        this.state.interest, 
        this.state.frequency)});
    //alert('number of years' + this.state.years);
    event.preventDefault();
    //this.setState({})
  }
  
  render() {
  
  return (<div>
      <h3>Savings Calculator</h3>
      
      <form onSubmit = {this.handleSubmit}>
        <label>
          Savings target:&nbsp; 
          <input type="number" value={this.state.target} onChange={this.updateTarget}/>
        </label>
        <p> </p>
        <label>
          Contribution:&nbsp; 
          <input type="number" value={this.state.amount} onChange={this.updateAmount}/>
          <select value = {this.state.frequency} onChange={this.updateFrequency}>
            <option value = {1}>annually</option>
            <option value = {12}>monthly</option>
            <option value = {26}>bi-weekly</option>
            <option value = {52}>weekly</option>
          </select>
        </label>
        <p></p>
          <label>
          Interest rate (%):&nbsp; 
          <input type="number" value={this.state.interest} onChange={this.updateInterest}/>
        </label>
        <p></p>
        <input type="submit" value="Submit"/>
      </form>
      
      <p>Years left to savings target: {this.state.periods}
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