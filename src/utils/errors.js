class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

class InvalidUrlError extends AppError {
  constructor(message = "Invalid URL. Try a full website address.") {
    super(message, 400, "INVALID_URL");
  }
}

class NonHtmlError extends AppError {
  constructor(message = "This URL does not contain an HTML page.") {
    super(message, 415, "NON_HTML");
  }
}

class TimeoutError extends AppError {
  constructor(message = "Website took too long to respond.") {
    super(message, 504, "TIMEOUT");
  }
}

class FetchError extends AppError {
  constructor(message = "Could not reach this website.") {
    super(message, 502, "FETCH_FAILED");
  }
}

module.exports = {
  AppError,
  InvalidUrlError,
  NonHtmlError,
  TimeoutError,
  FetchError,
};