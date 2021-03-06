import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

function round(value) {
  return Number(Math.round(value+'e'+2)+'e-'+2);
}

function MonthlyPaymentOwn(props) {
  return <p>Monthly payment owning is: {
    round(calculateMonthlyOwnPayment(props))
  }</p>;
}

function MonthlyPaymentRent(props) {
  return <p>Monthly payment for rent is: {calculateMonthlyRentPayment(props)}</p>;
}

function CalculateOwningAdvantageAtYear(props) {
  return(
  <div>
    <h2>The Rent vs. Own Smackdown</h2>
    <div>
      <h3>Owning</h3>
        <ul><p>First Year Monthly Payment: {round(calculateMonthlyOwnPayment(props))}</p></ul>
        <ul><p>Last Year Monthly Payment: {round(owningPaymentAtYear(props))}</p></ul>
        <ul><h4>Money Spent</h4></ul>
        <ul><p>Total of taxes: {round(totalOfTaxesAtYear(props))}</p></ul>
        <ul><p>Total of interest: {round(totalOfInterestAtYear(props))}</p></ul>
        <ul><p>Total of principal payments: {round(principalAccumulatedAtLengthOfResidence(props))}</p></ul>
        <ul><p>Total of home ownsers insurance: {round(totalOfHomeOwnersInsuranceAtYear(props))}</p></ul>
        <ul><p>Total of HOA: {round(totalOfHoaAtYear(props))}</p></ul>
        <ul><p>Down Payment: {round(props.downPayment)}</p></ul>
        <ul><p>Opportunity Cost: {round(downPaymentOpportunityCost(props))}</p></ul>
        <ul><p>Buying Costs: {round(closingCosts(props))}</p></ul>
        <ul><p>Selling Costs: {round(sellingCosts(props))}</p></ul>
        <ul><p>Total of money spent: {round(totalOfMoneySpentAtPeriodOwn(props))}</p></ul>
        <ul><h4>Assets/Benefits</h4></ul>
        <ul><p>Total of tax savings: {round(totalOfTaxSavings(props))}</p></ul>
        <ul><p>Principal Payments Accumulated: {round(principalAccumulatedAtLengthOfResidence(props))}</p></ul>
        <ul><p>Down Payment: {round(props.downPayment)}</p></ul>
        <ul><p>Appreciation: {round(totalAppreciation(props))}</p></ul>
        <ul><p>Total of Benefits: {round(totalOfBenefits(props))}</p></ul>
        <ul><h4>Net Dead Money: ${round(netDeadMoneyOwn(props))}</h4></ul>
      <h3>Renting</h3>
        <ul><p>First Year Monthly Payment: {round(calculateMonthlyRentPayment(props))}</p></ul>
        <ul><p>Last Year Monthly Payment: {round(estimatedTotalMonthlyRentAtYear(props))}</p></ul>
        <ul><h4>Dead Money</h4></ul>
        <ul><p>Total of rent: {round(totalOfRentPaymentsAtYear(props))}</p></ul>
        <ul><p>Total of renter's insurance: {round(totalOfRentersInsurancePaymentsAtYear(props))} </p></ul>
        <ul><h4>Net Dead Money: ${round(netDeadMoneyRent(props))}</h4></ul>
    </div>
    {resultStatement(props)}
  </div>);
}

function resultStatement(props) {
  const netDeadRent = netDeadMoneyRent(props)
  const netDeadOwn = netDeadMoneyOwn(props)
  var sentence = null
  if (netDeadRent > netDeadOwn) {
    sentence = "You'd be $" + round(netDeadRent - netDeadOwn) + " richer if you purchased!!"
  } else {
    sentence = "You'd be $" + round(netDeadOwn - netDeadRent) + " richer if you rented!!"
  }
  return(
    <div>
      <h2>Result</h2>
      <p>{sentence}</p>
    </div>
  )
}

function closingCosts(props) {
  return (props.costOfBuyingPercent/100)*props.propertyCost
}

function sellingCosts(props) {
  return (props.costOfSellingPercent/100)*(props.propertyCost+totalAppreciation(props))
}

