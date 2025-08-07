import css from "./Copyrights.module.css";

export function Copyrights() {
    return (
        <div className={css.Centered}>
            <p className={css.Dark}>
                <span className={css.CopyrightIcon}>🌍</span>
                All Rights Reserved Nir Shoval © 2025
            </p>
            <p className={css.Tagline}>
                Making your travel dreams come true!
            </p>
        </div>
    );
}
