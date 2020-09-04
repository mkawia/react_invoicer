

import React from 'react';
import { Decimal } from 'decimal.js';

import { Menu, Dropdown, Button } from 'antd';
import { EditFilled } from '@ant-design/icons';



const InvoiceTable = (props) => {

    const handleMenuClick = (input) => {
        let input_str = input.key.split("||");
        if (input_str.length != 2) {
            return;
        }
        let action = input_str[0];
        let _id = input_str[1];

        let invoice = null;
        props.stored_invoices.forEach(inv => {
            if (inv._id === _id) {
                invoice = inv;
            }
        });
        if (!invoice) {
            return;
        }
        if (action === "view") {
            props.onViewInvoice(invoice);
            return;
        }
        if (action === "delete") {
            props.onDeleteInvoice(invoice);
            return;
        }
    }

    const showInvoice = (invoice) => {
        props.onViewInvoice(invoice);
    }
    const invoices_rows = props.stored_invoices.map(invoice => {
        const menu = (
            <Menu onClick={handleMenuClick}>
                <Menu.Item key={'view||' + invoice._id}>
                    <span className="view_invoice_txt">View Invoice</span>
                </Menu.Item>
                <Menu.Item key={'delete||' + invoice._id}>
                    <span className="delete_invoice_txt">Delete Invoice</span>
                </Menu.Item>
            </Menu>
        );
        return (
            <div key={invoice._id} className="row">
                <div data-title="#" className="cell">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button onClick={e => e.preventDefault()} type="primary" size={"small"} shape={"circle"} icon={<EditFilled />} />
                    </Dropdown>

                </div>
                <div data-title="Client/Invoice number" className="cell">
                    <h3 onClick={e => { showInvoice(invoice) }} className="invoice-client-title">{invoice.client.client_name}</h3>
                    <span onClick={e => { showInvoice(invoice) }} className="invoice-number-title">
                        {invoice.invoice_number}
                    </span>
                </div>
                <div data-title="Description" className="cell">{invoice.project_description}</div>
                <div data-title="Issued Date/Due date" className="cell">
                    <h3 className="invoice-issued-date">{humanDate(invoice.date_issued)}</h3>
                    <span className="invoice-payment-date">
                        {humanDate(invoice.payment_due_date)}
                    </span>
                </div>
                <div data-title="Amount" className="cell">
                    <h3 className="invoice-line-total">{fuckUpSomeCommas(getInvoiceTotal(invoice.invoice_lines))}</h3>
                </div>
            </div>
        )
    })
    return (
        <div className="table">
            <div className="row header blue">
                <div className="cell">#</div>
                <div className="cell">Client/Invoice number</div>
                <div className="cell">Description</div>
                <div className="cell">Issued Date/Due date</div>
                <div className="cell">Amount</div>
            </div>

            {invoices_rows}

        </div>
    );
}



const fuckUpSomeCommas = (text) => {
    if (text === undefined) {
        return "";
    }
    if (text === null) {
        return "";
    }
    //old implementation
    //return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
    text = "" + text;
    if (!text.trim()) {
        return "";
    }
    let brackets = text.indexOf("(") == 0 && text.indexOf(")") == text.length - 1;
    if (brackets) {
        text = text.replace("(", "").replace(")", "");
    }
    if (text.length > 0) {
        if (!isNaN(text.replace(/,/g, ""))) {
            var value = new Decimal(Number(text.replace(/,/g, "")));
            value = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            if (brackets) {
                return "(" + value + ")";
            }
            return value;
        }
    }
    return text;
}


function getInvoiceTotal(invoice_lines) {
    function lineTotal(accumulator, invoice_line) {
        let rate_deci = new Decimal(invoice_line.rate ? invoice_line.rate : 0.0);
        let quantity_deci = new Decimal(invoice_line.quantity ? invoice_line.quantity : 0.0);
        let lt = new Decimal(accumulator).plus(rate_deci.times(quantity_deci));
        return lt.toNumber();

    }
    return invoice_lines.reduce(lineTotal, 0.0);
}

function humanDate(value) {
    if (value === undefined) {
        return;
    }
    const date = new Date(value);
    return date.toString().substring(4, 15);
};

export default InvoiceTable;