import app from './app.js'
import { config } from './config/index.js';

app.listen(config.PORT, () => {
    console.log(`App listening at port ${config.PORT}`);
})