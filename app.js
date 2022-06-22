"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach((mov, i) => {
    const transactionType = mov > 0 ? "deposit" : "withdrawal";
    const htmlEl = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", htmlEl);
  });
};

const createUserName = function (userAccounts) {
  userAccounts.forEach((account) => {
    account.userName = account["owner"]
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
    // return userName;
  });
};

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((prevMov, mov) => prevMov + mov, 0);
  labelBalance.textContent = `${balance}EUR`;
};

const calcDisplaySumary = function (movements) {
  const inMovements = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${inMovements}€`;

  const outMovements = Math.abs(
    movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${outMovements}€`;

  const interestRate = 0.012; //only added if at less 1€ interest
  const interest = movements
    .map((mov) => mov > 0 && mov * interestRate)
    .filter((interst) => interst >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const findAccount = function (nameAccount, userAccounts) {
  const account = userAccounts.find((acc) => acc.owner === nameAccount);
  return account;
};

console.log(findAccount("Jessica Davis", accounts));
calcDisplayBalance(account1.movements);
displayMovements(account1.movements);
calcDisplaySumary(account1.movements);

// Lectures
const user = "Steven Thomas Williams";

createUserName(accounts);
console.log(accounts);

const deposits = [account1.movements.filter((mov) => mov > 0)];
const withdrawal = [account1.movements.filter((mov) => mov < 0)];

const euroToUsd = 1.1;

const totalDepUsd = account1.movements
  .filter((mov) => mov > 0)
  .map((dep) => dep * euroToUsd)
  .reduce((acc, dep) => acc + dep, 0);
console.log(totalDepUsd);
console.log(deposits, withdrawal);
