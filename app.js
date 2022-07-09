"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-07-03T17:01:17.194Z",
    "2022-07-05T23:36:17.929Z",
    "2022-07-07T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-05-25T18:49:59.371Z",
    "2022-07-06T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

// Functions

const formatedCurrency = function (loc, cur, mov) {
  // TODO values movements x country format
  const currencyOption = { style: "currency", currency: cur };

  const formatedMov = new Intl.NumberFormat(loc, currencyOption).format(mov);
  return formatedMov;
};

const calcDaysPassed = (date1, date2) =>
  Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

const formatMovementDate = function (date, locale) {
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "today";
  else if (daysPassed === 1) return "yesterday";
  else if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = `${date.getFullYear()}`;
  // const dateMovStr = `${day}/${month}/${year}`;
  // return dateMovStr;

  return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const transactionType = mov > 0 ? "deposit" : "withdrawal";

    const dateMovStr = formatMovementDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );

    // TODO values movements x country format

    const formatedMov = formatedCurrency(acc.locale, acc.currency, mov);

    const htmlEl = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
    <div class="movements__date">${dateMovStr}</div>
        <div class="movements__value">${formatedMov}</div>
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

const calcDisplayBalance = function (currentAcc) {
  const movements = currentAcc.movements;
  //  values movements x country format
  currentAcc.balance = movements.reduce((prevMov, mov) => prevMov + mov, 0);
  labelBalance.textContent = `${formatedCurrency(
    currentAcc.locale,
    currentAcc.currency,
    currentAcc.balance
  )}`;
};

const calcDisplaySumary = function (acc) {
  const inMovements = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatedCurrency(
    acc.locale,
    acc.currency,
    inMovements
  )}`;

  const outMovements = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${formatedCurrency(
    acc.locale,
    acc.currency,
    outMovements
  )}`;

  const interestRate = acc.interestRate / 100; //only added if at less 1€ interest
  const interest = acc.movements
    .map((mov) => mov > 0 && mov * interestRate)
    .filter((interst) => interst >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${formatedCurrency(
    acc.locale,
    acc.currency,
    interest
  )}`;
};

const findAccount = function (nameAccount, userAccounts) {
  const account = userAccounts.find((acc) => acc.userName === nameAccount);
  return account;
};

const startLogOutTimer = function () {
  // set time to 5 min
  let timer = 300;

  const tick = () => {
    const min = String(Math.trunc(timer / 60)).padStart(2, "0");
    const sec = String(timer % 60).padStart(2, "0");
    // In each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    if (timer === 0) {
      clearInterval(timerLogOut);

      // When 0 sec, stop timer and log out user
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    timer--;
  };
  tick();
  // Call the timer every second
  const timerLgOut = setInterval(tick, 1000);
  return timerLgOut;
};

createUserName(accounts);

////////////////////////////////////////////////
// Event Handlers
let currentAccount, timerLogOut;

btnLogin.addEventListener("click", function (ev) {
  ev.preventDefault();
  const account = findAccount(inputLoginUsername.value, accounts);
  if (account?.pin === +inputLoginPin.value) {
    // if (account?.pin === Number(inputLoginPin.value)) {
    currentAccount = account;

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    setInterval(() => {
      const now = new Date();
      // day/month/year
      // const day = `${now.getDate()}`.padStart(2, 0);
      // const month = `${now.getMonth() + 1}`.padStart(2, 0);
      // const year = `${now.getFullYear()}`;
      // const hour = `${now.getHours()}`.padStart(2, 0);
      // const min = `${now.getMinutes()}`.padStart(2, 0);
      // labelDate.textContent = `${day}/${month}/${year} ${hour}:${min}`;
      const localeOp = currentAccount.locale;
      const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        day: "2-digit",
        month: "numeric",
        year: "numeric",
        // weekday: "long",
      };
      labelDate.textContent = new Intl.DateTimeFormat(localeOp, options).format(
        now
      );
    }, 1000);

    // Clear fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // if exist a previous timer running, close it, and init the new one
    if (timerLogOut) clearInterval(timerLogOut);
    timerLogOut = startLogOutTimer();
    updateUI(currentAccount);
  }
});

let sorted = false;
btnSort.addEventListener("click", function (ev) {
  ev.preventDefault();
  // reset timer
  clearInterval(timerLogOut);
  timerLogOut = startLogOutTimer();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});

const updateUI = function (currentAcc) {
  // Display movements
  displayMovements(currentAcc);

  // Display balance
  calcDisplayBalance(currentAcc);

  // Display Summary
  calcDisplaySumary(currentAcc);
};

btnTransfer.addEventListener("click", function (ev) {
  ev.preventDefault();
  const destinyAccount = findAccount(inputTransferTo.value, accounts);
  const ammount = +inputTransferAmount.value;
  // const ammount = Number(inputTransferAmount.value);

  inputTransferAmount.blur();
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    currentAccount.balance >= ammount &&
    ammount > 0 &&
    destinyAccount &&
    destinyAccount.userName != currentAccount.userName
  ) {
    // Do the transfer
    destinyAccount?.movements.push(ammount);
    currentAccount.movements.push(-ammount);

    // date of the transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    destinyAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
  // reset timer
  clearInterval(timerLogOut);
  timerLogOut = startLogOutTimer();
});

btnLoan.addEventListener("click", function (ev) {
  ev.preventDefault();

  // reset timer
  clearInterval(timerLogOut);
  timerLogOut = startLogOutTimer();

  const loanAmount = Math.floor(inputLoanAmount.value);
  // const loanAmount = Number(inputLoanAmount.value);
  inputLoanAmount.value = "";
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov > loanAmount * 0.1)
  ) {
    // simulate a real loan, setting some time to make it effective
    setTimeout(function () {
      // Add Loan
      currentAccount.movements.push(loanAmount);

      // date of the transfer
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
  }
});

btnClose.addEventListener("click", function (ev) {
  ev.preventDefault();

  const closeUser = inputCloseUsername.value;
  const closePin = +inputClosePin.value;
  // const closePin = Number(inputClosePin.value);
  if (
    closeUser === currentAccount.userName &&
    closePin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
    containerApp.style.opacity = 0;
  }
});

labelBalance.addEventListener("click", () => {
  [...document.querySelectorAll(".movements__row")].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = "orangered";
    else row.style.backgroundColor = "blue";
  });
});

// Auto Log Fake:
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Lectures
const user = "Steven Thomas Williams";

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
