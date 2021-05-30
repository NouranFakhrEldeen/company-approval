import { ErrorMessages, ErrorMessagesKeys } from '../../infrastructure';

export class ErrorHandler{
  private static instance: ErrorHandler;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public isUniqueKeyViolation(e): boolean {
    return e.class === 14 && (e.number === 2601 || e.number === 2627);
  }
  public getErrorMessage(errorKey: ErrorMessagesKeys): string{
    return ErrorMessages[ErrorMessagesKeys[errorKey]];
  }


}