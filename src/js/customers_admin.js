/******************************************************************************
 * customers_admin.js
 *
 * customer functionality
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { initializeGrid, refreshGrid, clearGrid, deleteRow } from "./grid";
import { createForm, populateForm, clearForm, submitForm } from "./form";

/******************************************************************************
 * constants
 *****************************************************************************/
const updateCustomerButton = document.getElementById('update-customer-button');
const deleteCustomerButton = document.getElementById('delete-customer-button');
const customerSubmitButton = document.getElementById('customer-submit-button');
const customerCancelButton = document.getElementById('customer-cancel-button');
const newUpdateCustomerDialog = document.getElementById('new-update-customer-dialog');
const deleteCustomerDialog = document.getElementById('delete-customer-dialog');
const customerDialogTitle = document.getElementById('customer-dialog-title');
const deleteCustomerMessage = document.getElementById('delete-customer-message');
const deleteCustomerSubmitButton = document.getElementById('delete-customer-submit-button');
const deleteCustomerCancelButton = document.getElementById('delete-customer-cancel-button');

/******************************************************************************
 * event listeners
 *****************************************************************************/
updateCustomerButton.addEventListener('click', handleUpdateCustomer);
deleteCustomerButton.addEventListener('click', handleDeleteCustomer);
customerSubmitButton.addEventListener('click', handleCustomerSubmit);
customerCancelButton.addEventListener('click', handleCustomerCancel);
deleteCustomerSubmitButton.addEventListener('click', handleDeleteCustomerSubmit);
deleteCustomerCancelButton.addEventListener('click', handleDeleteCustomerCancel);

/******************************************************************************
 * variables
 *****************************************************************************/
let selectedCustomerRow = null;
 let customersAdminGrid = null;
let customerForm = null;

/******************************************************************************
 * refreshCustomersAdminGrid
 * 
 * description:
 *   refresh the data in the customer grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function refreshCustomersAdminGrid() {
  refreshGrid(customersAdminGrid, 'customers', 'customer_id');
}

/******************************************************************************
 * clearCustomersAdminGrid
 * 
 * description:
 *   clear the data from the customer grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function clearCustomersAdminGrid() {
  clearGrid(customersAdminGrid);
}

/******************************************************************************
 * handleCustomerCancel
 * 
 * description:
 *   respond to click on the new/update dialog cancel button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleCustomerCancel() {
  newUpdateCustomerDialog.close();
}

/******************************************************************************
 * handleCustomerSubmit
 * 
 * description:
 *   respond to click on the new/update dialog submit button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleCustomerSubmit() {
  const validated = await submitForm(customerForm, 'customers', 'customer_id');
  if (validated) {
    refreshGrid(customersAdminGrid, 'customers', 'customer_id');
    newUpdateCustomerDialog.close();
  }
}

/******************************************************************************
 * handleDeleteCustomerCancel
 * 
 * description:
 *   respond to click on the delete dialog cancel button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteCustomerCancel() {
  deleteCustomerDialog.close();
}

/******************************************************************************
 * handleDeleteCustomerSubmit
 * 
 * description:
 *   respond to click on the delete dialog submit button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteCustomerSubmit() {
  const success = await deleteRow(customersAdminGrid, 'customers', 'customer_id', selectedCustomerRow.customer_id);
  if (success) {
    clearForm(customerForm);
  }
  deleteCustomerDialog.close();
}

/******************************************************************************
 * handleUpdateCustomer
 * 
 * description:
 *   respond to click on update customer button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function handleUpdateCustomer() {
  customerSubmitButton.textContent = 'Update';
  customerDialogTitle.textContent = 'Update Customer';
  newUpdateCustomerDialog.showModal();
}

/******************************************************************************
 * handleDeleteCustomer
 * 
 * description:
 *   respond to click on delete customer button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteCustomer() {
  deleteCustomerMessage.textContent =
    "Are you sure you want to delete customer: " + selectedCustomerRow.first_name + ' ' + selectedCustomerRow.last_name + "?";
  deleteCustomerDialog.showModal();
}

/******************************************************************************
 * customerSelectHandler
 * 
 * description:
 *   respond to click on the grid
 *
 * parameters:
 *   data (array of records) - the record(s) selected, can be an empty array
 *
 * returns: none
 *
 *****************************************************************************/
function customerSelectHandler(data) {
  selectedCustomerRow = data[0];
  if (selectedCustomerRow) {
    populateForm(customerForm, selectedCustomerRow);
    updateCustomerButton.disabled = false;
    deleteCustomerButton.disabled = false;
  } else {
    clearForm(customerForm);
    updateCustomerButton.disabled = true;
    deleteCustomerButton.disabled = true;
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
  const customerColumns = [
    { field: "customer_id", headerName: 'ID', width: 50 },
    { field: "first_name", headerName: 'First Name', minWidth: 100, filter: true, flex: 1 },
    { field: "last_name", headerName: 'Last Name', minWidth: 100, filter: true, flex: 1 },
    { field: "email", headerName: 'Email', minWidth: 150, filter: true, flex: 1 }
  ];
  customersAdminGrid = await initializeGrid('customer-admin-grid', 'customers', customerColumns, customerSelectHandler, 'customer_id');
}

/******************************************************************************
 * setupForm
 * 
 * description:
 *   define the fields and create the form
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function setupForm() {
  const customerFields = [
    { name: "customer_id", type: "text", title: "Customer ID", disabled: true, readOnly: true },
    { name: "first_name", type: "text", title: "First Name", isRequired: true },
    { name: "last_name", type: "text", title: "Last Name", isRequired: true },
    { name: "email", type: "text", inputType: 'email', title: "Email", readOnly: true }
  ];
  customerForm = createForm('customer-form', customerFields);
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
setupGrid();
setupForm();