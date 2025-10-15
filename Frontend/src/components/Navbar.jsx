import '../scss/Navbar.scss';



const Navbar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-logo">
             <h1>🌱 CropWise</h1>
            <p>Smart Agriculture</p>
            </div>
            <ul className="navbar-menu">
                <li><a href="/#features">Features</a></li>
                <li><a href="/#testimonials">Testimonials</a></li>
                <li><a href="/#contact">Get Started</a></li>
            </ul>
        </div>
    </nav>
  );
}
export default Navbar;