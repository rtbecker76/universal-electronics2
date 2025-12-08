/******************************************************************************
 * data.js
 *
 * all functions needed to interface with the Supabase APIs
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { createClient } from '@supabase/supabase-js'

/******************************************************************************
 * constants
 *****************************************************************************/
const supabaseApi = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const errorDialog = document.getElementById('error-dialog');
const errorMessage = document.getElementById('error-message');
const errorCloseButton = document.getElementById('error-close-button');

/******************************************************************************
 * event listeners
 *****************************************************************************/
errorCloseButton.addEventListener('click', () => { errorDialog.close(); });

/******************************************************************************
 * selectRecords
 * 
 * description:
 *   fetches all records for the specified table
 *
 * parameters:
 *   table (string) - the name of the table
 *   orderField (string) - the name of the field to order by
 *   filterField (string)  - the name of the field to filter by
 *   filterValue (string)  - the value to filter by
 *
 * returns: 
 *   the records requested, or an error
 *
 *****************************************************************************/
export async function selectRecords(table, orderField, filterField, filterValue) {
    if (filterField) {
        const { data, error } = await supabaseApi
            .schema('public')
            .from(table)
            .select()
            .eq(filterField, filterValue)
            .order(orderField);
        if (error) {
            console.error('Error fetching data:', error.message);
            errorMessage.textContent = 'An unexpected error occurred.';
            errorDialog.showModal();
            return error;
        } else {
            return data;
        }
    } else {
        const { data, error } = await supabaseApi
            .schema('public')
            .from(table)
            .select()
            .order(orderField);
        if (error) {
            console.error('Error fetching data:', error.message);
            errorMessage.textContent = 'An unexpected error occurred.';
            errorDialog.showModal();
            return error;
        } else {
            return data;
        }
    }
}

/******************************************************************************
 * updateRecord
 * 
 * description:
 *   update a record for the specified table
 *
 * parameters:
 *   table (string) - the name of the table
 *   filterField (string) - the name of the field to filter by
 *   newData (object) - the data to update the table with
 *     (must include a value corresponding to the filter field)
 *
 * returns: 
 *   the record that was updated, or an error 
 * 
 *****************************************************************************/
export async function updateRecord(table, filterField, newData) {
    const { data, error } = await supabaseApi
        .schema('public')
        .from(table)
        .update(newData)
        .eq(filterField, newData[filterField])
        .select();
    if (error) {
        console.error('Error updating record:', error.message);
        errorMessage.textContent = 'An unexpected error occurred.';
        errorDialog.showModal();
        return error;
    } else {
        return data;
    }
}

/******************************************************************************
 * insertRecord
 * 
 * description:
 *   inserts a record into the specified table
 *
 * parameters:
 *   table (string)  - the name of the table
 *   newData (array of records) - the data to insert into the table
 *
 * returns: 
 *   the record that was inserted, or an error
 *
 *****************************************************************************/
export async function insertRecord(table, newData) {
    const { data, error } = await supabaseApi
        .schema('public')
        .from(table)
        .insert(newData)
        .select();
    if (error) {
        console.error('Error inserting record:', error.message);
        errorMessage.textContent = 'An unexpected error occurred.';
        errorDialog.showModal();
        return error;
    }
    return data[0];
}

/******************************************************************************
 * deleteRecord
 * 
 * description:
 *   delete a record from the specified table
 *
 * parameters:
 *   table (string)  - the name of the table
 *   idField (string)  - the primary key field of the table
 *   idValue (string)  - the value of the primary key
 *
 * returns: 
 *   a boolean indicating if the deletion was successful
 * 
 *****************************************************************************/
export async function deleteRecord(table, idField, idValue) {
    const { data, error } = await supabaseApi
        .schema('public')
        .from(table)
        .delete()
        .eq(idField, idValue);
    if (error) {
        if (error.message.includes('foreign key constraint')) {
            errorMessage.textContent =
                'This record has dependent records and cannot be deleted.';
        } else {
            errorMessage.textContent =
                'An unexpected error occurred.';
        }
        errorDialog.showModal();

        return false;
    } else {
        return true;
    }
}
