import React from 'react'
import { Link, useNavigate } from 'react-router'
import './notFound.scss'

const NotFound = ({
    code = "404",
    title = "Oops! Page not found",
    message = "The page you're looking for seems to have taken a different path. Let's get you back on track.",
    linkTo = "/",
    linkText = "Back to Home",
}) => {

    const navigate = useNavigate()

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1)
        } else {
            navigate('/')
        }
    }

    return (
        <main className="not-found">

            {/* Background Effects */}
            <div className="not-found__background">
                <span className="not-found__orb not-found__orb--one"></span>
                <span className="not-found__orb not-found__orb--two"></span>
                <span className="not-found__grid"></span>
            </div>

            {/* Main Content */}
            <section className="not-found__content">

                {/* Status Badge */}
                <div className="not-found__badge">
                    <span className="not-found__badge-dot"></span>
                    SYSTEM MESSAGE
                </div>

                {/* Animated 404 */}
                {code && (
                    <div className="not-found__visual">
                        <span className="not-found__code">{code}</span>

                        <div className="not-found__planet">
                            <div className="not-found__planet-ring"></div>
                            <div className="not-found__planet-core">
                                <span>?</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Text Content */}
                <div className="not-found__heading">
                    <p className="not-found__eyebrow">
                        LOST IN THE DIGITAL SPACE
                    </p>

                    <h1 className="not-found__title">
                        {title}
                        <span className="not-found__title-dot">.</span>
                    </h1>

                    <p className="not-found__text">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="not-found__actions">

                    <Link to={linkTo} className="not-found__link">
                        <span>{linkText}</span>
                        <span className="not-found__arrow">↗</span>
                    </Link>

                    <button
                        type="button"
                        className="not-found__back"
                        onClick={handleGoBack}
                    >
                        <span className="not-found__back-icon">←</span>
                        Go Back
                    </button>

                </div>

                {/* Footer */}
                <div className="not-found__footer">
                    <span className="not-found__footer-line"></span>
                    <p>
                        <span className="not-found__footer-brand">
                            InterviewIQ
                        </span>
                        <span className="not-found__footer-separator">/</span>
                        Even the best journeys take a wrong turn sometimes.
                    </p>
                    <span className="not-found__footer-line"></span>
                </div>

            </section>

        </main>
    )
}

export default NotFound