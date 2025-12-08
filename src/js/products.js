/******************************************************************************
 * products.js
 *
 * product functionality (on the customer orders screen)
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { initializeGrid, refreshGrid, clearGrid } from "./grid";
import { addOrderDetailsRow } from "./order_details_new";

/******************************************************************************
 * variables
 *****************************************************************************/
export let selectedProductsRow = null;
 let productsGrid = null;

/******************************************************************************
 * refreshProductsGrid
 * 
 * description:
 *   refresh the data in the products grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function refreshProductsGrid() {
  refreshGrid(productsGrid, 'products', 'product_id');
}

/******************************************************************************
 * clearProductsGrid
 * 
 * description:
 *   clear the data from the products grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function clearProductsGrid() {
  clearGrid(productsGrid);
}

/******************************************************************************
 * iconCellRenderer
 *****************************************************************************/
function iconCellRenderer() {
  const div = document.createElement('div');
  div.style.color = 'green';
  div.classList.add( 'fa', 'fa-plus');
    div.style.fontSize = '20px';
  div.style.height = '60px';
  div.style.lineHeight = '60px';
  return div;
}

/******************************************************************************
 * imageCellRenderer
 *****************************************************************************/
function imageCellRenderer(params) {
  if (params.value) {
    const img = document.createElement('img');
    img.src = params.value;
    img.style.height = '50px';
    img.style.padding = '5px';
    return img;
  }
  return null;
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
 * productsSelectHandler
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
function productsSelectHandler(data) {
  selectedProductsRow = data[0];
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
  const productsColumns = [
    { field: "product_id", width: 50, hide: true },
    { field: "image_url", width: 100, cellRenderer: imageCellRenderer },
    { field: "product_name", minWidth: 60, flex: 1 },
    { field: "price", width: 90, type: 'rightAligned', valueFormatter: currencyFormatter },
    { field: "button", width: 60, cellRenderer: iconCellRenderer, onCellClicked: (event) => addOrderDetailsRow(event.data) },
    { field: "in_stock", headerName: 'Email', hide: true }
  ];
  productsGrid = await initializeGrid('products-grid', 'products', productsColumns,
    productsSelectHandler, 'product_id', null, null, 0, 60);
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
setupGrid();