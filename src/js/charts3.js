/******************************************************************************
 * chart3.js
 *
 * pie chart
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import Chart from 'chart.js/auto';
import { selectRecords } from "./data";

/******************************************************************************
 * constants
 *****************************************************************************/
const ctx = document.getElementById('chart3');

export async function drawChart3() {
  const productSales = await selectRecords('vw_revenue_by_product', 'product_id');
  const data = productSales.map(product => product.total_cost);
  const labels = productSales.map(product => product.product_name);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: data,
        backgroundColor: ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
    }
  });
}
