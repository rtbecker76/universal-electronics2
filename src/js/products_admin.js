/******************************************************************************
* products_admin.js
 *
 * product functionality (on the administration data maintenance screen)
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { initializeGrid, refreshGrid, clearGrid, deleteRow } from "./grid";
import { createForm, populateForm, clearForm, submitForm, setFormValue } from "./form";
import { selectedVendorRow } from "./vendors_admin";

/******************************************************************************
 * constants
 *****************************************************************************/
const newProductButton = document.getElementById('new-product-button');
const updateProductButton = document.getElementById('update-product-button');
const deleteProductButton = document.getElementById('delete-product-button');
const productSubmitButton = document.getElementById('product-submit-button');
const productCancelButton = document.getElementById('product-cancel-button');
const newUpdateProductDialog = document.getElementById('new-update-product-dialog');
const deleteProductDialog = document.getElementById('delete-product-dialog');
const productDialogTitle = document.getElementById('product-dialog-title');
const deleteProductMessage = document.getElementById('delete-product-message');
const deleteProductSubmitButton = document.getElementById('delete-product-submit-button');
const deleteProductCancelButton = document.getElementById('delete-product-cancel-button');

/******************************************************************************
 * event listeners
 *****************************************************************************/
newProductButton.addEventListener('click', handleNewProduct);
updateProductButton.addEventListener('click', handleUpdateProduct);
deleteProductButton.addEventListener('click', handleDeleteProduct);
productSubmitButton.addEventListener('click', handleProductSubmit);
productCancelButton.addEventListener('click', handleProductCancel);
deleteProductSubmitButton.addEventListener('click', handleDeleteProductSubmit);
deleteProductCancelButton.addEventListener('click', handleDeleteProductCancel);

/******************************************************************************
 * variables
 *****************************************************************************/
let selectedProductRow = null;
let productsAdminGrid = null;
let productForm = null;

/******************************************************************************
 * refreshProductsAdminGrid
 * 
 * description:
 *   refresh the data in the products grid
 *
 * parameters: 
 *   filterField - the name of the field to filter by
 *   filterValue - the value to filter by
 *
 * returns: none
 *
 *****************************************************************************/
export function refreshProductsAdminGrid(filterField, filterValue) {
  refreshGrid(productsAdminGrid, 'products', 'product_id', filterField, filterValue );
}

/******************************************************************************
 * clearProductsAdminGrid
 * 
 * description:
 *   clear the data from the products grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function clearProductsAdminGrid() {
  clearGrid(productsAdminGrid);
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
 * handleProductCancel
 * 
 * description:
 *   respond to click on the new/update dialog cancel button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleProductCancel() {
  newUpdateProductDialog.close()
}

/******************************************************************************
 * handleProductSubmit
 * 
 * description:
 *   respond to click on the new/update dialog submit button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleProductSubmit() {
  const validated = await submitForm(productForm, 'products', 'product_id');
  if (validated) {
    refreshGrid(productsGrid, 'products', 'product_id', 'vendor_id', selectedVendorRow.vendor_id)
    newUpdateProductDialog.close()
  }
}

/******************************************************************************
 * handleDeleteProductCancel
 * 
 * description:
 *   respond to click on the delete dialog cancel button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteProductCancel() {
  deleteProductDialog.close();
}

/******************************************************************************
 * handleDeleteProductSubmit
 * 
 * description:
 *   respond to click on the delete dialog submit button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteProductSubmit() {
  const success = await deleteRow(productsGrid, 'products', 'product_id', selectedProductRow.product_id);
  if (success) {
    clearForm(productForm);
    refreshGrid(productsGrid, 'products', 'product_id', 'vendor_id', selectedVendorRow.vendor_id)

  }
  deleteProductDialog.close();
}

/******************************************************************************
 * handleNewProduct
 * 
 * description:
 *   respond to click on new vendor button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function handleNewProduct() {
  clearForm(productForm);
  setFormValue(productForm, 'vendor_id', selectedVendorRow.vendor_id);
  productSubmitButton.textContent = 'Insert';
  productDialogTitle.textContent = 'New Product';
  newUpdateProductDialog.showModal();
}

/******************************************************************************
 * handleUpdateProduct
 * 
 * description:
 *   respond to click on update vendor button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function handleUpdateProduct() {
  productSubmitButton.textContent = 'Update';
  productDialogTitle.textContent = 'Update Product';
  newUpdateProductDialog.showModal();
}

/******************************************************************************
 * handleDeleteProduct
 * 
 * description:
 *   respond to click on delete vendor button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteProduct() {
  deleteProductMessage.textContent =
    "Are you sure you want to delete product: " + selectedProductRow.product_name + "?";
  deleteProductDialog.showModal();
}

/******************************************************************************
 * vendorSelectHandler
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
function productSelectHandler(data) {
  selectedProductRow = data[0];
  if (selectedProductRow) {
    populateForm(productForm, selectedProductRow);
    updateProductButton.disabled = false;
    deleteProductButton.disabled = false;
  } else {
    clearForm(productForm);
    updateProductButton.disabled = true;
    deleteProductButton.disabled = true;
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
  const productColumns = [
    { field: "product_id", headerName: 'ID', width: 50 },
    { field: "product_name", headerName: 'Name', width: 150, filter: true },
    { field: "price", headerName: 'Price', type: 'rightAligned', width: 100, filter: true, valueFormatter: currencyFormatter },
    { field: "in_stock", headerName: 'In Stock', type: 'rightAligned', width: 100, filter: true },
  ];
  // using 0 for vendor ID means that the grid will not display any records initially
  productsAdminGrid = await initializeGrid('product-admin-grid', 'products', productColumns,
    productSelectHandler, 'product_id', 'vendor_id', '0');
}

/******************************************************************************
 * setupForm
 * 
 * description:
 *   set up the form
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function setupForm() {
  const productFields = [
    { name: "product_id", type: "text", title: "Product ID", disabled: true, readOnly: true },
    { name: "vendor_id", type: "text", title: "Vendor ID", visible: false },
    { name: "product_name", type: "text", title: "Name", isRequired: true },
    {
      name: "price", type: "text", title: "Price", maskType: "currency", maskSettings: {
        min: 0,
        max: 10000,
        precision: 2, // Number of decimal places
        prefix: "$",   // Currency symbol prefix
        suffix: " USD" // Currency code suffix (optional)
      }
    },
    { name: "in_stock", type: "text", inputType: 'number', title: "In Stock", isRequired: true, min: 0, textAlignment: "right" }
  ];
  productForm = createForm('product-form', productFields);
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
setupGrid();
setupForm();