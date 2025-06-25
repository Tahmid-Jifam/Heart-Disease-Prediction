document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('healthForm');
  const resultDiv = document.getElementById('result');
  const riskIndicator = document.getElementById('riskIndicator');
  const riskText = document.getElementById('riskText');
  const riskDetails = document.getElementById('riskDetails');
  let riskChart;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const sex = parseInt(document.getElementById('sex').value);
    const bp = parseInt(document.getElementById('bp').value);
    const chol = parseInt(document.getElementById('chol').value);
    const fbs = parseInt(document.getElementById('fbs').value);
    const heartRate = parseInt(document.getElementById('heartRate').value);
    const chestPain = parseInt(document.getElementById('chestPain').value);
    
    // Calculate risk (simplified algorithm for demonstration)
    let riskScore = 0;
    
    // Age factor
    if (age > 60) riskScore += 25;
    else if (age > 45) riskScore += 15;
    else if (age > 30) riskScore += 5;
    
    // Gender factor
    if (sex === 1) riskScore += 10; // Male
    
    // Blood pressure factor
    if (bp > 140) riskScore += 20;
    else if (bp > 120) riskScore += 10;
    
    // Cholesterol factor
    if (chol > 240) riskScore += 20;
    else if (chol > 200) riskScore += 10;
    
    // Fasting blood sugar factor
    if (fbs === 1) riskScore += 10;
    
    // Heart rate factor
    if (heartRate > 180 || heartRate < 100) riskScore += 10;
    
    // Chest pain factor
    if ([0, 1, 6].includes(chestPain)) riskScore += 15;
    else if ([4, 7].includes(chestPain)) riskScore += 10;
    else if (chestPain === 9) riskScore += 20;
    
    // Cap the risk score at 100
    riskScore = Math.min(riskScore, 100);
    
    // Display results
    resultDiv.classList.remove('hidden');
    
    // Smooth scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Update risk indicator
    riskIndicator.style.width = `${riskScore}%`;
    
    // Set color based on risk
    if (riskScore < 30) {
      riskIndicator.style.backgroundColor = '#2ecc71'; // Green
      riskText.textContent = 'Low Risk';
      riskText.style.color = '#2ecc71';
    } else if (riskScore < 60) {
      riskIndicator.style.backgroundColor = '#f39c12'; // Yellow/Orange
      riskText.textContent = 'Moderate Risk';
      riskText.style.color = '#f39c12';
    } else {
      riskIndicator.style.backgroundColor = '#e74c3c'; // Red
      riskText.textContent = 'High Risk';
      riskText.style.color = '#e74c3c';
    }
    
    // Generate risk details
    let details = '';
    
    if (age > 45) {
      details += `<div class="risk-item">
        <span class="risk-icon">⚠️</span>
        <p>Age is a significant risk factor. Risk increases with age, particularly after 45.</p>
      </div>`;
    }
    
    if (sex === 1) {
      details += `<div class="risk-item">
        <span class="risk-icon">⚠️</span>
        <p>Men generally have a higher risk of heart disease than women before menopause.</p>
      </div>`;
    }
    
    if (bp > 120) {
      details += `<div class="risk-item">
        <span class="risk-icon">⚠️</span>
        <p>Your blood pressure is ${bp > 140 ? 'high' : 'elevated'}. High blood pressure can damage arteries.</p>
      </div>`;
    }
    
    if (chol > 200) {
      details += `<div class="risk-item">
        <span class="risk-icon">⚠️</span>
        <p>Your cholesterol level is ${chol > 240 ? 'high' : 'borderline high'}. High cholesterol can lead to plaque buildup.</p>
      </div>`;
    }
    
    if (fbs === 1) {
      details += `<div class="risk-item">
        <span class="risk-icon">⚠️</span>
        <p>Elevated blood sugar levels can damage blood vessels and the nerves that control your heart.</p>
      </div>`;
    }
    
    if (heartRate < 100 || heartRate > 180) {
      details += `<div class="risk-item">
        <span class="risk-icon">⚠️</span>
        <p>Your maximum heart rate is ${heartRate < 100 ? 'lower' : 'higher'} than the typical range, which may indicate cardiovascular issues.</p>
      </div>`;
    }
    
    if ([0, 1, 6, 9].includes(chestPain)) {
      details += `<div class="risk-item">
        <span class="risk-icon">⚠️</span>
        <p>The type of chest pain you're experiencing is associated with increased heart disease risk.</p>
      </div>`;
    }
    
    if (details === '') {
      details = `<div class="risk-item">
        <span class="risk-icon" style="color: #2ecc71;">✓</span>
        <p>Your risk factors appear to be within normal ranges. Continue maintaining a healthy lifestyle.</p>
      </div>`;
    }
    
    riskDetails.innerHTML = details;
    
    // Create or update chart
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    // Prepare data for chart
    const labels = ['Age', 'Gender', 'Blood Pressure', 'Cholesterol', 'Blood Sugar', 'Heart Rate', 'Chest Pain'];
    
    // Calculate individual risk contributions
    const ageRisk = age > 60 ? 25 : (age > 45 ? 15 : (age > 30 ? 5 : 0));
    const sexRisk = sex === 1 ? 10 : 0;
    const bpRisk = bp > 140 ? 20 : (bp > 120 ? 10 : 0);
    const cholRisk = chol > 240 ? 20 : (chol > 200 ? 10 : 0);
    const fbsRisk = fbs === 1 ? 10 : 0;
    const hrRisk = (heartRate > 180 || heartRate < 100) ? 10 : 0;
    
    let cpRisk = 0;
    if ([0, 1, 6].includes(chestPain)) cpRisk = 15;
    else if ([4, 7].includes(chestPain)) cpRisk = 10;
    else if (chestPain === 9) cpRisk = 20;
    
    const data = [ageRisk, sexRisk, bpRisk, cholRisk, fbsRisk, hrRisk, cpRisk];
    
    // Destroy previous chart if it exists
    if (riskChart) {
      riskChart.destroy();
    }
    
    // Create new chart
    riskChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Risk Contribution',
          data: data,
          backgroundColor: [
            'rgba(231, 76, 60, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(241, 196, 15, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(230, 126, 34, 0.7)',
            'rgba(149, 165, 166, 0.7)'
          ],
          borderColor: [
            'rgba(231, 76, 60, 1)',
            'rgba(52, 152, 219, 1)',
            'rgba(241, 196, 15, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(230, 126, 34, 1)',
            'rgba(149, 165, 166, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 25,
            title: {
              display: true,
              text: 'Risk Points'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Risk points: ${context.raw}`;
              }
            }
          }
        }
      }
    });
    
    // Add recommendations based on risk level
    let recommendations = '<div class="mt-4"><h3>Recommendations</h3><ul class="mt-2">';
    
    if (riskScore >= 60) {
      recommendations += `
        <li>Consult with a healthcare provider as soon as possible</li>
        <li>Monitor your blood pressure regularly</li>
        <li>Consider dietary changes to reduce cholesterol and blood pressure</li>
        <li>Increase physical activity as recommended by your doctor</li>
        <li>If you smoke, consider a smoking cessation program</li>
      `;
    } else if (riskScore >= 30) {
      recommendations += `
        <li>Schedule a check-up with your healthcare provider</li>
        <li>Review your diet and consider reducing sodium and saturated fat</li>
        <li>Aim for at least 150 minutes of moderate exercise weekly</li>
        <li>Limit alcohol consumption</li>
        <li>Practice stress management techniques</li>
      `;
    } else {
      recommendations += `
        <li>Continue regular health check-ups</li>
        <li>Maintain a balanced diet rich in fruits and vegetables</li>
        <li>Stay physically active</li>
        <li>Get adequate sleep</li>
        <li>Manage stress through relaxation techniques</li>
      `;
    }
    
    recommendations += '</ul></div>';
    
    // Add recommendations to the risk details
    riskDetails.innerHTML += recommendations;
  });
  
  // Add form validation and input formatting
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach(input => {
    input.addEventListener('input', function() {
      // Ensure the value is within min-max range
      const min = parseInt(this.getAttribute('min'));
      const max = parseInt(this.getAttribute('max'));
      
      if (this.value !== '') {
        if (parseInt(this.value) < min) this.value = min;
        if (parseInt(this.value) > max) this.value = max;
      }
    });
  });
});