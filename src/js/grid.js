/******************************************************************************
 * grid.js
 *
 * data grid related functions
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { createGrid } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { selectRecords, deleteRecord } from "./data";

/******************************************************************************
 * initializeGrid
 * 
 * description:
 *   fetch data from API and create grid
 *
 * parameters:
 *   htmlElement (string) - the name of the html element that contains the grid
 *   table (string) - the name of the table that holds the data
 *   columnDefs (array of objects) - the column definitions for the grid
 *   selectHandler (function) - to be invoked when a row is selected/unselected
 *   idField (string) - the primary key field of the table
 *   filterField (string) - the name of the field to filter by
 *   filterValue (string) - the value to filter by 
 *   headerHeight (number) - height of the header
 *   rowHeight (number) - height of each row
 *
 * returns: 
 *   a new grid object
 * 
 *****************************************************************************/
export async function initializeGrid(htmlElement, table, columnDefs, selectHandler,
    idField, filterField, filterValue, headerHeight, rowHeight) {

    const rowData = await selectRecords(table, idField, filterField, filterValue)
    const gridElement = document.getElementById(htmlElement);
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        rowSelection: {
            mode: 'singleRow',
            checkboxes: false,
            enableClickSelection: true,
        },
        onSelectionChanged: (event) => {
            if (selectHandler) {
                const selectedRows = event.api.getSelectedRows();
                selectHandler(selectedRows)
            }
        },
        getRowId: params => params.data[idField].toString(),
        headerHeight: headerHeight,
        rowHeight: rowHeight,

    }
    return new createGrid(gridElement, gridOptions);
}

/******************************************************************************
 * addRow
 * 
 * description:
 *   add a grid row
 *
 * parameters:
 *   grid (object) - the grid object that was created in the createGrid function
 *   row (object) - row data
 *
 * returns: none
 *
 *****************************************************************************/
export function addRow(grid, row) {
    grid.applyTransaction({
        add: [row],
    });
}

/******************************************************************************
 * removeRow
 * 
 * description:
 *   remove a grid row
 *
 * parameters:
 *   grid (object) - the grid object that was created in the createGrid function
 *   row (object) - row data
 *
 * returns: none
 *
 *****************************************************************************/
export function removeRow(grid, row) {
    grid.applyTransaction({ remove: row });
}

/******************************************************************************
 * deleteRow
 * 
 * description:
 *   delete a grid row
 *
 * parameters:
 *   grid (object) - the grid object that was created in the createGrid function
 *   table (string) - the name of the table that holds the data
 *   idField (string) - the primary key field of the table
 *   idValue (string) - the value of the primary key of the row
 *
 * returns:
 *   a boolean indicating if the deletion was successful 
 *
 *****************************************************************************/
export async function deleteRow(grid, table, idField, idValue) {
    const success = await deleteRecord(table, idField, idValue);
    if (success) {
        refreshGrid(grid, table, idField);
    }
    return success;
}

/******************************************************************************
 * refreshGrid
 * 
 * description:
 *   refetch data from API and refresh grid
 *
 * parameters:
 *   grid (object) - the grid object that was created in the createGrid function
 *   table (string) - the name of the table that holds the data
 *   idField (string) - the primary key field of the table
 *   filterField (string) - the name of the field to filter by
 *   filterValue (string) - the value to filter by
 * 
 * returns: none
 *
 *****************************************************************************/
export async function refreshGrid(grid, table, idField, filterField, filterValue) {
    if (grid) {
        const rowData = await selectRecords(table, idField, filterField, filterValue);
        grid.setGridOption('rowData', rowData);
    }
}

/******************************************************************************
 * clearGrid
 * 
 * description:
 *   clear data from the grid
 *
 * parameters:
 *   grid (object) - the grid object that was created in the createGrid function
 * 
 * returns: none
 *
 *****************************************************************************/
export async function clearGrid(grid) {
    if (grid) {
        grid.setGridOption('rowData', []);
    }
}