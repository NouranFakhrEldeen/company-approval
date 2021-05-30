//used for detecting db errors
export class ErrorDetector{
  public isUniqueKeyViolation(e) {
    return e.class === 14 && (e.number === 2601 || e.number === 2627);
  }
}