import ContenedorMongoDb from '../../container/ContenedorMongoDb.js';

class MensajesDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super('mensajes', {
      email: { type: String, required: true },
      messages: { type: Array },
    });
  }
}
export default MensajesDaoMongoDb;
