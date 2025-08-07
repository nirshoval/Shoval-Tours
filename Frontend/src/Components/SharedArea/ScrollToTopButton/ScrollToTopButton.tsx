import "./ScrollToTopButton.css";

interface ScrollToTopButtonProps {
    onClick: () => void;
}

export function ScrollToTopButton({ onClick }: ScrollToTopButtonProps) {
    return (
        <button 
            className="scroll-to-top-button" 
            onClick={onClick}
            aria-label="Scroll to top"
        >
            <svg 
                width="50" 
                height="30" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
}