function netDeadMoneyRent(props) {
  return totalOfRentPaymentsAtYear(props) - totalOfRentersInsurancePaymentsAtYear(props)
}

function netDeadMoneyOwn(props) {
  return totalOfMoneySpentAtPeriodOwn(props) - totalOfBenefits(props)
}

function downPaymentOpportunityCost(props) {
  return ((props.downPayment * investmentReturnRateMultiplier(props)) - props.downPayment)
}

function totalOfBenefits(props) {
  return totalOfTaxSavings(props) + principalAccumulatedAtLengthOfResidence(props) + totalAppreciation(props) + props.downPayment
}

function totalOfTaxSavings(props) {
  return ((props.federalTaxRate + props.stateTaxRate)/100 * totalTaxDeductibleAtYear(props))
}

function totalAppreciation(props) {
  return (propertyValueIncreaseMultiplier(props) * props.propertyCost) - props.propertyCost
}

function totalTaxDeductibleAtYear(props) {
  return totalOfInterestAtYear(props) + totalOfTaxesAtYear(props)
}

function totalOfMoneySpentAtPeriodOwn(props) {
  return (
    totalOfInterestAtYear(props) + 
    totalOfHoaAtYear(props) + 
    totalOfHomeOwnersInsuranceAtYear(props) +
    totalOfTaxesAtYear(props) + 
    principalAccumulatedAtLengthOfResidence(props) + 
    props.downPayment + 
    downPaymentOpportunityCost(props) + 
    closingCosts(props) + 
    sellingCosts(props)
  )
}

function totalOfInterestAtYear(props) {
  return totalOfMortgagePaymentsAtYear(props) - principalAccumulatedAtLengthOfResidence(props)
}

function principalAccumulatedAtLengthOfResidence(props) {
  const initialLoanAmount = amountBorrowed(props)
  return round(initialLoanAmount - principalOwedAtLengthOfResidence(props))
}

function principalOwedAtLengthOfResidence(props) {
  const monthlyPayment = calculateMonthlyMortgagePaymentFromProps(props)
  const initialLoanAmount = amountBorrowed(props)
  const monthlyRate = monthlyInterestRate(props.aprPercent)
  const periods = (12 * props.lengthOfResidence)
  return (monthlyPayment + ((1 + monthlyRate)**periods)*(monthlyRate*initialLoanAmount - monthlyPayment))/monthlyRate
}

function totalOfTaxesAtYear(props) {
  const averareAnnualPropertyTax = (props.propertyTax + estimatedTaxesAtYear(props))/2
  return averareAnnualPropertyTax * props.lengthOfResidence
}

function estimatedTaxesAtYear(props) {
  return props.propertyTax * inflationRateMultiplier(props)
}

function totalOfHoaAtYear(props) {
  const averageAnnualHoa = (props.hoa + estimatedHoaAtYear(props))/2
  return round(averageAnnualHoa * props.lengthOfResidence * 12)
}

function estimatedHoaAtYear(props) {
  return props.hoa * inflationRateMultiplier(props)
}

function totalOfHomeOwnersInsuranceAtYear(props) {
  const averageAnnualIns = (props.annualHomeOwnersInsurance + estimatedHomeOwnersInsuranceAtYear(props))/2
  return round(averageAnnualIns * props.lengthOfResidence)
}

function estimatedHomeOwnersInsuranceAtYear(props) {
  return props.annualHomeOwnersInsurance * propertyValueIncreaseMultiplier(props)
}

function investmentReturnRateMultiplier(props) {
  return (1.0 + (props.investmentReturnRate/100)) ** props.lengthOfResidence
}

function inflationRateMultiplier(props) {
  return (1.0 + (props.inflationRate/100)) ** props.lengthOfResidence
}

function propertyValueIncreaseMultiplier(props) {
  return (1.0 + (props.propertyValueIncreaseRate/100)) ** props.lengthOfResidence
}

function totalOfRentPaymentsAtYear(props) {
  const averageAnnualRent = ((props.monthlyRent + (estimatedRentAtYear(props)))/2)*12
  return averageAnnualRent * (props.lengthOfResidence)
}

