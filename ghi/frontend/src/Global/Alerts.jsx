export const AlertSuccess = ({ children }) => (
  <div
    className="alert alert-success alert-dismissible"
    role="alert"
  >
    {children}
    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    ></button>
  </div>
);

export const AlertError = ({ children }) => (
  <div
    className="alert alert-danger alert-dismissible"
    role="alert"
  >
    {children}
    <div>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  </div>
);
