import TicketDto from "../dao/dto/ticketDTO.js";

class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createTicket(purchaser, amount, cart) {
        try {
            const ticket = await this.dao.createTicket(purchaser, amount, cart);        
            return new TicketDto(ticket);
        } catch (error) {
            throw new Error(`Could not get Ticket`);
        }
    }
}

export default TicketRepository;