class AxusError extends Error {
  constructor(msg, err) {
    super(err); //TODO
    this.message = msg + '\n' + this.message;
  }

}
