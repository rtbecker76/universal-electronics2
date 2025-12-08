/******************************************************************************
 * orders_history.js
 *
 * orders functionality
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { getSession } from "./auth";
import { initializeGrid, refreshGrid, clearGrid } from "./grid";
import { refreshOrderDetailsHistoryGrid, clearOrderDetailsHistoryGrid } from "./order_details_history";

/******************************************************************************
 * variables
 *****************************************************************************/
export let selectedOrdersRow = null;
let ordersHistoryGrid = null;

/******************************************************************************
 * refreshOrdersHistoryGrid
 * 
 * description:
 *   refresh the data in the order history grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function refreshOrdersHistoryGrid() {
  refreshGrid(ordersHistoryGrid, 'vw_orders', 'order_id');
}

/******************************************************************************
 * clearOrdersHistoryGrid
 * 
 * description:
 *   clear the data from the order history grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function clearOrdersHistoryGrid() {
  clearGrid(ordersHistoryGrid);
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
 * dateFormatter
 *****************************************************************************/
function dateTimeFormatter(params) {
  if (params.value === undefined || params.value === null) {
    return '';
  }
  // appending 'Z' indicates that the stored date is in UTC
  // new Date() will convert it to local time zone
  const date = new Date(params.value + 'Z');
  // toLocaleString will format it appropriately
  return date.toLocaleString();
}

/******************************************************************************
 * ordersSelectHandler
 * 
 * description:
 *   respond to click on the grid
 *
 * parameters:
 *   data - an array of records (might be an empty array if none selected)
 *
 * returns: none
 *
 *****************************************************************************/
function ordersSelectHandler(data) {
  selectedOrdersRow = data[0];
  if (selectedOrdersRow) {
    refreshOrderDetailsHistoryGrid('order_id', selectedOrdersRow.order_id)
  } else {
    clearOrderDetailsHistoryGrid()
  }
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

 const session = await getSession();

  if (session) {
    const ordersColumns = [
      { field: "order_id", headerName: 'ID', width: 70, filter: true },
      { field: "customer_id", hide: true },
      { field: "order_date", headerName: 'Order Date', width: 180, filter: true, valueFormatter: dateTimeFormatter },
      { field: "total_cost", headerName: 'Total Cost', type: 'rightAligned', width: 150, filter: true, valueFormatter: currencyFormatter }
    ];
    ordersHistoryGrid = await initializeGrid('orders-history-grid', 'vw_orders', ordersColumns, ordersSelectHandler, 'order_id', 'user_id', session.user.id);
  }
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
setupGrid();
