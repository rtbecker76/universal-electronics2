/******************************************************************************
 * main.js
 *
 * import all modules to a single js file
 *****************************************************************************/
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
dom.watch();

import "./data";
import "./grid";
import "./form";
import "./customers_admin";
import "./vendors_admin";
import "./products";
import "./products_admin";
import "./orders_history";
import "./order_details_history";
import "./order_details_new";
import "./charts1";
import "./charts2";
import "./charts3";
import "./auth";
