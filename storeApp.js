// store
const itemsElement = document.getElementById("items");
const priceElement = document.getElementById("price");
const addElement = document.getElementById("add");
const payButtonElement = document.getElementById("pay");
const imageElement= document.getElementById("image");
const titleElement = document.getElementById("title")
const featureElement = document.getElementById("features");
const specsElement = document.getElementById("specs")
// bank
const loanButtonElement = document.getElementById("loan");
const bankBalanceElement = document.getElementById("bankBalance");
const outstandingDueElement = document.getElementById("outstandingDue");
// work
const doBankEarningsButtonElement = document.getElementById("doBankEarnings");
const doWorkButtonElement = document.getElementById("doWork");
const workBalanceElement = document.getElementById("workBalance");
const repayLoanButtonElement = document.getElementById("repayLoan");


let items = [];
let totalDue = 0.0;
let specs = [];  // delete me if not used..

let loan = 0.0;
let bankBalance = 200.0;
let outstandingDue = 0.0;
const salary = 100.0;
let workBalance = 0.0;

let price = 0.0;

//update initial html values
bankBalanceElement.innerText = `Balance: ${handleLocalCurrency(bankBalance)}`;
repayLoanButtonElement.style.display="none"

const komputersJsonUrl = "https://hickory-quilled-actress.glitch.me/computers";
const rootImageUrl = "https://hickory-quilled-actress.glitch.me/"
imageElement.src=(`${rootImageUrl}assets/images/1.png`); //set initial image of the selector

fetch(komputersJsonUrl)
  .then((Response) => Response.json())
  .then((data) => (items = data))
  .then((items) => addItemsToMenu(items)); 
  
const addItemsToMenu = (items) => {
  items.forEach((x) => addItemToMenu(x));
  priceElement.innerText = handleLocalCurrency(items[0].price);
};
const addItemToMenu = (item) => {
  const itemElement = document.createElement("option");
  itemElement.value = item.id;
  itemElement.appendChild(document.createTextNode(item.title));
  itemsElement.appendChild(itemElement);
};
const handleItemMenuChange = (e) => {
  //What happens in the Laptop selector
  const selectedItem = items[e.target.selectedIndex]; 
  featureElement.innerText = `${selectedItem.specs}`
  //what happens in the SpecsNBuy section 
  imageElement.src=(`${rootImageUrl}${selectedItem.image}`);
  titleElement.innerText = `${selectedItem.title}`
  specsElement.innerText = `${selectedItem.description}`;
  priceElement.innerText = handleLocalCurrency(selectedItem.price);
  return price = selectedItem.price; 
};

function handleLocalCurrency(number) {
  const localNumber = new Intl.NumberFormat(
    "da-DK",
    { style: "currency", currency: "DKK" },
    { maximumSignificantDigits: 2 }
  ).format(number);
  return localNumber;
}

const handlePay = () => {
  //const requestedPay = prompt("Please enter the amount you wish to pay");
  //legal?
  const change = price - parseFloat(bankBalance);
  if (bankBalance<price){
    alert("Not enough funds")
    alert(`You need: ${change} more`);
  }
  else if (bankBalance>=price) {
    alert("Congratulations you are now the happy owner of ")
    bankBalance=bankBalance-price;
    bankBalanceElement.innerText = `Balance: ${handleLocalCurrency(
      bankBalance
    )}`;

  }
};

const requestLoan = () => {
  const requestedLoanAmount = Number(
    prompt("Please enter the amount you wish to loan")
  );
  if (isNaN(requestedLoanAmount) || requestedLoanAmount < 0) {
    alert("please input a positive number");
  } else if (outstandingDue > 0) {
    alert("Please pay back you current loan in full before acquiring a new");
  } else if (requestedLoanAmount > bankBalance * 2) {
    alert(`Request refused; you have to work more in order to acquire debt!\n You'll need to bank further:
         ${(requestedLoanAmount / 2 - bankBalance).toFixed(2)}`);
  } else {
    bankBalance += requestedLoanAmount;
    bankBalanceElement.innerText = `Balance: ${handleLocalCurrency(
      bankBalance
    )}`;
    outstandingDue += requestedLoanAmount;
    outstandingDueElement.innerText = `Outstanding Due: ${handleLocalCurrency(
      outstandingDue
    )}`;
    //repay loan
    repayLoanButtonElement.style.display="inline"
  }
};

const doWork = () => {
  workBalance += salary;
  workBalanceElement.innerText = `Salary: ${handleLocalCurrency(workBalance)}`;
  //repay loan
};

const doBankEarnings = () => {
  if (outstandingDue > 0) {
    outstandingDue -= workBalance * 0.1;
    workBalance -= workBalance * 0.1;
    outstandingDueElement.innerText = `Outstanding Due: ${handleLocalCurrency(
      outstandingDue
    )}`;
  }
  bankBalance += workBalance;
  workBalance = 0;
  workBalanceElement.innerText = `Salary: ${workBalance}`;
  bankBalanceElement.innerText = `Balance: ${handleLocalCurrency(bankBalance)}`;
};

const repayLoan = () => {
  // can either be more less or exact.
  if (workBalance <= outstandingDue) {
    outstandingDue -= workBalance; //exact
    workBalance = 0;
  } else if (workBalance > outstandingDue) {
    // could possibly be way more elegant
    let payBack = outstandingDue;
    workBalance -= payBack;
    outstandingDue -= payBack;
    doBankEarnings();
  }
  workBalanceElement.innerText = `Salary: ${workBalance}`;
  bankBalanceElement.innerText = `Balance: ${handleLocalCurrency(bankBalance)}`;
  outstandingDueElement.innerText = `Outstanding Due: ${handleLocalCurrency(
    outstandingDue
  )}`;
  if(outstandingDue==0){
    repayLoanButtonElement.style.display="none"

  }

};

itemsElement.addEventListener("change", handleItemMenuChange);
payButtonElement.addEventListener("click", handlePay);
loanButtonElement.addEventListener("click", requestLoan);
doBankEarningsButtonElement.addEventListener("click", doBankEarnings);
doWorkButtonElement.addEventListener("click", doWork);
repayLoanButtonElement.addEventListener("click", repayLoan);
