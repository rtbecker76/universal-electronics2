/******************************************************************************
 * auth.js
 *
 * authentication functionality
 *****************************************************************************/

/******************************************************************************
 * imports
 *****************************************************************************/
import { createClient } from '@supabase/supabase-js';

import { refreshCustomersAdminGrid, clearCustomersAdminGrid } from "./customers_admin";
import { clearProductsAdminGrid } from "./products_admin";
import { refreshVendorsAdminGrid, clearVendorsAdminGrid } from "./vendors_admin";
import { refreshProductsGrid, clearProductsGrid } from "./products";
import { refreshOrdersHistoryGrid, clearOrdersHistoryGrid } from "./orders_history";
import { clearOrderDetailsHistoryGrid } from "./order_details_history";
import { drawChart1 } from "./charts1";
import { drawChart2 } from "./charts2";
import { drawChart3 } from "./charts3";

/******************************************************************************
 * constants
 *****************************************************************************/
const supabaseApi = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const errorDialog = document.getElementById('error-dialog');
const errorMessage = document.getElementById('error-message');
const errorCloseButton = document.getElementById('error-close-button');

const loginContainer = document.getElementById('login-container');

const adminDataContainer = document.getElementById('admin-data-container');
const adminChartsContainer = document.getElementById('admin-charts-container');
const customerOrderContainer = document.getElementById('customer-order-container');
const customerOrderHistoryContainer = document.getElementById('customer-order-history-container');

const subtitle = document.getElementById('subtitle');

const menuBar = document.getElementById('menu-bar');
const currentEmail = document.getElementById('current-user-email');

const ordersButton = document.getElementById('orders-button');
const historyButton = document.getElementById('history-button');
const chartsButton = document.getElementById('charts-button');
const dataButton = document.getElementById('data-button');
const logoutButton = document.getElementById('logout-button');

const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const loginButton = document.getElementById('login');

/******************************************************************************
 * event listeners
 *****************************************************************************/
errorCloseButton.addEventListener('click', () => { errorDialog.close(); });

loginButton.addEventListener('click', signIn);
logoutButton.addEventListener('click', signOut);

ordersButton.addEventListener('click', goToOrders);
historyButton.addEventListener('click', goToHistory);

dataButton.addEventListener('click', goToData);
chartsButton.addEventListener('click', goToCharts);

emailField.addEventListener('change', checkInputs);
passwordField.addEventListener('change', checkInputs);

/******************************************************************************
 * signIn
 * 
 * description:
 *   authenticates the user's email and password entered on the login screen
 *   and creates a session
 *
 * parameters: none
 * 
 * returns: none
 *
 *****************************************************************************/
async function signIn() {
    const email = emailField.value;
    const password = passwordField.value;
    const { data, error } = await supabaseApi.auth.signInWithPassword({
        email,
        password,
    })
    if (error) {
        console.log(error.message);
        errorMessage.textContent = 'Invalid credentials.';
        errorDialog.showModal();
    } else {
        checkSession();
    }
}

/******************************************************************************
 * signOut
 * 
 * description:
 *   end the current session
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function signOut() {
    const { error } = await supabaseApi.auth.signOut()
    if (error) {
        console.log(error.message);
    } else {
        emailField.value = '';
        passwordField.value = '';
        checkSession();
    }
}

/******************************************************************************
 * getSession
 * 
 * description:
 *   return the current session
 *
 * parameters: none
 *
 * returns: session object
 *
 *****************************************************************************/
export async function getSession() {
    const { data: { session } } = await supabaseApi.auth.getSession();
    return session;
}

