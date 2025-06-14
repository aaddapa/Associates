// document.addEventListener("DOMContentLoaded", () => {
//     // Event listener for cue cards
//     document.querySelectorAll(".calculator-card").forEach(card => {
//         card.addEventListener("click", () => {
//             const calculatorId = card.getAttribute("data-calculator"); // Get the calculator ID
//             console.log("Opening calculator:", calculatorId);

//             // Hide all cue cards and calculator sections
//             document.getElementById("financial-calculators-title").style.display = "none";

//             document.getElementById("calculators-container").style.display = "none";
//             document.querySelectorAll(".calculator-section").forEach(section => {
//                 section.style.display = "none";
//             });

//             // Show the selected calculator
//             const selectedCalculator = document.getElementById(calculatorId);
//             if (selectedCalculator) {
//                 selectedCalculator.style.display = "block";
//             } else {
//                 console.error(`Calculator with id "${calculatorId}" not found.`);
//             }
//         });
//     });

//     // Event listener for "Back to Calculators" buttons
//     document.querySelectorAll(".back-to-calculators").forEach(button => {
//         button.addEventListener("click", () => {
//             // Hide all calculators
//             document.querySelectorAll(".calculator-section").forEach(section => {
//                 section.style.display = "none";
//             });

//             // Show the cue cards
//             document.getElementById("financial-calculators-title").style.display = "block";

//             document.getElementById("calculators-container").style.display = "flex";
//         });
//     });

//   // Tax brackets
//   const taxBrackets = {
//     2024: [
//         { upper: 14000, rate: 0.105 },
//         { upper: 15600, rate: 0.1282 },
//         { upper: 48000, rate: 0.175 },
//         { upper: 53500, rate: 0.2164 },
//         { upper: 70000, rate: 0.30 },
//         { upper: 78100, rate: 0.3099 },
//         { upper: 180000, rate: 0.33 },
//         { upper: Infinity, rate: 0.39 }
//     ]
// };

// // ACC Earners' Levy rate
// const accLevyRate = 0.016; // 1.6%

// // Calculate tax logic

// document.getElementById("calculate-tax").addEventListener("click", () => {
//     const income = parseFloat(document.getElementById("income").value);
//     const year = "2024"; // Fixed for now
//     const brackets = taxBrackets[year];

//     if (isNaN(income) || income <= 0) {
//         alert("Please enter a valid income.");
//         return;
//     }

//     let totalTax = 0;
//     let remainingIncome = income;
//     const breakdown = [];

//     // Calculate tax per bracket
//     for (let i = 0; i < brackets.length; i++) {
//         const { upper, rate } = brackets[i];
//         const lower = brackets[i - 1]?.upper || 0; // Lower bound of the bracket
//         const taxableAmount = Math.min(remainingIncome, upper - lower);

//         if (taxableAmount > 0) {
//             const tax = taxableAmount * rate;

//             breakdown.push({
//                 bracket: `$${taxableAmount.toFixed(0)}`, // Only the exact amount is displayed
//                 rate: `${(rate * 100).toFixed(2)}%`,
//                 tax: `$${tax.toFixed(2)}`
//             });

//             totalTax += tax;
//             remainingIncome -= taxableAmount;

//             if (remainingIncome <= 0) break;
//         }
//     }

//     // Calculate ACC Earners' Levy
//     const accLevy = income * accLevyRate;

//     // Calculate Net Income
//     const netIncome = income - totalTax - accLevy;

//     // Calculate Net Income per Month, Fortnight, and Week
//     const netIncomePerMonth = netIncome / 12;
//     const netIncomePerFortnight = netIncome / 26;
//     const netIncomePerWeek = netIncome / 52;

//     // Populate Results Table
//     const resultsTable = document.querySelector("#tax-breakdown tbody");
//     resultsTable.innerHTML = breakdown
//         .map(row => `<tr><td>${row.bracket}</td><td>${row.rate}</td><td>${row.tax}</td></tr>`)
//         .join("");

//     // Update totals
//     document.getElementById("total-tax").textContent = `$${totalTax.toFixed(2)}`;
//     document.getElementById("acc-levy").textContent = `$${accLevy.toFixed(2)}`;
//     document.getElementById("net-income").textContent = `$${netIncome.toFixed(2)}`;
//     document.getElementById("net-month").textContent = `$${netIncomePerMonth.toFixed(2)}`;
//     document.getElementById("net-fortnight").textContent = `$${netIncomePerFortnight.toFixed(2)}`;
//     document.getElementById("net-week").textContent = `$${netIncomePerWeek.toFixed(2)}`;

//     // Show results section
//     document.querySelector(".results").style.display = "block";
// });
// });

// document.addEventListener("DOMContentLoaded", () => {
//     // Event listener for "Calculate" button
//     document.getElementById("calculate-borrow").addEventListener("click", () => {
//         // Get input values
//         const loanTerm = parseFloat(document.getElementById("loan-term").value); // in years
//         const interestRate = parseFloat(document.getElementById("interest-rate").value) / 100; // Convert to decimal
//         const grossIncome1 = parseFloat(document.getElementById("gross-income-1").value) || 0; // Annual income

