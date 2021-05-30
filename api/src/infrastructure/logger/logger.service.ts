import { Logger } from '@nestjs/common';
import * as fs from 'fs';
export class LoggerService extends Logger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(message: string) {
    // super.log(message);
    // const filename = `./logs/all-${new Date().toISOString().slice(0, 10)}.log`;
    // insertOrAppend(message, filename);
  }
  error(message: string) {
    super.error(message);
    const filename = `./logs/error-${new Date().toISOString().slice(0, 10)}.log`;
    this.insertOrAppend(message, filename);
  }
  warn(message: string) {
    super.warn(message);
    const filename = `./logs/warn-${new Date().toISOString().slice(0, 10)}.log`;
    this.insertOrAppend(message, filename);
  }
  debug(message: string) {
    super.debug(message);
    const filename = `./logs/debug-${new Date().toISOString().slice(0, 10)}.log`;
    this.insertOrAppend(message, filename);
  }
  verbose(message: string) {
    super.verbose(message);
    const filename = `./logs/verbose-${new Date().toISOString().slice(0, 10)}.log`;
    this.insertOrAppend(message, filename);
  }

  private insertOrAppend(message, filename) {
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs');
    }
    fs.exists(filename, (exists) => {
      if (exists) {
        fs.appendFileSync(filename , this.messageWrapper(message));
      } else {
        fs.writeFileSync(filename , this.messageWrapper(message));
      }
    });
  }

  private messageWrapper(message) {
    return `
==========================================================================================
  Date: ${new Date().toLocaleString()}
------------------------------------------------------------------------------------------


  ${message}


==========================================================================================


  `;
  }
  
}

