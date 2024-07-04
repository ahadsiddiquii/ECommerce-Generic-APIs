class ResponseHandler {
  constructor() {
    this.success = false;
    this.message = "";
    this.data = null;
  }

  genericErrorMessage = "Something went wrong! Please try again.";

  setSuccess(success) {
    this.success = success;
    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  getResult() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }

  getResponse(res) {
    const result = this.getResult();
    console.log(result);
    res.json(result);
  }
}

module.exports = ResponseHandler;
