import Sidebar from "../components/Sidebar"
import "../scss/Markets.scss"


export default function Markets() {
  return (
    <>
    <Sidebar />
        <div className="markets-container">
            <h1>Market</h1>
            <p>Access current market prices for various crops, 
            compare prices across different markets, and track 
            price trends over time. With this information at your fingertips, 
            you can optimize your selling strategy and ensure you get the best 
            value for your hard work.</p>
        </div>
    </>
  )
}