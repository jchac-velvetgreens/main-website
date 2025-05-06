let chart;
let currentIndex = 0;
let allData = [];

// Load data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Clean data: filter out entries with invalid timestamps
    allData = data.filter(d => d.timestamp && !isNaN(new Date(d.timestamp)));

    // Create chart
    const ctx = document.getElementById('timelineChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Value',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.3,
          },
          {
            label: 'Smooth',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.3,
          }
        ]
      },
      options: {
        animation: {
          duration: 125,
          easing: 'easeOutQuad'
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'HH:mm',
              displayFormats: {
                minute: 'HH:mm'
              }
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Values'
            }
          }
        }
      }
    });

    // Start animation
    animateNextPoint();
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

function animateNextPoint() {
  const interval = setInterval(() => {
    if (currentIndex >= allData.length) {
      clearInterval(interval);
      return;
    }

    const point = allData[currentIndex];
    const ts = point.timestamp;

    if (!ts || isNaN(new Date(ts))) {
      console.warn(`Skipping invalid timestamp at index ${currentIndex}:`, ts);
      currentIndex++;
      return;
    }

    chart.data.datasets[0].data.push({ x: ts, y: point.value });
    chart.data.datasets[1].data.push({ x: ts, y: point.smooth });

    chart.update();
    currentIndex++;
  }, 125);
}
