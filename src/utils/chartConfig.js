export const pieChartConfig = {
  colors: ['#0d6efd', '#198754'],
  height: '400px',
  width: '100%',
  library: {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }
}

export const formatChartData = (transactions, sales) => {
  const transactionsCount = transactions?.length || 0
  const salesCount = sales?.length || 0
  
  return [
    ['Transacciones', transactionsCount],
    ['Ventas', salesCount]
  ]
}