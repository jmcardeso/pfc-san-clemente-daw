// Permite emular las variables de entorno en un fichero '.env'

const result = require('dotenv').config();

if (result.error) {
    throw result.error
}