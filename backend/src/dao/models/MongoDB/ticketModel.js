import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: Number,
        unique: true,
        required: true
    },
    purchase_dateTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    products: [
        {
            productName: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    total: {
        type: Number,
        required: true
    }
});

const ticketModel = model("Ticket", ticketSchema);

export default ticketModel;