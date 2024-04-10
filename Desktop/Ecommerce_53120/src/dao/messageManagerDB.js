import messageModel from './models/messageModel.js'

class messageManagerDB {
    
    async createMessage(user, messageContent) {
        try { 
            const newMessage = await messageModel.create({ user, message: messageContent }) //crea el doc. en la DB
            return newMessage
        } catch (error) {
            console.error(error.message)
            throw new Error('Error al crear el mensaje')
        }
    }

    async getAllMessages() { //obtiene todos los mensajes
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los mensajes");
        }
    }
}

export { messageManagerDB }