function estimatedRentAtYear(props) {
  return props.monthlyRent * inflationRateMultiplier(props)
}

function totalOfRentersInsurancePaymentsAtYear(props) {
  const averageAnnualRentersInsurance = ((props.monthlyRentersInsurance + (estimatedRentersInsuranceAtYear(props)))/2)*12
  return averageAnnualRentersInsurance * (props.lengthOfResidence)
}

function estimatedRentersInsuranceAtYear(props) {
  return props.monthlyRentersInsurance * inflationRateMultiplier(props)
}

function estimatedTotalMonthlyRentAtYear(props) {
  return estimatedRentersInsuranceAtYear(props) + estimatedRentAtYear(props)
}

function totalOfMortgagePaymentsAtYear(props) {
  return round(calculateMonthlyMortgagePaymentFromProps(props) * (props.lengthOfResidence * 12))
}

function owningPaymentAtYear(props) {
  return (calculateMonthlyMortgagePaymentFromProps(props) + (estimatedTaxesAtYear(props)/12) + estimatedHoaAtYear(props)) + (estimatedHomeOwnersInsuranceAtYear(props)/12)
}

function calculateMonthlyRentPayment(props) {
  return props.monthlyRent + props.monthlyRentersInsurance;
}

function calculateMonthlyOwnPayment(props) {
  return (props.annualHomeOwnersInsurance/12) + props.hoa + (props.propertyTax / 12) + calculateMonthlyMortgagePaymentFromProps(props);
}

function calculateMonthlyMortgagePaymentFromProps(props) {
  return calculateMonthlyMortgagePayment(
    props.propertyCost, 
    props.aprPercent, 
    props.mortgageLength, 
    props.downPayment,
    amountBorrowed(props)
  );
}

function amountBorrowed(props) {
  return props.propertyCost - props.downPayment
}

function monthlyInterestRate(aprPercent) {
  return (aprPercent/100)/12
}

function calculateMonthlyMortgagePayment(propertyCost, aprPercent, mortgageLength, downPayment, amountBorrowed) {
  const paymentPeriods = mortgageLength * 12
  const monthlyInterest = monthlyInterestRate(aprPercent)
  return calculatePayment(amountBorrowed, monthlyInterest, paymentPeriods)
}

