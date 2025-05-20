// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="py-5 mt-auto text-white bg-black">
      <div className="container">
        <div className="row">
          <div className="mb-4 col-lg-4">
            <h3 className="mb-3 h5">CST Gym</h3>
          </div>
          <div className="mb-4 col-lg-4">
            <h3 className="mb-3 h5">Connect With Us</h3>
            <div className="mb-3">
              <a href="#" className="text-white me-3"><i className="fab fa-facebook-f fa-lg"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-youtube fa-lg"></i></a>
            </div>
            <p>
              <i className="fas fa-map-marker-alt me-2"></i> College of Science and Technology, Bhutan<br />
              <i className="fas fa-phone me-2"></i> +975 XXXXXXXX<br />
              <i className="fas fa-envelope me-2"></i> info@cstgym.edu.bt
            </p>
          </div>
        </div>
        <hr className="my-4 bg-secondary" />
        <div className="text-center">
          <p className="mb-0">&copy; 2023 CST Gym. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
