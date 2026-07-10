import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="footer2-section section section-padding">
        <div className="container">
          <div className="row learts-mb-n40">
            <div className="col-lg-6 learts-mb-40">
              <div className="widget-about">
                <img alt="" src="/assets/images/logo/logo-2.webp" />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                  itaque recusandae commodi mollitia facere iure nisi, laudantium
                  quis quas perferendis a minus dolores.
                </p>
              </div>
            </div>
            <div className="col-lg-4 learts-mb-40">
              <div className="row">
                <div className="col">
                  <ul className="widget-list">
                    <li><Link to="/about-us">About us</Link></li>
                    <li><a href="#">Store location</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">Orders</a></li>
                  </ul>
                </div>
                <div className="col">
                  <ul className="widget-list">
                    <li><a href="#">Returns</a></li>
                    <li><a href="#">Support Policy</a></li>
                    <li><a href="#">Size Guide</a></li>
                    <li><a href="#">FAQs</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-2 learts-mb-40">
              <ul className="widget-list">
                <li>
                  <i className="fab fa-twitter"></i>{" "}
                  <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
                </li>
                <li>
                  <i className="fab fa-facebook-f"></i>{" "}
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
                </li>
                <li>
                  <i className="fab fa-instagram"></i>{" "}
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
                </li>
                <li>
                  <i className="fab fa-youtube"></i>{" "}
                  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Youtube</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer2-copyright section">
        <div className="container">
          <p className="copyright text-center">
            © 2023 learts. All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
}
