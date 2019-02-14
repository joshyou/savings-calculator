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

class Years extends React.Component {
  constructor(props) {
    super(props);
    this.state= {target: 100000, 
                 amount: 1000, 
                 interest: 5, 
                 principal: 0,
                 years: 0};
    this.updateTarget = this.updateTarget.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.updateInterest = this.updateInterest.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  yearsToTarget(target, principal, amount, interest) {
    let total = principal;
    let years = 0;
    //amount = parseFloat(amount);
    let percentInterest = 1 + 0.01*interest;
    if (amount < 0) {
      return "not gonna happen bud";
    }
    while (total < target) {
      total += amount;
      total *= percentInterest;
      years += 1;
      if (years > 10000) {
        return "not gonna happen bud";
      }
 
    }
    //alert('final years:' + years)
    return years;
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
  
  handleSubmit(event) {
    
    //this.setState({years:0});
    this.setState({years: this.yearsToTarget(this.state.target, this.state.principal, this.state.amount, this.state.interest)});
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
          Annual contribution:&nbsp; 
          <input type="number" value={this.state.amount} onChange={this.updateAmount}/>
        </label>
        <p></p>
          <label>
          Interest rate (%):&nbsp; 
          <input type="number" value={this.state.interest} onChange={this.updateInterest}/>
        </label>
        <p></p>
        <input type="submit" value="Submit"/>
      </form>
      
      <p>Years left to savings target: {this.state.years}
      </p>
      </div>);
  }  
}

ReactDOM.render(
  <Years />,
  //formatName(user),
  document.getElementById('root')
);

export default Years;