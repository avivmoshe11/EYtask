const Footer = () => {
  return (
    <p className="border-top pt-3 text-center">
      <span>
        EY <i className="bi bi-bank2"></i> Aviv
      </span>
      <span className="mx-1">&copy;</span>
      <span>{new Date().getFullYear()}</span>
    </p>
  );
};

export default Footer;
