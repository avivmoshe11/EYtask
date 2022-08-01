import classNames from "classnames";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        {...rest}
        id={name}
        name={name}
        className={classNames("form-control", {
          "is-invalid": error,
        })}
      />
      <div className="invalid-feedback">{error}</div>
    </div>
  );
};

export default Input;
