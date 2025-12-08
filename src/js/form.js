/******************************************************************************
 * form.js
 *
 * data form related functions
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { Model } from 'survey-core';
import { insertRecord, updateRecord } from "./data";

/******************************************************************************
 * createForm
 * 
 * description:
 *   create the form, includes calls to insert and update APIs
 *
 * parameters:
 *   htmlElement (string)  - the name of the html element that contains the form
 *   fieldDefs (array of objects) - the field definitions for the form
 *
 * returns: 
 *   a new form object
 * 
 *****************************************************************************/
export function createForm(htmlElement, fieldDefs) {
    const formElement = document.getElementById(htmlElement);

    const formOptions = {
        elements: fieldDefs,
        showNavigationButtons: false,
        showCompletedPage: false,
    }

    const form = new Model(formOptions);
    form.render(formElement);
    return form;
}

/******************************************************************************
 * submitForm
 * 
 * description:
 *   validate form data, insert or update as needed
 *
 * parameters:
 *   form (object) - the form object that was created in the createForm function
 *   table (string) - the name of the table that holds the data
 *   idField (string) - the primary key field of the table
 *
 * returns: 
 *   a boolean indicating if the form data validated successfully
 * 
 *****************************************************************************/
export async function submitForm(form, table, idField) {
    const validated = form.validate();
    if (validated) {
        if (form.data[idField]) {
            await updateRecord(table, idField, form.data);
        } else {
            await insertRecord(table, form.data);
        }
    }
    return validated;
}

/******************************************************************************
 * setFormValue
 * 
 * description:
 *   set a specific value of a specific field
 * 
 * parameters:
 *   form (object) - the form object that was created in the createForm function
 *   fieldName (string) - the name of the field to set 
 *   fieldValue (string) - the value to set it to
 *
 * returns: none
 *
 *****************************************************************************/
export function setFormValue(form, fieldName, fieldValue) {
    form.setValue(fieldName, fieldValue);
}

/******************************************************************************
 * clearForm
 * 
 * description:
 *   clear form fields
 * 
 * parameters:
 *   form (object) - the form object that was created in the createForm function  
 *
 * returns: none
 *
 *****************************************************************************/
export function clearForm(form) {
    form.clear();
}

/******************************************************************************
 * populateForm
 * 
 * description:
 *   populate form fields with data
 * 
 * parameters:
 *   form (object) - the form object that was created in the createForm function
 *   data (object) - the data to use to populate the form 
 *
 * returns: none
 *
 *****************************************************************************/
export function populateForm(form, data) {
    form.data = data;
}
