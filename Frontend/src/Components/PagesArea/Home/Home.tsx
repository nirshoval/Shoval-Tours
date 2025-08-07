import { NavLink } from "react-router-dom";
import { useTitle } from "../../../Utils/UseTitle";
import backgroundImg from "../../../Assets/Images/background.jpg";
import "./Home.css";

export function Home() {

    useTitle("Shoval Tours");

    return (
        <div className="Home">
            {/* Main Header Section */}
            <section className="HeroSection">
                <div className="HeroContent">
                    <h1 className="HeroTitle">
                        Welcome to Shoval Tours!
                    </h1>
                    <p className="HeroSubtitle">
                        Discover the world's most breathtaking destinations with our exclusive vacation packages
                    </p>
                    <div className="HeroButtons">
                        <NavLink to="/vacations" className="HeroButton Primary">
                            <span className="ButtonIcon">🏖️</span>
                            Explore Vacations
                        </NavLink>
                    </div>
                </div>
                <div className="HeroImage">
                    <div className="VacationImageContainer">
                        <img src={backgroundImg} alt="Beautiful tropical vacation destination" className="VacationImage" />
                        <div className="ImageOverlay">
                            <p>Your Perfect Getaway Awaits</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="FeaturesSection">
                <h2 className="SectionTitle">
                    <span className="SectionIcon">✨</span>
                    Why Choose Shoval Tours?
                </h2>
                <div className="FeaturesGrid">
                    <div className="FeatureCard">
                        <div className="FeatureIcon">🎯</div>
                        <h3>Personalized Experiences</h3>
                        <p>Every vacation is tailored to your unique preferences and dreams</p>
                    </div>
                    <div className="FeatureCard">
                        <div className="FeatureIcon">🌍</div>
                        <h3>Global Destinations</h3>
                        <p>Explore amazing destinations across all continents</p>
                    </div>
                    <div className="FeatureCard">
                        <div className="FeatureIcon">💎</div>
                        <h3>Premium Quality</h3>
                        <p>Luxury accommodations and exclusive experiences</p>
                    </div>
                    <div className="FeatureCard">
                        <div className="FeatureIcon">🛡️</div>
                        <h3>Safe & Secure</h3>
                        <p>Travel with confidence knowing you're protected every step of the way</p>
                    </div>
                    <div className="FeatureCard">
                        <div className="FeatureIcon">💰</div>
                        <h3>Best Price Guarantee</h3>
                        <p>Competitive prices with no hidden fees - we guarantee the best value</p>
                    </div>
                    <div className="FeatureCard">
                        <div className="FeatureIcon">🎧</div>
                        <h3>24/7 Support</h3>
                        <p>Our dedicated team is available around the clock to assist you</p>
                    </div>
                </div>
            </section>

            {/* Destinations Section */}
            <section className="DestinationsSection">
                <h2 className="SectionTitle">
                    <span className="SectionIcon">🗺️</span>
                    Popular Destinations
                </h2>
                <div className="DestinationsGrid">
                    <div className="DestinationCard">
                        <div className="DestinationImage">
                            <span className="DestinationIcon">🏖️</span>
                            <div className="DestinationOverlay">
                                <h3>Tropical Paradise</h3>
                                <p>Crystal clear waters and sandy beaches</p>
                            </div>
                        </div>
                    </div>
                    <div className="DestinationCard">
                        <div className="DestinationImage">
                            <span className="DestinationIcon">🏔️</span>
                            <div className="DestinationOverlay">
                                <h3>Mountain Adventures</h3>
                                <p>Breathtaking peaks and hiking trails</p>
                            </div>
                        </div>
                    </div>
                    <div className="DestinationCard">
                        <div className="DestinationImage">
                            <span className="DestinationIcon">🏛️</span>
                            <div className="DestinationOverlay">
                                <h3>Cultural Wonders</h3>
                                <p>Historic sites and rich traditions</p>
                            </div>
                        </div>
                    </div>
                    <div className="DestinationCard">
                        <div className="DestinationImage">
                            <span className="DestinationIcon">🏙️</span>
                            <div className="DestinationOverlay">
                                <h3>Urban Escapes</h3>
                                <p>Vibrant cities and metropolitan experiences</p>
                            </div>
                        </div>
                    </div>
                    <div className="DestinationCard">
                        <div className="DestinationImage">
                            <span className="DestinationIcon">🌊</span>
                            <div className="DestinationOverlay">
                                <h3>Ocean Adventures</h3>
                                <p>Diving, sailing, and marine wildlife experiences</p>
                            </div>
                        </div>
                    </div>
                    <div className="DestinationCard">
                        <div className="DestinationImage">
                            <span className="DestinationIcon">🌿</span>
                            <div className="DestinationOverlay">
                                <h3>Nature Retreats</h3>
                                <p>Peaceful forests and wildlife sanctuaries</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
