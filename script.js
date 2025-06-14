const form = document.getElementById('healthForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const age = +document.getElementById('age').value;
  const sex = +document.getElementById('sex').value;
  const bp = +document.getElementById('bp').value;
  const chol = +document.getElementById('chol').value;
  const fbs = +document.getElementById('fbs').value;
  const heartRate = +document.getElementById('heartRate').value;
  const chestPain = +document.getElementById('chestPain').value;

  let risk = 0, factors = [];
  if (age > 50) { risk++; factors.push("Age > 50"); }
  if (sex === 1) { risk++; factors.push("Male"); }
  if (bp > 130) { risk++; factors.push("High BP"); }
  if (chol > 240) { risk++; factors.push("High Cholesterol"); }
  if (fbs === 1) { risk++; factors.push("High Blood Sugar"); }
  if (heartRate < 100) { risk++; factors.push("Low HR"); }
  if (chestPain === 3) { risk++; factors.push("Asymptomatic Chest Pain"); }

  const total = 7;
  const percent = Math.round(risk / total * 100);
  const healthy = 100 - percent;

  resultDiv.innerHTML = (risk >= 4)
    ? `⚠️ <strong>${percent}% risk</strong><br>Factors: ${factors.join(", ")}`
    : `✅ <strong>${percent}% risk</strong><br>You're looking good!`;

  resultDiv.style.color = risk >= 4 ? 'red' : 'green';

  if (window.riskChart) window.riskChart.destroy();
  const ctx = document.getElementById('riskChart').getContext('2d');

  window.riskChart = new Chart(ctx, {
    type: 'pie',
    data: { labels: ['Risk', 'Healthy'], datasets: [{ data: [percent, healthy], backgroundColor: ['#e74c3c','#2ecc71'] }] },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
});