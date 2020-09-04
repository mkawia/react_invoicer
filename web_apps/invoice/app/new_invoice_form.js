

import React from 'react';
import { Input, Button, InputNumber, notification } from 'antd';
import { Decimal } from 'decimal.js';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const { TextArea } = Input;

import { PlusOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';

class NewInvoiceForm extends React.Component {
    state = {
        invoice_number: "",
        date_issued: "",
        payment_due_date: "",
        client_name: "",
        client_email: "",
        client_phone: "",
        project_description: "",
        invoice_lines: [
            {
                item_description: "",
                quantity: 1,
                rate: 0.0
            }
        ],
        additional_info: ""
    };

    addNewInvoiceLine = () => {
        this.setState({
            invoice_lines: [...this.state.invoice_lines, {
                item_description: "",
                quantity: 1,
                rate: 0.0
            }]
        });
    }
    deleteInvoiceLine = (index) => {
        const newArr = [...this.state.invoice_lines];
        newArr.splice(index, 1);
        this.setState({ invoice_lines: newArr });
    }

    updateInvoiceLine = (index, field, newValue) => {
        //props.onLineUpdate(index, field, e.target.value)

        this.setState({
            invoice_lines: this.state.invoice_lines.map((line, idx) => {
                if (index === idx) {
                    line[field] = newValue
                }
                return line

            })
        });
    }

    updateField = (name, e) => {
        this.setState({ [name]: e.target.value });
    }
    updateDateField = (name, e) => {
        // this.setState({ [name]: e.target.value });
        this.setState({ [name]: e });
    }

    getTotal = () => {
        function lineTotal(accumulator, invoice_line) {
            let rate_deci = new Decimal(invoice_line.rate ? invoice_line.rate : 0.0);
            let quantity_deci = new Decimal(invoice_line.quantity ? invoice_line.quantity : 0.0);
            let lt = new Decimal(accumulator).plus(rate_deci.times(quantity_deci));
            return lt.toNumber();

        }
        return this.state.invoice_lines.reduce(lineTotal, 0.0);
    }
    saveNewInvoice = () => {

        if (!this.state.invoice_number) {
            showValidationError("Invoice number is required")
            return;
        }

        if (!this.state.date_issued) {
            showValidationError("Please enter the date this invoice was issued")
            return;
        }
        if (!this.state.payment_due_date) {
            showValidationError("Please enter the payment due date")
            return;
        }

        if (!this.state.client_name) {
            showValidationError("The client name is required")
            return;
        }
        if (!this.state.client_email) {
            showValidationError("Client email is required")
            return;
        }
        if (!isValidEmail(this.state.client_email)) {
            showValidationError("Please enter a valid client email")
            return;
        }

        if (!this.state.client_phone) {
            showValidationError("Client phone is required")
            return;
        }


        if (!this.state.project_description) {
            showValidationError("Please enter the project description")
            return;
        }


        if (this.state.invoice_lines.length == 0) {
            showValidationError("Enter atleast one invoice item")
            return;
        }

        var row_count = 1;
        for (const invoice_line of this.state.invoice_lines) {
            if (!invoice_line.item_description) {
                showValidationError("Enter item description at item #" + row_count)
                return;
            }
            row_count = row_count + 1;
        }

        const finalObj = {
            invoice_number: this.state.invoice_number,
            date_issued: this.state.date_issued,
            payment_due_date: this.state.payment_due_date,
            client: {
                client_name: this.state.client_name,
                client_email: this.state.client_email,
                client_phone: this.state.client_phone,
            },
            project_description: this.state.project_description,
            invoice_lines: this.state.invoice_lines,
            additional_info: this.state.additional_info,
        }
        this.props.onNewInvoiceValidated(finalObj);

        this.setState({
            invoice_number: "",
            date_issued: "",
            payment_due_date: "",
            client_name: "",
            client_email: "",
            client_phone: "",
            project_description: "",
            invoice_lines: [
                {
                    item_description: "",
                    quantity: 1,
                    rate: 0.0
                }
            ],
            additional_info: ""
        });
    }

    render() {

        return (
            <div className="new-invoice-form">
                <div className="invoice-item-row">
                    <div className="invoice-item-col">
                        <label>Invoice number</label>
                        <Input value={this.state.invoice_number} onChange={(e) => this.updateField("invoice_number", e)} />
                    </div>
                    <div className="invoice-item-col">
                        <label>Date issued</label>
                        <DatePicker selected={this.state.date_issued} className="ant-input" onChange={(e) => this.updateDateField("date_issued", e)} />
                    </div>
                </div>
                <div className="invoice-item-row">
                    <div className="invoice-item-col">
                        <label>Payment due date</label>
                        <DatePicker selected={this.state.payment_due_date} className="ant-input" onChange={(e) => this.updateDateField("payment_due_date", e)} />
                    </div>
                    <div className="invoice-item-col">
                    </div>
                </div>


                <div className="invoice-item-row">

                    <div className="invoice-item-col">
                        <div className="invoice-client-col">
                            <label>Client name</label>
                            <Input value={this.state.client_name} onChange={(e) => this.updateField("client_name", e)} />
                        </div>
                        <div className="invoice-client-col">
                            <label>Client email</label>
                            <Input value={this.state.client_email} onChange={(e) => this.updateField("client_email", e)} />
                        </div>
                        <div className="invoice-client-col">
                            <label>Client phone number</label>
                            <Input value={this.state.client_phone} onChange={(e) => this.updateField("client_phone", e)} />
                        </div>
                    </div>
                    <div className="invoice-item-col">
                        <label>Project description</label>
                        <TextArea value={this.state.project_description} onChange={(e) => this.updateField("project_description", e)} />
                    </div>
                </div>


                <h4 className="invoice-lines-title">Invoice items</h4>
                <div className="invoice-lines-wrapper">
                    <div className="invoice-line-form">
                        <div className="invoice-line-line-number">
                            #
                        </div>
                        <div className="invoice-line-description">Description</div>
                        <div className="invoice-line-quantity">Quantity</div>
                        <div className="invoice-line-rate">Rate</div>
                        <div className="invoice-line-sub-total">Subtotal</div>
                    </div>
                    <InvoiceLines onDelete={this.deleteInvoiceLine} onLineUpdate={this.updateInvoiceLine} invoice_lines={this.state.invoice_lines} />
                    <div className="add-new-line-wrapper">
                        <Button onClick={this.addNewInvoiceLine} block icon={<PlusOutlined />}>Add new line</Button>
                    </div>
                    <div className="total-title-wrapper">
                        <h3>{fuckUpSomeCommas(this.getTotal())}</h3>
                    </div>
                </div>

                <div className="invoice-item-row">

                    <div className="invoice-item-col">
                        <label>Additional info (optional)</label>
                        <TextArea value={this.state.additional_info} onChange={(e) => this.updateField("additional_info", e)} />
                    </div>

                    <div className="invoice-item-col">

                    </div>
                </div>
                <div className="save-invoice-btn-wrapper">
                    <Button onClick={this.saveNewInvoice} type="primary" size="large" icon={<FileAddOutlined />}>Save Invoice</Button>
                </div>
            </div>

        );
    }
}

const InvoiceLines = (props) => {
    const editInvoiceLineDescription = (index, field, v) => {
        props.onLineUpdate(index, field, v)
    }
    const editInvoiceLineNumber = (index, field, vl) => {
        if (isNaN(vl)) {
            return;
        }
        props.onLineUpdate(index, field, vl)
    }



    const invoice_lines_comps = props.invoice_lines.map((line, index) => {
        let delete_button;
        if (props.invoice_lines.length > 1) {
            delete_button = <Button onClick={() => { props.onDelete(index) }} type="danger" size={"small"} shape={"circle"} icon={<DeleteOutlined />} />;
        } else {
            delete_button = <Button size={"small"} shape={"circle"} icon={<DeleteOutlined />} disabled />;
        }

        return (

            <div key={index} className="invoice-line-form">
                <div className="invoice-line-line-number">
                    {delete_button}
                </div>
                <div className="invoice-line-description">
                    <Input placeholder="Enter item description" onChange={(e) => editInvoiceLineDescription(index, "item_description", e.target.value)} value={line.item_description} />
                </div>
                <div className="invoice-line-quantity">
                    <InputNumber placeholder="Quantity" min={1} onChange={(v) => editInvoiceLineNumber(index, "quantity", v)} value={line.quantity} className="invoice-line-input" />
                </div>
                <div className="invoice-line-rate">
                    <InputNumber placeholder="Rate" value={line.rate} onChange={(v) => editInvoiceLineNumber(index, "rate", v)} min={0} className="invoice-line-input" />
                </div>
                <div className="invoice-line-sub-total">
                    {fuckUpSomeCommas(line.quantity * line.rate)}
                </div>
            </div>
        )
    });
    return (
        <>
            {invoice_lines_comps}
        </>
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


function isValidEmail(emailPr) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailPr).toLowerCase());
}

const showValidationError = (desc) => {
    notification.error({
        message: 'Invalid form',
        placement: "topLeft",
        description: desc,
        duration: 2
    });
}

export default NewInvoiceForm;