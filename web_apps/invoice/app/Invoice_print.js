
import React from 'react';
import './invoice_print.css';

import { Button } from 'antd';

import { PrinterOutlined } from '@ant-design/icons';
import { Decimal } from 'decimal.js';


class InvoicePrint extends React.Component {

    componentDidMount() {
        this.loadFields();
    }


    state = {

        business_name: "",
        business_email: "",
        business_phone: ""
    };



    updateBusinessField = (name, e) => {
        localStorage.setItem(name, e.target.value);
        this.setState({ [name]: e.target.value });
    }
    loadFields = () => {
        this.setState({
            business_name: getOrSetLocalStorageValue("business_name"),
        });
        this.setState({
            business_email: getOrSetLocalStorageValue("business_email"),
        });

        this.setState({
            business_phone: getOrSetLocalStorageValue("business_phone"),
        });
    }

    getTotal = () => {
        function lineTotal(accumulator, invoice_line) {
            let rate_deci = new Decimal(invoice_line.rate ? invoice_line.rate : 0.0);
            let quantity_deci = new Decimal(invoice_line.quantity ? invoice_line.quantity : 0.0);
            let lt = new Decimal(accumulator).plus(rate_deci.times(quantity_deci));
            return lt.toNumber();

        }
        return this.props.invoice.invoice_lines.reduce(lineTotal, 0.0);
    }

    render() {
        var additional_info = null;
        if (this.props.invoice.additional_info) {
            additional_info = <div id="additional_info_wrapper">
                <p className="additional_info">{this.props.invoice.additional_info}
                </p>
            </div>
        }
        const invoice_lines_rows = this.props.invoice.invoice_lines.map((line, index) => {

            return (
                <tr key={index} className="service">
                    <td className="tableitem">
                        <p className="itemtext">{line.item_description}</p>
                    </td>
                    <td className="tableitem">
                        <p className="itemtext">{line.quantity}</p>
                    </td>
                    <td className="tableitem">
                        <p className="itemtext">{line.rate}</p>
                    </td>
                    <td className="tableitem">
                        <p className="itemtext">  {fuckUpSomeCommas(line.quantity * line.rate)}</p>
                    </td>
                </tr>
            )
        });

        return (
            <>
                <div id="actions-buttons-wrapper">
                    <Button onClick={() => { printInvoiceModal(); }} icon={<PrinterOutlined />} size="large" type="primary">Print</Button>
                </div>
                <div id="invoiceholder">

                    <div id="invoice-print" >

                        <div id="invoice-top">
                            <div className="info">
                                <h2><input value={this.state.business_name} onChange={(e) => this.updateBusinessField("business_name", e)} id="business-name" placeholder="Enter your business name" /></h2>
                                <p><input value={this.state.business_email} onChange={(e) => this.updateBusinessField("business_email", e)} id="business-email" type="text" placeholder="Enter your email" /><br />
                                    <input value={this.state.business_phone} onChange={(e) => this.updateBusinessField("business_phone", e)} id="business-phone" placeholder="Enter your phone number" type="text" />
                                </p>
                            </div>
                            <div className="title">
                                <h1>Invoice {this.props.invoice.invoice_number}</h1>
                                <p>Issued: {humanDate(this.props.invoice.date_issued)}<br />
                            Payment Due: {humanDate(this.props.invoice.payment_due_date)}
                                </p>
                            </div>
                        </div>



                        <div id="invoice-mid">

                            <div className="info">
                                <h2>{this.props.invoice.client.client_name}</h2>
                                <p>{this.props.invoice.client.client_email}<br />
                                    {this.props.invoice.client.client_phone}
                                </p>
                            </div>

                            <div id="project">
                                <h2>Project Description</h2>
                                <p>{this.props.invoice.project_description}</p>
                            </div>

                        </div>

                        <div id="invoice-bot">

                            <div id="table">
                                <table>
                                    <tbody>
                                        <tr className="tabletitle">
                                            <td className="item">
                                                <h2>Description</h2>
                                            </td>
                                            <td className="Hours">
                                                <h2>Quantity</h2>
                                            </td>
                                            <td className="Rate">
                                                <h2>Rate</h2>
                                            </td>
                                            <td className="subtotal">
                                                <h2>Sub-total</h2>
                                            </td>
                                        </tr>


                                        {invoice_lines_rows}









                                        <tr className="tabletitle">
                                            <td></td>
                                            <td></td>
                                            <td className="Rate">
                                                <h2>Total</h2>
                                            </td>
                                            <td className="payment">
                                                <h2>{fuckUpSomeCommas(this.getTotal())}</h2>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>



                            {additional_info}

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const printInvoiceModal = () => {
    var printContents = document.getElementById("invoiceholder").innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    location.reload();
}

const getOrSetLocalStorageValue = (field) => {
    if (localStorage.getItem(field)) {
        return localStorage.getItem(field);
    }
    localStorage.setItem(field, "");
    return "";
}


function humanDate(value) {
    if (value === undefined) {
        return;
    }
    const date = new Date(value);
    return date.toString().substring(4, 15);
};
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


export default InvoicePrint;