function calculatePayment(amountBorrowed, monthlyInterest, paymentPeriods) {
  return amountBorrowed * monthlyInterest * (Math.pow(1 + monthlyInterest, paymentPeriods)) / (Math.pow(1 + monthlyInterest, paymentPeriods) - 1);
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.handlePropertyCostChange = this.handlePropertyCostChange.bind(this);
    this.handleAnnualHomeOwnersInsuranceCostChange = this.handleAnnualHomeOwnersInsuranceCostChange.bind(this);
    this.handleHoaChange = this.handleHoaChange.bind(this);
    this.handlePropertyTaxChange = this.handlePropertyTaxChange.bind(this);
    this.handleAprChange = this.handleAprChange.bind(this);
    this.handleMortgageLengthChange = this.handleMortgageLengthChange.bind(this);
    this.handleDownPaymentChange = this.handleDownPaymentChange.bind(this);
    this.handleCostOfBuyingPercentChange = this.handleCostOfBuyingPercentChange.bind(this);
    this.handleCostOfSellingPercentChange = this.handleCostOfSellingPercentChange.bind(this);
    this.handleRentChange = this.handleRentChange.bind(this);
    this.handleRentersInsuranceChange = this.handleRentersInsuranceChange.bind(this);
    this.handleLengthOfResidenceChange = this.handleLengthOfResidenceChange.bind(this);
    this.handlePropertyValueIncreaseRateChange = this.handlePropertyValueIncreaseRateChange.bind(this);
    this.handleInflationRateChange = this.handleInflationRateChange.bind(this);
    this.handleFederalTaxRateChange = this.handleFederalTaxRateChange.bind(this);
    this.handleStateTaxRateChange = this.handleStateTaxRateChange.bind(this);
    this.handleInvestmentReturnRateChange = this.handleInvestmentReturnRateChange.bind(this);

    this.state = {
      propertyCost: 182000,
      annualHomeOwnersInsurance: 400,
      hoa: 323,
      propertyTax: 2195,
      aprPercent: 3.25,
      mortgageLength: 15,
      downPayment: 36400,
      costOfBuyingPercent: 3,
      costOfSellingPercent: 6,
      monthlyRent: 1940,
      monthlyRentersInsurance: 14,
      lengthOfResidence: 5,
      propertyValueIncreaseRate: 3,
      inflationRate: 2.5,
      federalTaxRate: 28,
      stateTaxRate: 6.75,
      investmentReturnRate: 7
    };
  }

  handlePropertyCostChange(e) {
    this.setState({propertyCost: e.target.value});
  }

  handleAnnualHomeOwnersInsuranceCostChange(e) {
    this.setState({annualHomeOwnersInsurance: e.target.value});
  }

  handleHoaChange(e) {
    this.setState({hoa: e.target.value});
  }

  handlePropertyTaxChange(e) {
    this.setState({propertyTax: e.target.value});
  }

  handleAprChange(e) {
    this.setState({aprPercent: e.target.value});
  }

  handleMortgageLengthChange(e) {
    this.setState({mortgageLength: e.target.value});
  }

  handleDownPaymentChange(e) {
    this.setState({downPayment: e.target.value});
  }

  handleCostOfBuyingPercentChange(e) {
    this.setState({costOfBuyingPercent: e.target.value});
  }

  handleCostOfSellingPercentChange(e) {
    this.setState({costOfSellingPercent: e.target.value});
  }

  handleRentChange(e) {
    this.setState({monthlyRent: e.target.value});
  }

  handleRentersInsuranceChange(e) {
    this.setState({monthlyRentersInsurance: e.target.value});
  }

  handleLengthOfResidenceChange(e) {
    this.setState({lengthOfResidence: e.target.value});
  }

  handlePropertyValueIncreaseRateChange(e) {
    this.setState({propertyValueIncreaseRate: e.target.value});
  }

  handleInflationRateChange(e) {
    this.setState({inflationRate: e.target.value});
  }

  handleFederalTaxRateChange(e) {
    this.setState({federalTaxRate: e.target.value});
  }

  handleStateTaxRateChange(e) {
    this.setState({stateTaxRate: e.target.value});
  }

  handleInvestmentReturnRateChange(e) {
    this.setState({investmentReturnRate: e.target.value});
  }

  render() {

    const propertyCost = this.state.propertyCost;
    const annualHomeOwnersInsurance = this.state.annualHomeOwnersInsurance;
    const hoa = this.state.hoa;
    const propertyTax = this.state.propertyTax;
    const aprPercent = this.state.aprPercent;
    const mortgageLength = this.state.mortgageLength;
    const downPayment = this.state.downPayment;
    const costOfBuyingPercent = this.state.costOfBuyingPercent;
    const costOfSellingPercent = this.state.costOfSellingPercent;

    const monthlyRent = this.state.monthlyRent;
    const monthlyRentersInsurance = this.state.monthlyRentersInsurance;

    const lengthOfResidence = this.state.lengthOfResidence;
    const propertyValueIncreaseRate = this.state.propertyValueIncreaseRate;
    const inflationRate = this.state.inflationRate;
    const federalTaxRate = this.state.federalTaxRate;
    const stateTaxRate = this.state.stateTaxRate;
    const investmentReturnRate = this.state.investmentReturnRate;

    return (
      <div>
        <fieldset>
          <legend>Enter the price of the property:</legend>
          <input
            value={propertyCost}
            onChange={this.handlePropertyCostChange} />
          <legend>Enter annual home owners insurance cost:</legend>
          <input
            value={annualHomeOwnersInsurance}
            onChange={this.handleAnnualHomeOwnersInsuranceCostChange} />
          <legend>Enter monthly hoa cost:</legend>
          <input
            value={hoa}
            onChange={this.handleHoaChange} />
          <legend>Enter annual property tax:</legend>
          <input
            value={propertyTax}
            onChange={this.handlePropertyTaxChange} />
          <legend>Enter apr as percentage:</legend>
          <input
            value={aprPercent}
            onChange={this.handleAprChange} />
          <legend>Enter mortgage length in years:</legend>
          <input
            value={mortgageLength}
            onChange={this.handleMortgageLengthChange} />
          <legend>Enter down payment: </legend>
          <input
            value={downPayment}
            onChange={this.handleDownPaymentChange} />
          <MonthlyPaymentOwn
            propertyCost = {parseFloat(propertyCost)}
            annualHomeOwnersInsurance = {parseFloat(annualHomeOwnersInsurance)}
            hoa = {parseFloat(hoa)}
            propertyTax = {parseFloat(propertyTax)} 
            aprPercent = {parseFloat(aprPercent)}
            mortgageLength = {parseFloat(mortgageLength)} 
            downPayment = {parseFloat(downPayment)}
          />
        </fieldset>

        <fieldset>
          <legend>Enter your monthly rent:</legend>
          <input
            value={monthlyRent}
            onChange={this.handleRentChange} />
          <legend>Enter your monthly renters insurance:</legend>
          <input
            value={monthlyRentersInsurance}
            onChange={this.handleRentersInsuranceChange} />
          <MonthlyPaymentRent
            monthlyRent = {parseFloat(monthlyRent)}
            monthlyRentersInsurance = {parseFloat(monthlyRentersInsurance)}
          />
        </fieldset>

        <fieldset>
          <legend>Enter length of residence:</legend>
          <input
            value={lengthOfResidence}
            onChange={this.handleLengthOfResidenceChange} />
          <legend>Enter closing costs (as % of initial property value): </legend>
          <input
            value={costOfBuyingPercent}
            onChange={this.handleCostOfBuyingPercentChange} />
          <legend>Enter cost of selling (as % of final property value): </legend>
          <input
            value={costOfSellingPercent}
            onChange={this.handleCostOfSellingPercentChange} />
          <legend>Enter property value increase rate (as %):</legend>
          <input
            value={propertyValueIncreaseRate}
            onChange={this.handlePropertyValueIncreaseRateChange} />
          <legend>Enter inflation rate (as %):</legend>
          <input
            value={inflationRate}
            onChange={this.handleInflationRateChange} />
          <legend>Enter federal tax rate (as %):</legend>
          <input
            value={federalTaxRate}
            onChange={this.handleFederalTaxRateChange} />
          <legend>Enter state tax rate (as %):</legend>
          <input
            value={stateTaxRate}
            onChange={this.handleStateTaxRateChange} />
          <legend>Enter investment return rate (as %):</legend>
          <input
            value={investmentReturnRate}
            onChange={this.handleInvestmentReturnRateChange} />
          </fieldset>
          <fieldset>
          <CalculateOwningAdvantageAtYear
            propertyCost = {parseFloat(propertyCost)}
            annualHomeOwnersInsurance = {parseFloat(annualHomeOwnersInsurance)}
            hoa = {parseFloat(hoa)}
            propertyTax = {parseFloat(propertyTax)} 
            aprPercent = {parseFloat(aprPercent)}
            mortgageLength = {parseFloat(mortgageLength)} 
            downPayment = {parseFloat(downPayment)}
            costOfBuyingPercent = {parseFloat(costOfBuyingPercent)}
            costOfSellingPercent = {parseFloat(costOfSellingPercent)}
            monthlyRent = {parseFloat(monthlyRent)}
            monthlyRentersInsurance = {parseFloat(monthlyRentersInsurance)}
            lengthOfResidence = {parseFloat(lengthOfResidence)}
            propertyValueIncreaseRate = {parseFloat(propertyValueIncreaseRate)}
            inflationRate = {parseFloat(inflationRate)}
            federalTaxRate = {parseFloat(federalTaxRate)}
            stateTaxRate = {parseFloat(stateTaxRate)}
            investmentReturnRate = {parseFloat(investmentReturnRate)}
          />
        </fieldset>
      </div>
    );
  }
}


ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
