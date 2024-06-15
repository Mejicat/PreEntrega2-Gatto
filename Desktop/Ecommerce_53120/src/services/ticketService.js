import { ticketRepository } from "../repositories/index.js" ;
import TicketDTO from "../dao/dto/ticketDTO.js";

class TicketService {
    async getTickets() {
      try {
        const tickets = await ticketRepository.getTickets()
        if (!tickets) {
          throw new Error("No se encontraron tickets")
        }
        return tickets.map((ticket) => new TicketDTO(ticket))
      } catch (error) {
        throw error
      }
    }
  
    async getTicketById(ticketId) {
      try {
        const ticket = await ticketRepository.getTicketById(ticketId)
        if (!ticket) {
          throw new Error("Ticket no encontrado")
        }
        return new TicketDTO(ticket)
      } catch (error) {
        throw error
      }
    }
  
    async getTicketsByUserId(userId) {
      try {
        const tickets = await ticketRepository.getTicketsByUserId(userId)
        if (!tickets) {
          throw new Error("No se encontraron tickets")
        }
        return new TicketDTO(tickets)
      } catch (error) {
        throw error
      }
    }
  
    async createTicket(ticket) {
      try {
        const newTicket = await ticketRepository.createTicket(ticket)
        if (!newTicket) {
          throw new Error("Error al crear el ticket")
        }
        return new TicketDTO(newTicket)
      } catch (error) {
        throw error
      }
    }
  }
  
  export default new TicketService()