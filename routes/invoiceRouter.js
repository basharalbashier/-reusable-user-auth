const express = require("express");
const {
  getInvoices,
  getInvoice,
  updateInvoice,
  addInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const invoiceRouter = express.Router();

invoiceRouter.get("/", getInvoices);
invoiceRouter.post("/new", addInvoice);
invoiceRouter.get("/find/:id", getInvoice);
invoiceRouter.put("/edit/:id", updateInvoice);
invoiceRouter.delete("/delete/:id", deleteInvoice);

module.exports = invoiceRouter;
