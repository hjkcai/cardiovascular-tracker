'use strict'

import * as mongoose from 'mongoose'

const config = require('../../config.js');
(mongoose as any).Promise = global.Promise

const connection = mongoose.createConnection(config.db.uri)
export default connection.useDb(config.db.name)