/******************************************************************************
 * checkSession
 * 
 * description:
 *   check if a session is in effect and the type of user who is logged in
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
export async function checkSession() {
    const { data: { session } } = await supabaseApi.auth.getSession();

    // if there's no session, clear the data and hide the admin 
    // and customer tables, and display the login screen
    if (!session) {
        clearCustomersAdminGrid();
        clearVendorsAdminGrid();
        clearProductsAdminGrid();

        clearProductsGrid();
        clearOrdersHistoryGrid();
        clearOrderDetailsHistoryGrid();

        loginContainer.style.display = 'flex';
        adminDataContainer.style.display = 'none';
        adminChartsContainer.style.display = 'none';
        customerOrderContainer.style.display = 'none';
        customerOrderHistoryContainer.style.display = 'none';

        menuBar.style.display = 'none';

        subtitle.textContent = 'Please Log In';
    } else {

        currentEmail.textContent = session.user.email;
        // if the logged in user is an admin,
        //   display the admin screen and admin buttons
        //   hide the login and customer screens and customer buttons 
        //   refresh the admin data
        if (session.user.app_metadata.admin) {
            refreshCustomersAdminGrid();
            refreshVendorsAdminGrid();
            clearProductsAdminGrid();

            drawChart1();
            drawChart2();
            drawChart3();

            loginContainer.style.display = 'none';
            adminDataContainer.style.display = 'flex';
            adminChartsContainer.style.display = 'none';
            customerOrderContainer.style.display = 'none';
            customerOrderHistoryContainer.style.display = 'none';

            menuBar.style.display = 'flex';
            dataButton.style.display = 'none';
            chartsButton.style.display = 'block';
            ordersButton.style.display = 'none';
            historyButton.style.display = 'none';

            subtitle.textContent = 'Data Maintenance';

            // otherwise, 
            //   display the customer screen and customer buttons
            //   hide the login and admin screens and admin buttons 
            //   clear the admin data
        } else {
            clearCustomersAdminGrid();
            clearVendorsAdminGrid();
            clearProductsAdminGrid();

            refreshProductsGrid();
            refreshOrdersHistoryGrid();
            clearOrderDetailsHistoryGrid();

            loginContainer.style.display = 'none';
            adminDataContainer.style.display = 'none';
            adminChartsContainer.style.display = 'none';
            customerOrderContainer.style.display = 'flex';
            customerOrderHistoryContainer.style.display = 'none';

            menuBar.style.display = 'flex';
            ordersButton.style.display = 'none';
            historyButton.style.display = 'block';
            dataButton.style.display = 'none';
            chartsButton.style.display = 'none';

            subtitle.textContent = 'Orders';
        }
    }
}

/******************************************************************************
 * goToHistory
 * 
 * description:
 *   when the customer screen is displayed, 
 *     hide the orders screen and display the order history screen
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function goToHistory() {
    customerOrderContainer.style.display = 'none';
    customerOrderHistoryContainer.style.display = 'flex';

    ordersButton.style.display = 'block';
    historyButton.style.display = 'none';

    subtitle.textContent = 'Order History';
}

/******************************************************************************
 * goToOrders
 * 
 * description:
 *   when the customer screen is displayed, 
 *     hide the order history screen and display the orders screen
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function goToOrders() {
    customerOrderContainer.style.display = 'flex';
    customerOrderHistoryContainer.style.display = 'none';

    ordersButton.style.display = 'none';
    historyButton.style.display = 'block';

    subtitle.textContent = 'Orders';
}

/******************************************************************************
 * goToData
 * 
 * description:
 *   when the admin screen is displayed, 
 *     hide the charts screen and display the data screen
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function goToData() {
    adminDataContainer.style.display = 'flex';
    adminChartsContainer.style.display = 'none';

    chartsButton.style.display = 'block';
    dataButton.style.display = 'none';

    subtitle.textContent = 'Data Maintenance';
}

/******************************************************************************
 * goToCharts
 * 
 * description:
 *   when the admin screen is displayed, 
 *     hide the data screen and display the charts screen
 *
 * parameters: none
 *
 * returns: none
 *
 *****************************************************************************/
async function goToCharts() {
    adminDataContainer.style.display = 'none';
    adminChartsContainer.style.display = 'flex';

    chartsButton.style.display = 'none';
    dataButton.style.display = 'block';

    subtitle.textContent = 'Charts';
}

/******************************************************************************
 * checkInputs
 * 
 * description:
 *   enables the login button if both username and password are entered
 *
 * parameters: none
 * 
 * returns: none
 *
 *****************************************************************************/
function checkInputs() {
    if (emailField.value && passwordField.value) {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
}

/******************************************************************************
 * starting point for the module
 *****************************************************************************/
checkSession();
