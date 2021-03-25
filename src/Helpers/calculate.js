//compute periods until savings target is reached. periods is years, months, 2-weeks, or weeks, based
//on selected contribution frequency. 
function periodsToTarget(target, principal, amount, interest, frequency, outputFrequency) {
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
      return "forever";
    }
    while (total < target) {
      total += amount;
      total *= interest;
      periods += 1;

      //determine whether running total has exceeded each quartile
      if ((total > quartiles[0]) && (results.first === -1)) {
        //round number of periods to first decimal place, and multiple by ratio between 
        //number of output periods per year and number of contribution periods per year
        results.first = Math.round(periods*(outputFrequency/frequency)*10) / 10;
      }
      if ((total > quartiles[1]) && (results.second === -1)) {
        results.second = Math.round(periods*(outputFrequency/frequency)*10) / 10;
      }
      if ((total > quartiles[2]) && (results.third === -1)) {
        results.third = Math.round(periods*(outputFrequency/frequency)*10) / 10;
      }
      if (periods > 100000) {
        return "forever";
      }
 
    }
    results.fourth = Math.round(periods*(outputFrequency/frequency)*10) / 10;
    return results
}

//calculate time required to pay off a loan balance
function payoffTime(balance, interest, payment, minpayment, snowball, outputFrequency) {
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

export {periodsToTarget, payoffTime};