//         if (!loanTerm || !interestRate || !grossIncome1) {
//             alert("Please fill in all required fields with valid values.");
//             return;
//         }

//         // Borrowing Capacity
//         const multiplier = 11.14; // Multiplier for a 30-year loan
//         const borrowingCapacity = (grossIncome1 * multiplier) / interestRate;

//         // Monthly Repayment Calculation
//         const monthlyRate = interestRate / 12; // Monthly interest rate
//         const totalPayments = loanTerm * 12; // Total number of payments (in months)
//         const monthlyRepayment =
//             borrowingCapacity *
//             (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
//             (Math.pow(1 + monthlyRate, totalPayments) - 1);

//         // Total Interest Payable
//         const totalInterest = monthlyRepayment * totalPayments - borrowingCapacity;

//         // Fortnightly and Weekly Repayments
//         const fortnightlyRepayment = monthlyRepayment / 2;
//         const weeklyRepayment = monthlyRepayment / 4.33;

//         // Display Results
//         document.getElementById("borrow-amount").textContent = `$${borrowingCapacity.toFixed(2)}`;
//         document.getElementById("monthly-repayment").textContent = `$${monthlyRepayment.toFixed(2)}`;
//         document.getElementById("total-interest").textContent = `$${totalInterest.toFixed(2)}`;
//         document.getElementById("fortnightly-repayment").textContent = `$${fortnightlyRepayment.toFixed(2)}`;
//         document.getElementById("weekly-repayment").textContent = `$${weeklyRepayment.toFixed(2)}`;

//         // Show the results section
//         document.getElementById("borrow-results").style.display = "block";
//     });

//     // Event listener for "Back to Calculators" button
//     document.querySelector(".back-to-calculators").addEventListener("click", () => {
//         // Hide the current calculator and results
//         document.querySelector("#borrow-calculator").style.display = "none";
//         document.querySelector("#borrow-results").style.display = "none";

//         // Show the calculator cards
//         document.getElementById("calculators-container").style.display = "flex";
//         document.getElementById("financial-calculators-title").style.display = "block";
//     });
// });

// document.addEventListener("DOMContentLoaded", () => {
//     // Event listener for "Calculate" button
//     document.getElementById("calculate-savings").addEventListener("click", () => {
//         // Get input values for the Savings Calculator
//         const savingTerm = parseInt(document.getElementById("savings-term").value); // in years
//         const initialAmount = parseFloat(document.getElementById("savings-initial-amount").value) || 0;
//         const depositAmount = parseFloat(document.getElementById("savings-deposit-amount").value) || 0;
//         const depositFrequency = document.getElementById("savings-deposit-frequency").value;
//         const annualInterestRate = parseFloat(document.getElementById("savings-interest-rate").value) / 100 || 0;

//         // Validate inputs
//         if (isNaN(savingTerm) || savingTerm <= 0) {
//             alert("Please enter a valid saving term.");
//             return;
//         }
//         if (isNaN(initialAmount) || initialAmount < 0) {
//             alert("Please enter a valid initial amount.");
//             return;
//         }
//         if (isNaN(depositAmount) || depositAmount < 0) {
//             alert("Please enter a valid deposit amount.");
//             return;
//         }
//         if (isNaN(annualInterestRate) || annualInterestRate < 0) {
//             alert("Please enter a valid interest rate.");
//             return;
//         }

//         // Frequency multipliers
//         const frequencyMultiplier = {
//             weekly: 52,
//             fortnightly: 26,
//             monthly: 12,
//             annually: 1,
//         };

//         const periodsPerYear = frequencyMultiplier[depositFrequency];
//         if (!periodsPerYear) {
//             alert("Please select a valid deposit frequency.");
//             return;
//         }

//         const periods = savingTerm * periodsPerYear;
//         const periodicRate = annualInterestRate / periodsPerYear;

//         // Calculate compound interest
//         let futureValueInitial = initialAmount * Math.pow(1 + periodicRate, periods);
//         let futureValueDeposits =
//             depositAmount * ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate);
//         const totalSavings = futureValueInitial + futureValueDeposits;
//         const totalDeposited = initialAmount + depositAmount * periods;
//         const totalInterest = totalSavings - totalDeposited;
//         console.log(totalInterest)

//         // Update results
//         document.getElementById("total-amount").textContent = `$${totalSavings.toFixed(2)}`;
//         document.getElementById("total-deposited").textContent = `$${totalDeposited.toFixed(2)}`;
//         document.getElementById("savings-total-interest").textContent = `$${totalInterest.toFixed(2)}`;

//         // Show results section
//         document.getElementById("savings-results").style.display = "block";
//     });
// });

// document.getElementById("calculate-loans").addEventListener("click", () => {
//     // Retrieve loan amount
//     const loanAmount = parseFloat(document.getElementById("loan-amount").value);

