import '../scss/Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h2>🌱 CropWise </h2>
                <p>Empowering farmers with smart agriculture technology</p>
                <div className="other-links">
                    <p>Privacy Policy</p>
                    <p>Terms of Service</p>
                    <p>Contact Us</p>
                </div>
                {/* <div className="social-links">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div> */}
            </div>
        </footer>
    );
}
export default Footer;