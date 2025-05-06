fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    const chartData = {
      labels: [],
      datasets: [{
        label: 'Sensor Value',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }]
    };

    const config = {
      type: 'line',
      data: chartData,
      options: {
        animation: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const myChart = new Chart(ctx, config);

    // Animate by interval
    let i = 0;
    const interval = setInterval(() => {
      if (i >= data.length) {
        clearInterval(interval);
        return;
      }

      const point = data[i];
      chartData.labels.push(new Date(point.timestamp));
      chartData.datasets[0].data.push(point.value);
      myChart.update();

      i++;
    }, 300); // Adjust speed (300ms per point)
  });
