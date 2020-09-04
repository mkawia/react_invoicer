import { v4 as uuidv4 } from 'uuid';

import PouchDB from 'pouchdb';
//PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('invoices_db');

class InvoiceStore {
    get_invoice_rows() {


        /*   try {
               let p = db.find({
                   sort: ['date_created']
               });
               console.log(p);
           } catch (error) {
               console.log(error);
   
           }
   */

        return db.allDocs({ include_docs: true, descending: true })
    }
    delete_row(_id) {
        return db.get(_id).then(doc => {
            return db.remove(doc);
        });
    }
    store_row(obj) {
        obj["_id"] = uuidv4();
        obj["date_created"] = new Date();
        return db.put(obj);
    }
}

export default InvoiceStore;