//     // Frequency multiplier (number of payments per year)
//     const frequencyMultiplier = {
//         weekly: 52,
//         fortnightly: 26,
//         monthly: 12,
//     };

//     // Function to calculate periodic payments
//     const calculatePayment = (principal, annualRate, termYears, frequency) => {
//         const periodsPerYear = frequencyMultiplier[frequency];
//         const totalPeriods = termYears * periodsPerYear;
//         const periodicRate = annualRate / 100 / periodsPerYear;

//         if (periodicRate === 0) {
//             return principal / totalPeriods; // No interest case
//         }

//         return (
//             (principal * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
//             (Math.pow(1 + periodicRate, totalPeriods) - 1)
//         );
//     };

//     // Function to calculate total loan cost
//     const calculateTotalCost = (periodicPayment, termYears, frequency) => {
//         const totalPeriods = termYears * frequencyMultiplier[frequency];
//         return periodicPayment * totalPeriods;
//     };

//     // Loan A details
//     const loanATerm = parseInt(document.getElementById("loan-a-term").value);
//     const loanARate = parseFloat(document.getElementById("loan-a-rate").value);
//     const loanAFrequency = document.getElementById("loan-a-frequency").value;

//     // Loan B details
//     const loanBTerm = parseInt(document.getElementById("loan-b-term").value);
//     const loanBRate = parseFloat(document.getElementById("loan-b-rate").value);
//     const loanBFrequency = document.getElementById("loan-b-frequency").value;

//     // Validate inputs
//     if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(loanARate) || isNaN(loanBRate)) {
//         alert("Please enter valid values.");
//         return;
//     }

//     // Calculate periodic payments and total costs
//     const loanAPayment = calculatePayment(loanAmount, loanARate, loanATerm, loanAFrequency);
//     const loanATotal = calculateTotalCost(loanAPayment, loanATerm, loanAFrequency);

//     const loanBPayment = calculatePayment(loanAmount, loanBRate, loanBTerm, loanBFrequency);
//     const loanBTotal = calculateTotalCost(loanBPayment, loanBTerm, loanBFrequency);

//     // Display results
//     document.getElementById("loan-a-periodic").textContent = `$${loanAPayment.toFixed(2)}`;
//     document.getElementById("loan-a-total").textContent = `$${loanATotal.toFixed(2)}`;

//     document.getElementById("loan-b-periodic").textContent = `$${loanBPayment.toFixed(2)}`;
//     document.getElementById("loan-b-total").textContent = `$${loanBTotal.toFixed(2)}`;

//     // Summary
//     const savings = Math.abs(loanATotal - loanBTotal).toFixed(2);
//     const cheaperLoan = loanATotal < loanBTotal ? "Loan A" : "Loan B";
//     document.getElementById(
//         "loan-summary"
//     ).textContent = `${cheaperLoan} will save you $${savings} over the other loan.`;

//     // Show results
//     document.getElementById("loan-results").style.display = "block";
// });

window.onload = function () {
  console.log("Page fully loaded");
};

function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
        mobileMenu.classList.remove('show');
        hamburger.classList.remove('active');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("resources-keydates.html")) {
        fetch("../data.json")
            .then(res => res.json())
            .then(data => {
                const months = data.data;
                const monthsContainer = document.getElementById("months-container");
                const keyDatesContainer = document.getElementById("key-dates-container");
                const backButtonContainer = document.getElementById("back-button-container");
                const backButton = document.getElementById("back-button");

                months.forEach(month => {
                    const card = document.createElement("div");
                    card.className = "month-card cue";

                    const label = document.createElement("div");
                    label.textContent = month.month.slice(0, 3).toUpperCase();
                    card.appendChild(label);

                    card.addEventListener("click", () => {
                        renderKeyDates(month);
                        monthsContainer.style.display = "none";
                        keyDatesContainer.style.display = "block";
                        backButtonContainer.style.display = "block";
                        document.getElementById("month-header").style.display = "none";

                    });

                    monthsContainer.appendChild(card);
                });

                backButton.addEventListener("click", () => {
                    keyDatesContainer.innerHTML = "";
                    monthsContainer.style.display = "grid";
                    keyDatesContainer.style.display = "none";
                    backButtonContainer.style.display = "none";
                    document.getElementById("month-header").style.display = "block"; 
                });

function renderKeyDates(month) {
    const title = `<h3>${month.month}</h3>`;

    if (!month.key_dates || month.key_dates.length === 0) {
        keyDatesContainer.innerHTML = `
            ${title}
            <p style="text-align: center; margin-top: 20px; font-style: italic; color: #666;">
                There are no key dates for this month at the moment. Please check back later.
            </p>
        `;
        return;
    }

    const tableStart = `
        <table class="key-dates-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
    `;
    const rows = month.key_dates.map(item => `
        <tr>
            <td>${item.date}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
        </tr>
    `).join('');
    const tableEnd = `</tbody></table>`;
    keyDatesContainer.innerHTML = title + tableStart + rows + tableEnd;
}

            })
            .catch(err => console.error("Error loading key dates:", err));
    }
});

