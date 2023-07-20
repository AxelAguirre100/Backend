import ticketModel from "../../dao/models/MongoDB/ticketModel.js";

export const findTicket = async () => {
    try {
        return await ticketModel.find();
    } catch (error) {
        throw new Error(error);
    }
}

export const findTicketById = async (id) => {
    try {
        return await ticketModel.findById(id);
    } catch (error) {
        throw new Error(error);
    }
}

export const createTicket = async (ticket) => {
    try {
        const newTicket = await ticketModel(ticket)
        await newTicket.save()
        return newTicket
    } catch (error) {
        throw new Error(error);
    }
}

export const returnLastCode = async () => {
    try {
        return await ticketModel.findOne().sort('-code').exec();
    } catch (error) {
        throw new Error(error);
    }
}