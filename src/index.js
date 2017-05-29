import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

function MonthlyPaymentOwn(props) {
  return <p>Monthly payment owning is: {
    round(calculateMonthlyOwnCost(
      props.propertyCost,
      props.hoa, 
      props.propertyTax,
      props.aprPercent,
      props.mortgageLength,
      props.downPayment
    ), 2)
  }</p>;
}

function MonthlyPaymentRent(props) {
  return <p>Monthly payment for rent is: {props.monthlyRent}</p>;
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function calculateMonthlyOwnCost(propertyCost, hoa, propertyTax, aprPercent, mortgageLength, downPayment) {
  return hoa + (propertyTax / 12) + calculateMonthlyMortgagePayment(propertyCost, aprPercent, mortgageLength, downPayment);
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
    this.state = {
      propertyCost: 0,
      hoa: 0,
      propertyTax: 0,
      aprPercent: 3.25,
      mortgageLength: 15,
      downPayment: 0,
      monthlyRent: 0
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

  render() {

    const propertyCost = this.state.propertyCost;
    const hoa = this.state.hoa;
    const propertyTax = this.state.propertyTax;
    const aprPercent = this.state.aprPercent;
    const mortgageLength = this.state.mortgageLength;
    const downPayment = this.state.downPayment;

    const monthlyRent = this.state.monthlyRent;

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
      </div>
    );
  }
}


ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);

// const scaleNames = {
//   hoa: 'Monthly HOA',
//   propertyTax: "Annual Property Tax",
//   aprPercent: "Mortgage APR",
//   mortgageLength: "Mortgage Length in years"
// };

// class Clock extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {date: new Date()};
//   }

//   tick() {
//     this.setState({
//       date: new Date()
//     });
//   }

//   componentDidMount() {
//     this.timerID = setInterval(
//       () => this.tick(),
//       1000
//     );

//   }

//   componentWillUnmount() {
//     clearInterval(this.timerID);
//   }

//   render() {
//     return (
//       <div>
//         <h1>Hello, world!</h1>
//         <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
//       </div>
//     );
//   }
// }

// class HoaInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.value = 8
//     this.handleChange = this.handleChange.bind(this);
//   }

//   handleChange(e) {
//     this.setState({value: e.target.value});
//   }

//   render() {
//     const hoaInputValue = this.props.hoaInputValue;
//     return (
//       <fieldset>
//         <legend>Enter monthly HOA Fee:</legend>
//         <input value={hoaInputValue}
//                onChange={this.handleChange} />
//       </fieldset>
//     );
//   }
// }

// class Calculator extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleHoaChange = this.handleHoaChange.bind(this);
//   }

//   handleHoaChange(hoaInputValue) {
//     this.setState({hoaInputValue});
//   }

//   hoa() {

//   }

//   render() {
//     const hoa = 3
//     const propertyTax = 10

//     return (
//       <div>
//         <HoaInput
//           scale="hoa"
//           mortgageInputValue={hoa}
//           onMortgageChange={this.handleHoaChange} />
//       </div>
//     );
//   }
// }

// ReactDOM.render(
//   <Calculator />,
//   document.getElementById('root')
// );

// const scaleNames = {
//   hoa: 'Monthly HOA',
//   propertyTax: "Annual Property Tax",
//   aprPercent: "Mortgage APR",
//   mortgageLength: "Mortgage Length in years"
// };

// function toCelsius(propertyTax) {
//   return (propertyTax - 32) * 5 / 9;
// }

// function toFahrenheit(hoa) {
//   return (hoa * 9 / 5) + 32;
// }

// function BoilingVerdict(props) {
//   if (props.hoa >= 100) {
//     return <p>The water would boil.</p>;
//   }
//   return <p>The water would not boil.</p>;
// }

// class HoaInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleChange = this.handleChange.bind(this);
//   }

//   handleChange(e) {
//     this.props.onHoaChange(e.target.value);
//   }

//   render() {
//     const hoaInputValue = this.props.hoaInputValue;
//     return (
//       <fieldset>
//         <legend>Enter monthly HOA Fee:</legend>
//         <input value={hoaInputValue}
//                onChange={this.handleChange} />
//       </fieldset>
//     );
//   }
// }

// class Calculator extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleHoaChange = this.handleHoaChange.bind(this);
//   }

//   handleHoaChange(hoaInputValue) {
//     this.setState({hoaInputValue});
//   }

//   render() {
//     const hoaInputValue = this.state.hoaInputValue;
//     const hoa = 3
//     const propertyTax = 10

//     return (
//       <div>
//         <HoaInput
//           scale="hoa"
//           mortgageInputValue={hoa}
//           onMortgageChange={this.handleHoaChange} />
//         <BoilingVerdict
//           hoa={parseFloat(hoa)} />
//       </div>
//     );
//   }
// }

// ReactDOM.render(
//   <Calculator />,
//   document.getElementById('root')
// );

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('root')
// );
//
// function formatName(user) {
//   return user.firstName + ' ' + user.lastName;
// }
//
// const user = {
//   firstName: 'Harper',
//   lastName: 'Perez'
// };
//
// const element = (
//   <h1>
//     Hello, {formatName(user)}!
//   </h1>
// );
//
// ReactDOM.render(
//   element,
//   document.getElementById('root')
// );
