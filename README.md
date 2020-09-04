React invoicer
========================

A demo invoicer making app made in reactjs with a nodejs backend

Libraries used
------------

  * Reactjs;
  * [Koajs][1];
  * [ant design component library][2].
  * [pouchdb][3]



Requirements 
------------
  * Nodejs 10 orhigher;
  * A computer

Usage
------------

Run the production script on the root folder
```bash
$ npm run prod
```

Screenshots
------------

### The initial page
<img src="landing.png" alt="The initial page"
	title="The initial page" width="450"  />

### New invoice form
<img src="new_invoice.png" alt="New invoice form"
	title="New invoice form" width="450"  />

### Invoice list
<img src="invoice_list.png" alt="Invoice list"
	title="Invoice list" width="450"  />

### View invoice
<img src="view_invoice_modal.png" alt="View invoice"
	title="View invoice" width="450"  />

### Print invoice
<img src="invoice_print.png" alt="Print invoice"
	title="Print invoice" width="450"  />



Installation
------------

Run npm install on the root folder
```bash
$ npm install
```

Run npm install on the root folder web_app/invoice
```bash
$ npm install
```


Project structure
------------

The backend is just serves the static html file and built react app, most of the business logic is in the frontend. The react app stores data in the user's localstorage with the [Pouchdb][3]. 

Webpack builds the app on the public folder inside the root folder

[1]:https://koajs.com/
[2]:https://ant.design/
[3]:https://pouchdb.com/
