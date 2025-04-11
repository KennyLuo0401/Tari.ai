import { createApiServer } from './api';
import { config } from './config';

createApiServer(config.port);