/******************************************************************************
* order_details_history.js
 *
 * order details functionality (on the customer order history screen)
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { initializeGrid, refreshGrid, clearGrid } from "./grid";

/******************************************************************************
 * variables
 *****************************************************************************/
let orderDetailsHistoryGrid = null;

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
 * refreshOrderDetailsHistoryGrid
 * 
 * description:
 *   refresh the data in the order details history grid
 *
 * parameters: 
 *   filterField (string) - the name of the field to filter by
 *   filterValue (string) - the value to filter by
 *
 * returns: none
 *
 *****************************************************************************/
export function refreshOrderDetailsHistoryGrid(filterField, filterValue) {
  refreshGrid(orderDetailsHistoryGrid, 'vw_order_details', 'order_detail_id', filterField, filterValue);
}

/******************************************************************************
 * clearOrderDetailsHistoryGrid
 * 
 * description:
 *   clear the data from the order details history grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function clearOrderDetailsHistoryGrid() {
  clearGrid(orderDetailsHistoryGrid);
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
    { field: "product_name", headerName: 'Product', width: 150 },
    { field: "quantity", headerName: 'Quantity', type: 'rightAligned', width: 150 },
    { field: "cost", headerName: 'Cost', type: 'rightAligned', width: 100, valueFormatter: currencyFormatter },

  ];
  // using 0 for order ID means that the grid will not display any records initially
  orderDetailsHistoryGrid = await initializeGrid('order-details-history-grid', 'vw_order_details', orderdetailsColumns,
    null, 'order_detail_id', 'order_id', '0');
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
setupGrid();
