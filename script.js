document.addEventListener("DOMContentLoaded", () => {
    // Event listener for cue cards
    document.querySelectorAll(".calculator-card").forEach(card => {
        card.addEventListener("click", () => {
            const calculatorId = card.getAttribute("data-calculator"); // Get the calculator ID
            console.log("Opening calculator:", calculatorId);

            // Hide all cue cards and calculator sections
            document.getElementById("financial-calculators-title").style.display = "none";

            document.getElementById("calculators-container").style.display = "none";
            document.querySelectorAll(".calculator-section").forEach(section => {
                section.style.display = "none";
            });

            // Show the selected calculator
            const selectedCalculator = document.getElementById(calculatorId);
            if (selectedCalculator) {
                selectedCalculator.style.display = "block";
            } else {
                console.error(`Calculator with id "${calculatorId}" not found.`);
            }
        });
    });

    // Event listener for "Back to Calculators" buttons
    document.querySelectorAll(".back-to-calculators").forEach(button => {
        button.addEventListener("click", () => {
            // Hide all calculators
            document.querySelectorAll(".calculator-section").forEach(section => {
                section.style.display = "none";
            });

            // Show the cue cards
            document.getElementById("financial-calculators-title").style.display = "block";

            document.getElementById("calculators-container").style.display = "flex";
        });
    });

  // Tax brackets
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

// ACC Earners' Levy rate
const accLevyRate = 0.016; // 1.6%

// Calculate tax logic

document.getElementById("calculate-tax").addEventListener("click", () => {
    const income = parseFloat(document.getElementById("income").value);
    const year = "2024"; // Fixed for now
    const brackets = taxBrackets[year];

    if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income.");
        return;
    }

    let totalTax = 0;
    let remainingIncome = income;
    const breakdown = [];

    // Calculate tax per bracket
    for (let i = 0; i < brackets.length; i++) {
        const { upper, rate } = brackets[i];
        const lower = brackets[i - 1]?.upper || 0; // Lower bound of the bracket
        const taxableAmount = Math.min(remainingIncome, upper - lower);

        if (taxableAmount > 0) {
            const tax = taxableAmount * rate;

            breakdown.push({
                bracket: `$${taxableAmount.toFixed(0)}`, // Only the exact amount is displayed
                rate: `${(rate * 100).toFixed(2)}%`,
                tax: `$${tax.toFixed(2)}`
            });

            totalTax += tax;
            remainingIncome -= taxableAmount;

            if (remainingIncome <= 0) break;
        }
    }

    // Calculate ACC Earners' Levy
    const accLevy = income * accLevyRate;

    // Calculate Net Income
    const netIncome = income - totalTax - accLevy;

    // Calculate Net Income per Month, Fortnight, and Week
    const netIncomePerMonth = netIncome / 12;
    const netIncomePerFortnight = netIncome / 26;
    const netIncomePerWeek = netIncome / 52;

    // Populate Results Table
    const resultsTable = document.querySelector("#tax-breakdown tbody");
    resultsTable.innerHTML = breakdown
        .map(row => `<tr><td>${row.bracket}</td><td>${row.rate}</td><td>${row.tax}</td></tr>`)
        .join("");

    // Update totals
    document.getElementById("total-tax").textContent = `$${totalTax.toFixed(2)}`;
    document.getElementById("acc-levy").textContent = `$${accLevy.toFixed(2)}`;
    document.getElementById("net-income").textContent = `$${netIncome.toFixed(2)}`;
    document.getElementById("net-month").textContent = `$${netIncomePerMonth.toFixed(2)}`;
    document.getElementById("net-fortnight").textContent = `$${netIncomePerFortnight.toFixed(2)}`;
    document.getElementById("net-week").textContent = `$${netIncomePerWeek.toFixed(2)}`;

    // Show results section
    document.querySelector(".results").style.display = "block";
});
});
