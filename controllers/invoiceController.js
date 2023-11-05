const Invoice = require("../modules/invoice");

const getInvoices = async (req, res, next) => {
    return res.status(200).json({ message: "I will try to index" });

};

const addInvoice = async (req, res, next) => {
  return res.status(200).json({ message: "I will try to add one invoice" });
};
const getInvoice = async (req, res, next) => {
  return res.status(200).json({ message: "I will try to find one invoice" });
};
const updateInvoice = async (req, res, next) => {
  return res.status(200).json({ message: "I will try to update one invoice" });
};
const deleteInvoice = async (req, res, next) => {
  return res.status(200).json({ message: "I will try to delete one invoice" });
};

exports.getInvoices = getInvoices;
exports.addInvoice = addInvoice;
exports.getInvoice = getInvoice;
exports.updateInvoice = updateInvoice;
exports.deleteInvoice = deleteInvoice;
