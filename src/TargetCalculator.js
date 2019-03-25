import React, { Component } from 'react';
import './App.css';
//import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
//import { withStyles } from '@material-ui/core/styles';
//import Card from '@material-ui/core/Card';
//import CardActions from '@material-ui/core/CardActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase from './firebase.js';
import FormatOutput from './FormatOutput.js';
import {periodsToTarget, payoffTime} from './calculate.js';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';

class TargetCalculator extends React.Component {
    constructor(props) {
      super(props);
      this.state = {username: 'Jim',
                  target: 100000, 
                  amount: 1000, 
                  interest: 5, 
                  principal: 0,
                  frequency: 1,
                  periods: {first:-1, second: -1, third: -1, fourth: -1},
                  outputFrequency: 1,
                  output: ''};
      this.updateState = this.updateState.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      
    }
  
    //removed - deprecated. child calculators no longer use props to determine whether to show
    /*componentWillReceiveProps(nextProps) {
      this.setState({ show: nextProps.show });  
    }*/
    
    
    updateState(param, event) {
      this.setState({[param]: parseFloat(event.target.value)});
      event.preventDefault();
    }
    
    handleSubmit(event) {
      let new_periods = periodsToTarget(
        this.state.target, 
        this.state.principal, 
        this.state.amount, 
        this.state.interest,
        this.state.frequency,
        this.state.outputFrequency);
    
      /*
      test code for setting and reading firebase values
  
      firebase.database().ref('account/Jim').set({
        balance:10010
      });
  
      firebase.database().ref('account/Jim').once('value', function(data) {
        alert("balance" + data.val().balance)
      });*/
      
      let new_output = FormatOutput(
        {outputFrequency: this.state.outputFrequency, 
        periods: new_periods.fourth,
        calculatorType: 1});
      
      this.setState({periods:new_periods, output: new_output});

      firebase.database().ref('account/' + this.state.username).set({
        balance:this.state.principal,
        target: this.state.target,
        interest: this.state.interest
      });
      event.preventDefault();  
    }
    
    //prefill values from firebase
    componentDidMount() {
      firebase.database().ref('account/'+ this.state.username).once('value', (data) => {
        this.setState({principal: data.val().balance,
                      target: data.val().target,
                      interest: data.val().interest});
      });    
    }
    render() {
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
            <input type="number" step = "0.01" value={this.state.interest} min = {0} 
            onChange={this.updateState.bind(this, "interest")}
            style={{width:'40px'}}
            />
            &nbsp;%&nbsp;&nbsp;
            <Tooltip title={"Annualized return on savings. Savings are compounded based on contribution frequency"
            +" but calculated so that savings grow at the inputted rate."}>
              <InfoOutlinedIcon className="vertical-align-middle"/>
            </Tooltip>
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
        <p class="output">{this.state.output}</p>
        <TabularResults periods = {this.state.periods}/>
      </div>);
    }  
  }

  
  //returns savings target results as a table
  function TabularResults(props) {
    //hide table unless periods have been calculated
    if (props.periods.first < 0) {
      return null;
    }
    return(
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        Detailed results</ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <Table>
              <colgroup>
              <col/>
              <col/>
              <col/>
              <col/>
              <col/>
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell style={{maxWidth:"50px"}}>Percentage of target</TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell>50%</TableCell>
                  <TableCell>75%</TableCell>
                  <TableCell>100%</TableCell>
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

export default TargetCalculator;