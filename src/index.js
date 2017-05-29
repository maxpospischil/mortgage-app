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
    <h2>The Rent vs. Own SMACKDOWNNNNNNNN</h2>
    <div>
      <h3>Owning</h3>
        <ul>Total of monthly mortgage payments: {totalOfMortgagePaymentsAtYear(props)}</ul>
        <ul><h4>Dead Money</h4></ul>
        <ul><p>Total of taxes: {totalOfTaxesAtYear(props)}</p></ul>
        <ul><p>Total of HOA: {totalOfHoaAtYear(props)}</p></ul>
        <ul><p>Total of interest: </p></ul>
        <ul><h4>Assets/Benefits</h4></ul>
        <ul><p>Total Tax Deductions: </p></ul>
        <ul><p>Principal Accrued: </p></ul>
        <ul><p>Appreciation: </p></ul>
        <ul><h4>Net Dead Money: $</h4></ul>
      <h3>Renting</h3>
        <ul><h4>Dead Money</h4></ul>
        <ul><p>Total of rent: </p></ul>
        <ul><p>Total of renter's insurance </p></ul>

    </div>
    
  </div>);
}

function totalOfTaxesAtYear(props) {
  const averareAnnualPropertyTax = (props.propertyTax + (props.propertyTax * inflationRateMultiplier(props)))/2
  return round(averareAnnualPropertyTax * props.lengthOfResidence)
}

function totalOfHoaAtYear(props) {
  const averageAnnualHoa = (props.hoa + (props.hoa * inflationRateMultiplier(props)))/2
  return round(averageAnnualHoa * props.lengthOfResidence)
}

function inflationRateMultiplier(props) {
  return (1.0 + (props.inflationRate/100)) ** props.lengthOfResidence
}

function propertyValueIncreaseMultiplier(props) {
  return (1.0 + (props.propertyValueIncreaseRate/100)) ** props.lengthOfResidence
}

function totalOfRentPaymentsAtYear(props) {
  return calculateMonthlyRentPayment(props) * props.lengthOfResidence
}

function totalOfMortgagePaymentsAtYear(props) {
  return round(calculateMonthlyMortgagePayment(
    props.propertyCost, 
    props.aprPercent, 
    props.mortgageLength, 
    props.downPayment
  ) * (props.lengthOfResidence * 12))
}

function totalOfOwningPaymentsAtYear(props) {
  return calculateMonthlyOwnPayment(props) * props.lengthOfResidence
}

function calculateMonthlyRentPayment(props) {
  return props.monthlyRent;
}

function calculateMonthlyOwnPayment(props) {
  return props.hoa + (props.propertyTax / 12) + calculateMonthlyMortgagePayment(
    props.propertyCost, 
    props.aprPercent, 
    props.mortgageLength, 
    props.downPayment
  );
}

function calculateMonthlyMortgagePayment(propertyCost, aprPercent, mortgageLength, downPayment) {
  const paymentPeriods = mortgageLength * 12
  const apr = aprPercent/100
  const monthlyInterest = apr/12
  const amountBorrowed = propertyCost - downPayment
  return calculatePayment(amountBorrowed, monthlyInterest, paymentPeriods)
}

function calculatePayment(amountBorrowed, monthlyInterest, paymentPeriods) {
  return amountBorrowed * monthlyInterest * (Math.pow(1 + monthlyInterest, paymentPeriods)) / (Math.pow(1 + monthlyInterest, paymentPeriods) - 1);
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handlePropertyCostChange = this.handlePropertyCostChange.bind(this);
    this.handleHoaChange = this.handleHoaChange.bind(this);
    this.handlePropertyTaxChange = this.handlePropertyTaxChange.bind(this);
    this.handleAprChange = this.handleAprChange.bind(this);
    this.handleMortgageLengthChange = this.handleMortgageLengthChange.bind(this);
    this.handleDownPaymentChange = this.handleDownPaymentChange.bind(this);
    this.handleRentChange = this.handleRentChange.bind(this);
    this.handleLengthOfResidenceChange = this.handleLengthOfResidenceChange.bind(this);
    this.handlePropertyValueIncreaseRateChange = this.handlePropertyValueIncreaseRateChange.bind(this);
    this.handleInflationRateChange = this.handleInflationRateChange.bind(this);

    this.state = {
      propertyCost: 182000,
      hoa: 323,
      propertyTax: 2195,
      aprPercent: 3.25,
      mortgageLength: 15,
      downPayment: 36400,
      monthlyRent: 1940,
      lengthOfResidence: 5,
      propertyValueIncreaseRate: 3,
      inflationRate: 2.5
    };
  }

  handlePropertyCostChange(e) {
    this.setState({propertyCost: e.target.value});
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

  handleRentChange(e) {
    this.setState({monthlyRent: e.target.value});
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

  render() {

    const propertyCost = this.state.propertyCost;
    const hoa = this.state.hoa;
    const propertyTax = this.state.propertyTax;
    const aprPercent = this.state.aprPercent;
    const mortgageLength = this.state.mortgageLength;
    const downPayment = this.state.downPayment;

    const monthlyRent = this.state.monthlyRent;

    const lengthOfResidence = this.state.lengthOfResidence;
    const propertyValueIncreaseRate = this.state.propertyValueIncreaseRate;
    const inflationRate = this.state.inflationRate;

    return (
      <div>
        <fieldset>
          <legend>Enter the price of the property:</legend>
          <input
            value={propertyCost}
            onChange={this.handlePropertyCostChange} />
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
          <MonthlyPaymentRent
            monthlyRent = {parseFloat(monthlyRent)}
          />
        </fieldset>

        <fieldset>
          <legend>Enter length of residence:</legend>
          <input
            value={lengthOfResidence}
            onChange={this.handleLengthOfResidenceChange} />
          <legend>Enter property value increase rate (as %):</legend>
          <input
            value={propertyValueIncreaseRate}
            onChange={this.handlePropertyValueIncreaseRateChange} />
          <legend>Enter inflation rate (as %):</legend>
          <input
            value={inflationRate}
            onChange={this.handleInflationRateChange} />
          <CalculateOwningAdvantageAtYear
            propertyCost = {parseFloat(propertyCost)}
            hoa = {parseFloat(hoa)}
            propertyTax = {parseFloat(propertyTax)} 
            aprPercent = {parseFloat(aprPercent)}
            mortgageLength = {parseFloat(mortgageLength)} 
            downPayment = {parseFloat(downPayment)}
            monthlyRent = {parseFloat(monthlyRent)}
            lengthOfResidence = {parseFloat(lengthOfResidence)}
            propertyValueIncreaseRate = {parseFloat(propertyValueIncreaseRate)}
            inflationRate = {parseFloat(inflationRate)}
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
