// Unified script with safe event listeners for all calculators
document.addEventListener("DOMContentLoaded", () => {
    const safeAddListener = (id, event, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    };

    // Cue card navigation
    document.querySelectorAll(".calculator-card").forEach(card => {
        card.addEventListener("click", () => {
            const calculatorId = card.getAttribute("data-calculator");
            console.log("Opening calculator:", calculatorId);

            document.getElementById("financial-calculators-title")?.style.setProperty("display", "none");
            document.getElementById("calculators-container")?.style.setProperty("display", "none");
            document.querySelectorAll(".calculator-section").forEach(section => section.style.display = "none");

            const selectedCalculator = document.getElementById(calculatorId);
            if (selectedCalculator) {
                selectedCalculator.style.display = "block";
            } else {
                console.error(`Calculator with id "${calculatorId}" not found.`);
            }
        });
    });

    document.querySelectorAll(".back-to-calculators").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".calculator-section").forEach(section => section.style.display = "none");
            document.getElementById("financial-calculators-title")?.style.setProperty("display", "block");
            document.getElementById("calculators-container")?.style.removeProperty("display");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    // Tax Calculator
    safeAddListener("calculate-tax", "click", () => {
        const income = parseFloat(document.getElementById("income")?.value);
        const taxBrackets = {
            2024: [
                { upper: 14000, rate: 0.105 },
                { upper: 15600, rate: 0.1282 },
                { upper: 48000, rate: 0.175 },
                { upper: 53500, rate: 0.2164 },
                { upper: 70000, rate: 0.30 },
                { upper: 78100, rate: 0.3099 },
                { upper: 180000, rate: 0.33 },
                { upper: Infinity, rate: 0.39 }
            ]
        };
        const accLevyRate = 0.016;
        const year = "2024";
        const brackets = taxBrackets[year];

        if (isNaN(income) || income <= 0) {
            alert("Please enter a valid income.");
            return;
        }

        let totalTax = 0;
        let remainingIncome = income;
        const breakdown = [];

        for (let i = 0; i < brackets.length; i++) {
            const { upper, rate } = brackets[i];
            const lower = brackets[i - 1]?.upper || 0;
            const taxableAmount = Math.min(remainingIncome, upper - lower);

            if (taxableAmount > 0) {
                const tax = taxableAmount * rate;
                breakdown.push({
                    bracket: `$${taxableAmount.toFixed(0)}`,
                    rate: `${(rate * 100).toFixed(2)}%`,
                    tax: `$${tax.toFixed(2)}`
                });
                totalTax += tax;
                remainingIncome -= taxableAmount;
                if (remainingIncome <= 0) break;
            }
        }

        const accLevy = income * accLevyRate;
        const netIncome = income - totalTax - accLevy;

        const resultsTable = document.querySelector("#tax-breakdown tbody");
        if (resultsTable) {
            resultsTable.innerHTML = breakdown.map(row => `
                <tr><td>${row.bracket}</td><td>${row.rate}</td><td>${row.tax}</td></tr>`).join("");
        }

        document.getElementById("total-tax").textContent = `$${totalTax.toFixed(2)}`;
        document.getElementById("acc-levy").textContent = `$${accLevy.toFixed(2)}`;
        document.getElementById("net-income").textContent = `$${netIncome.toFixed(2)}`;
        document.getElementById("net-month").textContent = `$${(netIncome / 12).toFixed(2)}`;
        document.getElementById("net-fortnight").textContent = `$${(netIncome / 26).toFixed(2)}`;
        document.getElementById("net-week").textContent = `$${(netIncome / 52).toFixed(2)}`;

        document.querySelector(".results").style.display = "block";
    });

    // Borrow Calculator
    safeAddListener("calculate-borrow", "click", () => {
        const loanTerm = parseFloat(document.getElementById("loan-term")?.value);
        const interestRate = parseFloat(document.getElementById("interest-rate")?.value) / 100;
        const grossIncome1 = parseFloat(document.getElementById("gross-income-1")?.value) || 0;

        if (!loanTerm || !interestRate || !grossIncome1) {
            alert("Please fill in all required fields with valid values.");
            return;
        }

        const multiplier = 11.14;
        const borrowingCapacity = (grossIncome1 * multiplier) / interestRate;
        const monthlyRate = interestRate / 12;
        const totalPayments = loanTerm * 12;
        const monthlyRepayment =
            borrowingCapacity *
            (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
            (Math.pow(1 + monthlyRate, totalPayments) - 1);

        const totalInterest = monthlyRepayment * totalPayments - borrowingCapacity;

        document.getElementById("borrow-amount").textContent = `$${borrowingCapacity.toFixed(2)}`;
        document.getElementById("monthly-repayment").textContent = `$${monthlyRepayment.toFixed(2)}`;
        document.getElementById("total-interest").textContent = `$${totalInterest.toFixed(2)}`;
        document.getElementById("fortnightly-repayment").textContent = `$${(monthlyRepayment / 2).toFixed(2)}`;
        document.getElementById("weekly-repayment").textContent = `$${(monthlyRepayment / 4.33).toFixed(2)}`;

        document.getElementById("borrow-results").style.display = "block";
    });

    // Savings Calculator
safeAddListener("calculate-savings", "click", () => {
    const savingTerm = parseInt(document.getElementById("savings-term")?.value);
    const initialAmount = parseFloat(document.getElementById("savings-initial-amount")?.value);
    const depositAmount = parseFloat(document.getElementById("savings-deposit-amount")?.value);
    const depositFrequency = document.getElementById("savings-deposit-frequency")?.value;
    const annualInterestRate = parseFloat(document.getElementById("savings-interest-rate")?.value);

    // ❗️Validation
    if (
        isNaN(savingTerm) || savingTerm <= 0 ||
        isNaN(initialAmount) || initialAmount < 0 ||
        isNaN(depositAmount) || depositAmount < 0 ||
        !depositFrequency ||
        isNaN(annualInterestRate) || annualInterestRate < 0
    ) {
        alert("Please fill in all required fields with valid values.");
        return;
    }

    const frequencyMultiplier = {
        weekly: 52,
        fortnightly: 26,
        monthly: 12,
        annually: 1
    };

    const periodsPerYear = frequencyMultiplier[depositFrequency];
    const periods = savingTerm * periodsPerYear;
    const periodicRate = annualInterestRate / 100 / periodsPerYear;

    const futureValueInitial = initialAmount * Math.pow(1 + periodicRate, periods);
    const futureValueDeposits =
        depositAmount * ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate);
    const totalSavings = futureValueInitial + futureValueDeposits;
    const totalDeposited = initialAmount + depositAmount * periods;
    const totalInterest = totalSavings - totalDeposited;

    document.getElementById("total-amount").textContent = `$${totalSavings.toFixed(2)}`;
    document.getElementById("total-deposited").textContent = `$${totalDeposited.toFixed(2)}`;
    document.getElementById("savings-total-interest").textContent = `$${totalInterest.toFixed(2)}`;

    document.getElementById("savings-results").style.display = "block";
});


    // Loan Comparison Calculator
safeAddListener("calculate-loans", "click", () => {
    const loanAmount = parseFloat(document.getElementById("loan-amount")?.value);

    const loanATerm = parseInt(document.getElementById("loan-a-term")?.value);
    const loanARate = parseFloat(document.getElementById("loan-a-rate")?.value);
    const loanAFrequency = document.getElementById("loan-a-frequency")?.value;

    const loanBTerm = parseInt(document.getElementById("loan-b-term")?.value);
    const loanBRate = parseFloat(document.getElementById("loan-b-rate")?.value);
    const loanBFrequency = document.getElementById("loan-b-frequency")?.value;

    // ✅ Full validation
    if (
        isNaN(loanAmount) || loanAmount <= 0 ||
        isNaN(loanATerm) || loanATerm <= 0 ||
        isNaN(loanARate) || loanARate < 0 ||
        !loanAFrequency ||
        isNaN(loanBTerm) || loanBTerm <= 0 ||
        isNaN(loanBRate) || loanBRate < 0 ||
        !loanBFrequency
    ) {
        alert("Please fill in all loan details correctly before calculating.");
        return;
    }

    const frequencyMultiplier = {
        weekly: 52,
        fortnightly: 26,
        monthly: 12
    };

    const calculatePayment = (principal, annualRate, termYears, frequency) => {
        const periodsPerYear = frequencyMultiplier[frequency];
        const totalPeriods = termYears * periodsPerYear;
        const periodicRate = annualRate / 100 / periodsPerYear;

        return periodicRate === 0
            ? principal / totalPeriods
            : (principal * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
              (Math.pow(1 + periodicRate, totalPeriods) - 1);
    };

    const calculateTotalCost = (payment, term, frequency) =>
        payment * term * frequencyMultiplier[frequency];

    const loanAPayment = calculatePayment(loanAmount, loanARate, loanATerm, loanAFrequency);
    const loanATotal = calculateTotalCost(loanAPayment, loanATerm, loanAFrequency);

    const loanBPayment = calculatePayment(loanAmount, loanBRate, loanBTerm, loanBFrequency);
    const loanBTotal = calculateTotalCost(loanBPayment, loanBTerm, loanBFrequency);

    document.getElementById("loan-a-periodic").textContent = `$${loanAPayment.toFixed(2)}`;
    document.getElementById("loan-a-total").textContent = `$${loanATotal.toFixed(2)}`;
    document.getElementById("loan-b-periodic").textContent = `$${loanBPayment.toFixed(2)}`;
    document.getElementById("loan-b-total").textContent = `$${loanBTotal.toFixed(2)}`;

    const savings = Math.abs(loanATotal - loanBTotal).toFixed(2);
    const cheaper = loanATotal < loanBTotal ? "Loan A" : "Loan B";
    document.getElementById("loan-summary").textContent =
        `${cheaper} will save you $${savings} over the other loan.`;

    document.getElementById("loan-results").style.display = "block";
});

});



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
    if (window.location.pathname.includes("resources-keydates")) {
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

