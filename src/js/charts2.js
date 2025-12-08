/******************************************************************************
 * chart2.js
 *
 * line chart
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import Chart from 'chart.js/auto';
import { selectRecords } from "./data";

/******************************************************************************
 * constants
 *****************************************************************************/
const ctx = document.getElementById('chart2');

export async function drawChart2() {
  const productSales = await selectRecords('vw_revenue_by_month', 'month', 'year', '2025');
  const data = productSales.map(product => product.total_cost);
  const labels = productSales.map(product => product.label);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
    }
  });
}
