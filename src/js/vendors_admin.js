/******************************************************************************
 * vendors_admin.js
 *
 * vendor functionality
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { initializeGrid, refreshGrid, clearGrid, deleteRow } from "./grid";
import { createForm, populateForm, clearForm, submitForm } from "./form";
import { refreshProductsAdminGrid, clearProductsAdminGrid } from "./products_admin";

/******************************************************************************
 * constants
 *****************************************************************************/
const newVendorButton = document.getElementById('new-vendor-button');
const updateVendorButton = document.getElementById('update-vendor-button');
const deleteVendorButton = document.getElementById('delete-vendor-button');
const vendorSubmitButton = document.getElementById('vendor-submit-button');
const vendorCancelButton = document.getElementById('vendor-cancel-button');
const newUpdateVendorDialog = document.getElementById('new-update-vendor-dialog');
const deleteVendorDialog = document.getElementById('delete-vendor-dialog');
const vendorDialogTitle = document.getElementById('vendor-dialog-title');
const deleteVendorMessage = document.getElementById('delete-vendor-message');
const deleteVendorSubmitButton = document.getElementById('delete-vendor-submit-button');
const deleteVendorCancelButton = document.getElementById('delete-vendor-cancel-button');

/******************************************************************************
 * event listeners
 *****************************************************************************/
newVendorButton.addEventListener('click', handleNewVendor);
updateVendorButton.addEventListener('click', handleUpdateVendor);
deleteVendorButton.addEventListener('click', handleDeleteVendor);
vendorSubmitButton.addEventListener('click', handleVendorSubmit);
vendorCancelButton.addEventListener('click', handleVendorCancel);
deleteVendorSubmitButton.addEventListener('click', handleDeleteVendorSubmit);
deleteVendorCancelButton.addEventListener('click', handleDeleteVendorCancel);

/******************************************************************************
 * variables
 *****************************************************************************/
export let selectedVendorRow = null;
let vendorsAdminGrid = null;
let vendorForm = null;

/******************************************************************************
 * refreshVendorsAdminGrid
 * 
 * description:
 *   refresh the data in the vendors grid
 *
 * parameters: 
 *   filterField - the name of the field to filter by
 *   filterValue - the value to filter by
 *
 * returns: none
 *
 *****************************************************************************/
export function refreshVendorsAdminGrid(filterField, filterValue) {
  refreshGrid(vendorsAdminGrid, 'vendors', 'vendor_id', filterField, filterValue );
}

/******************************************************************************
 * clearVendorsAdminGrid
 * 
 * description:
 *   clear the data from the vendors grid
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export function clearVendorsAdminGrid() {
  clearGrid(vendorsAdminGrid);
}

/******************************************************************************
 * handleVendorCancel
 * 
 * description:
 *   respond to click on the new/update dialog cancel button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleVendorCancel() {
  newUpdateVendorDialog.close()
}

/******************************************************************************
 * handleVendorSubmit
 * 
 * description:
 *   respond to click on the new/update dialog submit button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleVendorSubmit() {
  const validated = await submitForm(vendorForm, 'vendors', 'vendor_id');
  if (validated) {
    refreshGrid(vendorsAdminGrid, 'vendors', 'vendor_id');
    newUpdateVendorDialog.close()
  }
}

/******************************************************************************
 * handleDeleteVendorCancel
 * 
 * description:
 *   respond to click on the delete dialog cancel button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteVendorCancel() {
  deleteVendorDialog.close();
}

/******************************************************************************
 * handleDeleteVendorSubmit
 * 
 * description:
 *   respond to click on the delete dialog submit button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteVendorSubmit() {
  const success = await deleteRow(vendorsAdminGrid, 'vendors', 'vendor_id', selectedVendorRow.vendor_id);
  if (success) {
    clearForm(vendorForm);
  }
  deleteVendorDialog.close();
}

/******************************************************************************
 * handleNewVendor
 * 
 * description:
 *   respond to click on new vendor button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function handleNewVendor() {
  clearForm(vendorForm);
  vendorSubmitButton.textContent = 'Insert';
  vendorDialogTitle.textContent = 'New Vendor';
  newUpdateVendorDialog.showModal();
}

/******************************************************************************
 * handleUpdateVendor
 * 
 * description:
 *   respond to click on update vendor button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
function handleUpdateVendor() {
  vendorSubmitButton.textContent = 'Update';
  vendorDialogTitle.textContent = 'Update Vendor';
  newUpdateVendorDialog.showModal();
}

/******************************************************************************
 * handleDeleteVendor
 * 
 * description:
 *   respond to click on delete vendor button
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function handleDeleteVendor() {
  deleteVendorMessage.textContent =
    "Are you sure you want to delete vendor: " + selectedVendorRow.name + "?";
  deleteVendorDialog.showModal();
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
function vendorSelectHandler(data) {
  selectedVendorRow = data[0];
  if (selectedVendorRow) {
    populateForm(vendorForm, selectedVendorRow);
    refreshProductsAdminGrid( 'vendor_id', selectedVendorRow.vendor_id)
    updateVendorButton.disabled = false;
    deleteVendorButton.disabled = false;
  } else {
    clearForm(vendorForm);
    clearProductsAdminGrid()
    updateVendorButton.disabled = true;
    deleteVendorButton.disabled = true;
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
  const vendorColumns = [
    { field: "vendor_id", headerName: 'ID', width: 50 },
    { field: "name", headerName: 'Name', minWidth: 100, filter: true , flex:1},
    { field: "email", headerName: 'Email', minWidth: 200, filter: true, flex:1 },
    { field: "web_site", headerName: 'Web Site', minWidth: 200, filter: true , flex:1},
    { field: "description", headerName: 'Description', minWidth: 200, filter: true, flex:2 }
  ];
  vendorsAdminGrid = await initializeGrid('vendor-admin-grid', 'vendors', vendorColumns, vendorSelectHandler, 'vendor_id');
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
  const vendorFields = [
    { name: "vendor_id", type: "text", title: "Vendor ID", disabled: true, readOnly: true },
    { name: "name", type: "text", title: "Name", isRequired: true },
    { name: "email", type: "text", inputType: 'email', title: "Email", isRequired: true },
    { name: "web_site", type: "text", inputType: 'url', title: "Web Site", isRequired: false },
    { name: "description", type: "comment", title: "Description", isRequired: false }
  ];
  vendorForm = createForm('vendor-form', vendorFields);
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
setupGrid();
setupForm();

