import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import InvoicePrint from './Invoice_print';
import { Button, Modal, notification } from 'antd';


import InvoiceTable from './invoice_table';
import NewInvoiceForm from './new_invoice_form';

import InvoiceStore from './invoice_store';



class App extends React.Component {
    componentDidMount() {
        this.loadInvoices();
    }

    state = {
        stored_invoices: [],
        newInvoiceModalVisible: false,

        invoiceToBeDeleted: null,
        deleteInvoiceModalVisible: false,
        invoice_delete_title: "",

        invoiceToBeViewed: null,
        viewInvoiceModalVisible: false,
        view_invoice_title: ""
    };

    showNewInvoiceModal = (e) => {
        e.preventDefault();
        this.setState({
            newInvoiceModalVisible: true,
        });
    }
    closeNewInvoiceModal = (e) => {
        e.preventDefault();
        this.setState({
            newInvoiceModalVisible: false
        });
    }
    loadInvoices = () => {
        new InvoiceStore().get_invoice_rows().then(docs_res => {
            var docs = docs_res.rows.map(row => {
                let docCp = JSON.parse(JSON.stringify(row.doc));
                docCp["date_created"] = new Date(docCp.date_created);
                return docCp;
            });
            docs.sort((a, b) => {
                return b.date_created - a.date_created;
            })
            this.setState({
                stored_invoices: docs,
            });
        }).catch(err => {
            console.log(err);
            notification.error({
                message: 'Error',
                placement: "topLeft",
                description: "Error fetching invoices",
                duration: 2
            });
        });
    }
    storeNewInvoice = (finalObject) => {
        new InvoiceStore().store_row(finalObject).then(_res => {
            this.loadInvoices();
            this.setState({
                newInvoiceModalVisible: false,
            });
        }).catch(err => {
            console.log(err);
            notification.error({
                message: 'Error',
                placement: "topLeft",
                description: "Error storing invoice",
                duration: 2
            });
        });
    }

    deleteInvoice = () => {
        new InvoiceStore().delete_row(this.state.invoiceToBeDeleted._id).then(res => {
            notification.success({
                message: 'Invoice Deleted',
                placement: "topLeft",
                description: "Successfully deleted an invoice",
                duration: 2
            });
            this.closeDeleteInvoiceModal();
            this.loadInvoices();

        }).catch(err => {
            console.log(err);
            notification.error({
                message: 'Error',
                placement: "topLeft",
                description: "Error deleting invoice",
                duration: 2
            });
        });
    }
    deleteInvoiceConfirm = (invoice) => {
        this.setState({
            invoiceToBeDeleted: invoice,
            deleteInvoiceModalVisible: true,
            invoice_delete_title: "Are you sure you want to delete the invoice " + invoice.invoice_number + " to " + invoice.client.client_name + "?"
        });
    }
    closeDeleteInvoiceModal = () => {

        this.setState({
            deleteInvoiceModalVisible: false,
            invoiceToBeDeleted: null,
            invoice_delete_title: ""
        });
    }



    viewInvoice = (invoice) => {
        this.setState({
            invoiceToBeViewed: invoice,
            viewInvoiceModalVisible: true,
            view_invoice_title: invoice.invoice_number + " - " + invoice.client.client_name
        });
    }
    closeViewInvoiceModal = () => {

        this.setState({
            viewInvoiceModalVisible: false,
            invoiceToBeViewed: null,
            view_invoice_title: ""
        });
    }
    getIndexWrapperStyle = () => {
        if (this.state.stored_invoices.length == 0) {
            return {
                display: 'none'
            }
        }
    }
    getEmptyPageStyle = () => {
        if (this.state.stored_invoices.length > 0) {
            return {
                display: 'none'
            }
        }
    }
    render() {

        let view_invoice_modal_content = <h1>Empty page</h1>
        if (this.state.invoiceToBeViewed) {
            view_invoice_modal_content = <InvoicePrint invoice={this.state.invoiceToBeViewed} />;
        }

        return (
            <>
                <div style={this.getEmptyPageStyle()} id="empty-page">
                    <h1>No invoices</h1>
                    <Button size="large" onClick={this.showNewInvoiceModal} type="primary">Create your first invoice</Button>

                </div>
                <div style={this.getIndexWrapperStyle()} id="index-wrapper">
                    <div id="index-invoice-header">
                        <h1>Invoices</h1>
                        <Button size="large" onClick={this.showNewInvoiceModal} type="primary">Create new Invoice</Button>
                        <Modal
                            title="Create a new invoice"
                            style={{ top: 0 }}
                            visible={this.state.newInvoiceModalVisible}
                            footer={null}
                            width={900}
                            onCancel={this.closeNewInvoiceModal}
                        >
                            <NewInvoiceForm onNewInvoiceValidated={this.storeNewInvoice} />
                        </Modal>
                    </div>

                    <Modal
                        title="Confirm deletion"
                        visible={this.state.deleteInvoiceModalVisible}
                        onCancel={this.closeDeleteInvoiceModal}
                        okType="danger"
                        okText="Yes, Delete invoice"
                        onOk={this.deleteInvoice}

                    >
                        <h3>{this.state.invoice_delete_title}</h3>
                    </Modal>

                    <Modal
                        title={this.state.view_invoice_title}
                        style={{ top: 0 }}
                        visible={this.state.viewInvoiceModalVisible}
                        footer={null}
                        width={"100%"}
                        onCancel={this.closeViewInvoiceModal}
                    >

                        {view_invoice_modal_content}
                    </Modal>
                    <InvoiceTable onViewInvoice={this.viewInvoice} onDeleteInvoice={this.deleteInvoiceConfirm} stored_invoices={this.state.stored_invoices} />
                </div>

            </>
        );
    }
}




ReactDOM.render(
    <App />,
    document.querySelector('#invoice_app')
);