import messageModel from './models/messageModel.js'

class MessageManagerDB {
    
    async createMessage(data) {
        const  {user, message} = data;
        if (!user || !message) {
            throw new Error ("Error al consultar mensajes")
        }

        try { 
            await messageModel.create({ user, message: messageContent }) //crea el doc. en la DB
            return await this.getAllMessages ()
        } catch (error) {
            console.error(error.message)
            throw new Error('Error al crear el mensaje')
        }
    }

    // CÓDIGO VIEJO PARA MESSAGE
    /*
     async createMessage(user, messageContent) {
        try { 
            const newMessage = await messageModel.create({ user, message: messageContent }) //crea el doc. en la DB
            return newMessage
        } catch (error) {
            console.error(error.message)
            throw new Error('Error al crear el mensaje')
        }
    }
    */

    async getAllMessages() { //obtiene todos los mensajes
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los mensajes");
        }
    }
}

export default MessageManagerDB