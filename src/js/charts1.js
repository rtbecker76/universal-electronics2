/******************************************************************************
 * chart1.js
 *
 * bar chart
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import Chart from 'chart.js/auto';
import { selectRecords } from "./data";

/******************************************************************************
 * constants
 *****************************************************************************/
const ctx = document.getElementById('chart1');

export async function drawChart1() {
    const inventory = await selectRecords('products', 'product_id');
    const data = inventory.map(product => product.in_stock);
    const labels = inventory.map(product => product.product_name);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'In Stock',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

