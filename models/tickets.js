var mongoose = require('mongoose');

var Merchant = require('./merchants');
var Sale = require('./sales');
var Store = require('./stores');
var User = require('./users');

var ticketSchema = new mongoose.Schema({
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  saleId: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Sale", required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  totalAmount: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true }
});

var Ticket = mongoose.model('Ticket', ticketSchema);

ticketSchema.methods.getTickets = function (merchandId, fromDate, toDate) {

  return Ticket.find().where({ 
    merchantId: merchandId, 
    date: {
      $gte: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }).populate({
    path:'saleId',
    model:'Sale',
    populate: [{
      path: 'merchantProductId',
      model: 'MerchantProduct',
      populate: {
        path: 'category',
        model: 'Category'
      }
    },
    {
      path: 'productId',
      model: 'Product'
    }]
  }).populate({
    path:'storeId',
    model:'Store'
  }).populate({
    path:'userId',
    model:'User',
  }).sort({date:-1});

}

ticketSchema.methods.newTicket = function (userId, saleId, merchantId, storeId, totalAmount) {

  var ticket = new Ticket({
    merchantId: merchantId,
    saleId: saleId,
    storeId: storeId,
    totalAmount: totalAmount,
    userId: userId,
    date: new Date()
  });

  return ticket.save();

}

module.exports = Ticket;