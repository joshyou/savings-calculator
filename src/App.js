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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase from './config.js';

/* 
two calculator options - time until savings target, time until loan is paid off
Calculator wrapper class calls classes for both calculator types

to-do: snowball payment parameter. have to ask user for minimum payment, then
calculate "snowballing" of extra payments' effect on interest if interest savings are reinvested in the loan

Material-UI stuff:
added button
replace dropdowns with Material-style dropdowns
add table option to output

conditionally hide table before calculation (separate class would work)
*/


class SavingsCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {target: 100000, 
                 amount: 1000, 
                 interest: 5, 
                 principal: 1000,
                 frequency: 1,
                 periods: {first:-1, second: -1, third: -1, fourth: -1},
                 outputFrequency: 1,
                 output: '',
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
  periodsToTarget(target, principal, amount, interest, frequency, outputFrequency) {
    //alert("frequency" + frequency);

    let total = principal;
    let periods = 0;
    //intermediate targets for 25% of target, 50%, etc.
    let quartiles = [0.25*target, 0.5*target, 0.75*target, target]
    let results = {first:-1, second:-1, third:-1, fourth:-1}
    
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

      //determine whether running total has exceeded each quartile
      if ((total > quartiles[0]) && (results.first == -1)) {
        results.first = Math.round(periods*(outputFrequency/frequency)*10) / 10;
      }
      if ((total > quartiles[1]) && (results.second == -1)) {
        results.second = Math.round(periods*(outputFrequency/frequency)*10) / 10;
      }
      if ((total > quartiles[2]) && (results.third == -1)) {
        results.third = Math.round(periods*(outputFrequency/frequency)*10) / 10;
      }
      if (periods > 100000) {
        return "not gonna happen bud!";
      }
 
    }
    results.fourth = Math.round(periods*(outputFrequency/frequency)*10) / 10;
    return results
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
      output += periods;//Math.round(periods*(outputFrequency/frequency)*10) / 10;
    }
    return output;
  }
  
  handleSubmit(event) {
    

    let new_periods = this.periodsToTarget(
      this.state.target, 
      this.state.principal, 
      this.state.amount, 
      this.state.interest,
      this.state.frequency,
      this.state.outputFrequency);
    
    let new_output = this.formatOutput(
      this.state.outputFrequency, 
      this.state.frequency, 
      new_periods.fourth
    );

    firebase.database().ref('account/Jim').set({
      balance:2001
    });

    /*
    var playersRef = firebase.database().ref("account/");

    playersRef.set ({
      Jim: {
          balance:2001
      },
      
      Kim: {
          balance:1001
      }
    });
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: 'salad',
      user: 'jim'
    }*/
    //playersRef.push(item);
    
    this.setState({periods:new_periods, output: new_output});

    event.preventDefault();
    
    
  }
  
  render() {
    if (this.state.show != 1) {
      return null;
    }
    return (
    <div>
      <form onSubmit = {this.handleSubmit}>
        <label>
          Savings target: $&nbsp;
          <input type="number" value={this.state.target} min = {0} onChange={this.updateState.bind(this, "target")}
          style={{width:'100px'}}/>
        </label>
        <p></p>
        <label>
          Principal: $&nbsp;
          <input type="number" value={this.state.principal} onChange={this.updateState.bind(this, "principal")}
          style={{width:'80px'}}/>
          </label>
        <p></p>
        
        <label>
          Contribution: $&nbsp;
          <input type="number" value={this.state.amount} 
          min = {this.state.principal > 0 ? 0 : 1} 
          onChange={this.updateState.bind(this, "amount")}
          style={{width:'70px'}}/>
          &nbsp;
          <Select 
            native
            value = {this.state.frequency} 
            onChange={this.updateState.bind(this, "frequency")}
            >
            <option value = {1}>annually</option>
            <option value = {12}>monthly</option>
            <option value = {26}>biweekly</option>
            <option value = {52}>weekly</option>
          </Select>
          
        </label>
        <p></p>
          <label>
          Interest rate:&nbsp; 
          <input type="number" value={this.state.interest} min = {0} 
          onChange={this.updateState.bind(this, "interest")}
          style={{width:'30px'}}
          />
          &nbsp;%
          </label>
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
      
      <p class="output">{this.state.output} </p>
      <TabularResults periods = {this.state.periods}
      output = {this.state.output}/>
    </div>);
  }  
}

//returns savings target results as a table
function TabularResults(props) {
  //hide table unless output has been generated
  if (props.output == '') {
    return null;
  }
  return(
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      Detailed results</ExpansionPanelSummary>
      <ExpansionPanelDetails>
          <Table style={{tableLayout:'auto'}}>
            <colgroup>
            <col style={{width:'60%'}}/>
            <col style={{width:'10%'}}/>
            <col style={{width:'10%'}}/>
            <col style={{width:'10%'}}/>
            <col style={{width:'10%'}}/>
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>Percentage of target</TableCell>
                <TableCell>25%</TableCell>
                <TableCell align="right">50%</TableCell>
                <TableCell align="right">75%</TableCell>
                <TableCell align="right">100%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell>Time left</TableCell>
              <TableCell>{props.periods.first}</TableCell>
              <TableCell>{props.periods.second}</TableCell>
              <TableCell>{props.periods.third}</TableCell>
              <TableCell>{props.periods.fourth}</TableCell>
            </TableBody>
          </Table>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

//inputs: loan balance, APR, compound period (default monthly), (minimum) payment
//output - time until loan paid off. also interest paid?
class LoanCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 10000,
      interest: 10,
      payment: 25,
      outputFrequency: 12,
      periods: 0,
      output: '',
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
      return "forever";
    }
    while (balance > 0) {
      balance -= payment;
      balance *= interest;
      if (periods > 10000) {
        return "forever";
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
    let new_periods = this.payoffTime(
      this.state.balance, 
      this.state.interest,
      this.state.payment);
    let new_output = this.formatOutput(
      this.state.outputFrequency, 
      new_periods
    );
    this.setState({periods:new_periods, output: new_output});
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

//wrapper class that calls the two calculator types
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
      <Card style={{
        width: '50%',
        maxWidth: 600,
        margin: 'auto',
        padding: '25px',
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
          <SavingsCalculator show={this.state.calculatorType}/>
          <LoanCalculator show={this.state.calculatorType}/>
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