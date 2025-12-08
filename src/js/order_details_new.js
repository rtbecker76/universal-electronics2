/******************************************************************************
* order_details_new.js
 *
 * order details functionality (on the customer orders screen)
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { initializeGrid, addRow, removeRow, clearGrid } from "./grid";
import { insertRecord } from "./data";
import { refreshOrdersHistoryGrid } from "./orders_history";
import { clearOrderDetailsHistoryGrid } from "./order_details_history";

/******************************************************************************
 * constants
 *****************************************************************************/
const orderTotalCost = document.getElementById('order-total-cost');
const purchaseButton = document.getElementById('purchase-button');
const purchaseDialog = document.getElementById('purchase-dialog');
const purchaseMessage = document.getElementById('purchase-message');
const purchaseCancelButton = document.getElementById('purchase-cancel-button');
const purchaseSubmitButton = document.getElementById('purchase-submit-button');

/******************************************************************************
 * event listeners
 *****************************************************************************/
purchaseButton.addEventListener('click', confirmPurchase);
purchaseCancelButton.addEventListener('click', () => { purchaseDialog.close(); });
purchaseSubmitButton.addEventListener('click', finalizePurchase);

/******************************************************************************
 * variables
 *****************************************************************************/
let orderDetailsNewGrid = null;
let current_order_detail_id = 1;
let total = 0;

/******************************************************************************
 * iconCellRenderer
 *****************************************************************************/
function iconCellRenderer() {
  const div = document.createElement('div');
  div.style.color = 'red';
  div.classList.add('fa', 'fa-trash');
  div.style.fontSize = '20px';
  div.style.height = '40px';
  div.style.lineHeight = '40px';
  return div;
}

/******************************************************************************
 * currencyFormatter
 *****************************************************************************/
function currencyFormatter(params) {
  if (params.value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value);
  } else {
    return '';
  }
}

/******************************************************************************
 * removeOrderDetailRow
 * 
 * description:
 *   removes the currently selected order details row
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function removeOrderDetailRow(event) {
  if (event.node.data.quantity > 1) {
    const newQty = event.node.data.quantity - 1;
    event.node.setDataValue('cost', event.node.data.price * newQty);
    event.node.setDataValue('quantity', newQty);
  } else {
    removeRow(orderDetailsNewGrid, [event.node.data]);
  }
  calcTotalCost();
}

/******************************************************************************
 * addOrderDetailsRow
 * 
 * description:
 *   adds a new order details row
 *
 * parameters:
 *   data (object) - the orders data from the currently selected row
 *
 * returns: none
 *
 *****************************************************************************/
export function addOrderDetailsRow(data) {
  let foundNode = null;
  // see if the product has already been added
  orderDetailsNewGrid.forEachNode(rowNode => {
    if (rowNode.data && rowNode.data.product_id === data.product_id) {
      foundNode = rowNode;
      rowNode.setSelected(true);
    }
  });
  // if so, just increment the quantity and cost
  if (foundNode) {
    const newQty = foundNode.data.quantity + 1;
    foundNode.setDataValue('cost', data.price * newQty);
    foundNode.setDataValue('quantity', newQty);
  } else {
    // otherwise add the item
    current_order_detail_id++;
    const newRow = {
      product_id: data.product_id,
      product_name: data.product_name,
      quantity: 1,
      price: data.price,
      cost: data.price,
      order_detail_id: current_order_detail_id,
    }
    addRow(orderDetailsNewGrid, newRow);
  }
  calcTotalCost();
}

/******************************************************************************
 * calcTotalCost
 * 
 * description:
 *   calculate the total cost of an order
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function calcTotalCost() {
  total = 0;
  orderDetailsNewGrid.forEachNode(rowNode => {
    total += rowNode.data.cost;
  });
  orderTotalCost.textContent = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(total);
  purchaseButton.disabled = (total == 0);
}

/******************************************************************************
 * confirmPurchase
 * 
 * description:
 *   prompt the customer to confirm their purchase
 *
 * parameters: none
 *
 * returns: none
 *
 * *****************************************************************************/
function confirmPurchase() {
  purchaseMessage.textContent = 'Please confirm the purchase of items totaling ' + orderTotalCost.textContent;
  purchaseDialog.showModal();
}

/******************************************************************************
 * finalizePurchase
 * 
 * description:
 *   finalize the purchase
 *
 * parameters: none
 * 
 * returns: none
 *
 *****************************************************************************/
async function finalizePurchase() {

  const { data: { session } } = await supabaseApi.auth.getSession();

  // insert the new order record
  const orderData = {
    user_id: session.user.id,
    customer_id: session.user.customer_id
  }
  const orderResponse = await insertRecord('orders', orderData);

  // create an array of order details
  const orderDetailsData = [];
  orderDetailsNewGrid.forEachNode(rowNode => {
    const item = {
      order_id: orderResponse.order_id,
      product_id: rowNode.data.product_id,
      quantity: rowNode.data.quantity,
      cost: rowNode.data.cost
    }
    orderDetailsData.push(item);
  });

  // insert the order details records
  await insertRecord('order_details', orderDetailsData);

  // reset the order details area
  purchaseButton.disabled = true;
  total = 0;
  orderTotalCost.textContent = '$0.00';
  clearGrid(orderDetailsNewGrid);

  // refresh the order history screen
  refreshOrdersHistoryGrid();
  clearOrderDetailsHistoryGrid();

  purchaseDialog.close();
}

/******************************************************************************
 * setupGrid
 * 
 * description:
 *   define the columns and create the grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function setupGrid() {
  const orderdetailsColumns = [
    { field: "order_details_id", hide: true },
    { field: "product_id", hide: true },
    { field: "product_name", headerName: 'Product', width: 150 },
    { field: "quantity", headerName: 'Quantity', type: 'rightAligned', width: 50 },
    { field: "cost", width: 120, type: 'rightAligned', valueFormatter: currencyFormatter },
    { field: "button", width: 60, cellRenderer: iconCellRenderer, onCellClicked: (event) => removeOrderDetailRow(event) },
  ];
  orderDetailsNewGrid = await initializeGrid('order-details-new-grid', 'vw_order_details', orderdetailsColumns,
    null, 'order_detail_id', 'product_id', 0, 0, 0);
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
setupGrid();