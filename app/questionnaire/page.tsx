"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./questionnaire.css";

export default function QuestionnairePage() {
  const stepsRef = useRef<HTMLElement[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = 7;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  useEffect(() => {
    const currentSection = stepsRef.current[currentStep];
    if (currentSection) {
      currentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  return (
    <>
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      {/* NAV */}

      <nav>
        <div className="logo">RelAI</div>

        <Link href="/" className="back-btn">
          ← Back
        </Link>
      </nav>

      {/* MAIN */}

      <div className="container">
        {/* HEADER */}

        <div className="header">
          <div className="badge">AI-Powered Relocation Assessment</div>

          <h1>Find Your Best Visa Pathway</h1>

          <p>
            Complete this quick assessment and our AI will analyze your
            relocation opportunities based on your profile, finances,
            experience, and goals.
          </p>
        </div>

        {/* PROGRESS */}

        <div className="progress-wrapper">
          <div className="progress-card">
            <div className="progress-top">
              <span>Assessment Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* STEP 1 */}

        <section
          ref={(el) => {
            if (el) stepsRef.current[0] = el;
          }}
          className={`form-step ${currentStep === 0 ? "active" : ""}`}
        >
          <div className="card">
            <span className="step-label">SECTION 1</span>

            <h2>Basic Information</h2>

            <p>
              Tell us a little about yourself so we can personalize your
              relocation analysis.
            </p>

            <div className="input-group">
              <label>Age</label>
              <input type="number" placeholder="Enter your age" />
            </div>

            <div className="input-group">
              <label>Citizenship</label>
              <input type="text" placeholder="e.g South African" />
            </div>

            <div className="input-group">
              <label>Current Country</label>
              <input type="text" placeholder="e.g South Africa" />
            </div>

            <div className="btn-row">
              <button type="button" className="next-btn" onClick={handleNext}>
                Continue →
              </button>
            </div>
          </div>
        </section>

        {/* STEP 2 */}

        <section
          ref={(el) => {
            if (el) stepsRef.current[1] = el;
          }}
          className={`form-step ${currentStep === 1 ? "active" : ""}`}
        >
          <div className="card">
            <span className="step-label">SECTION 2</span>

            <h2>Education</h2>

            <p>Your education level helps us identify eligible visa pathways.</p>

            <div className="input-group">
              <label>Highest Education Level</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select Education
                </option>
                <option>High School</option>
                <option>Diploma</option>
                <option>Bachelor’s</option>
                <option>Master’s</option>
                <option>PhD</option>
              </select>
            </div>

            <div className="btn-row">
              <button type="button" className="next-btn" onClick={handleNext}>
                Continue →
              </button>
            </div>
          </div>
        </section>

        {/* STEP 3 */}

        <section
          ref={(el) => {
            if (el) stepsRef.current[2] = el;
          }}
          className={`form-step ${currentStep === 2 ? "active" : ""}`}
        >
          <div className="card">
            <span className="step-label">SECTION 3</span>

            <h2>Work Experience</h2>

            <p>Your work history plays a major role in relocation eligibility.</p>

            <div className="input-group">
              <label>Current Job Title</label>
              <input type="text" placeholder="e.g Software Engineer" />
            </div>

            <div className="input-group">
              <label>Years of Experience</label>
              <input type="number" placeholder="e.g 3" />
            </div>

            <div className="btn-row">
              <button type="button" className="next-btn" onClick={handleNext}>
                Continue →
              </button>
            </div>
          </div>
        </section>

        {/* STEP 4 */}

        <section
          ref={(el) => {
            if (el) stepsRef.current[3] = el;
          }}
          className={`form-step ${currentStep === 3 ? "active" : ""}`}
        >
          <div className="card">
            <span className="step-label">SECTION 4</span>

            <h2>Finances</h2>

            <p>This helps us estimate affordability and relocation readiness.</p>

            <div className="input-group">
              <label>Available Funds</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select Range
                </option>
                <option>Under R50k</option>
                <option>R50k–R100k</option>
                <option>R100k–R300k</option>
                <option>R300k+</option>
              </select>
            </div>

            <div className="btn-row">
              <button type="button" className="next-btn" onClick={handleNext}>
                Continue →
              </button>
            </div>
          </div>
        </section>

        {/* STEP 5 */}

        <section
          ref={(el) => {
            if (el) stepsRef.current[4] = el;
          }}
          className={`form-step ${currentStep === 4 ? "active" : ""}`}
        >
          <div className="card">
            <span className="step-label">SECTION 5</span>

            <h2>Your Goals</h2>

            <p>Select the main reason you want to move abroad.</p>

            <div className="option-grid">
              <div className="radio-card">
                <input type="radio" id="study" name="goal" />
                <label htmlFor="study">🎓 Study Abroad</label>
              </div>

              <div className="radio-card">
                <input type="radio" id="work" name="goal" />
                <label htmlFor="work">💼 Work Abroad</label>
              </div>

              <div className="radio-card">
                <input type="radio" id="relocate" name="goal" />
                <label htmlFor="relocate">🌍 Permanent Relocation</label>
              </div>
            </div>

            <div className="btn-row">
              <button type="button" className="next-btn" onClick={handleNext}>
                Continue →
              </button>
            </div>
          </div>
        </section>

        {/* STEP 6 */}

        <section
          ref={(el) => {
            if (el) stepsRef.current[5] = el;
          }}
          className={`form-step ${currentStep === 5 ? "active" : ""}`}
        >
          <div className="card">
            <span className="step-label">SECTION 6</span>

            <h2>Target Countries</h2>

            <p>Choose the countries you are most interested in.</p>

            <div className="option-grid">
              <div className="check-card">
                <input type="checkbox" id="canada" />
                <label htmlFor="canada">🇨🇦 Canada</label>
              </div>

              <div className="check-card">
                <input type="checkbox" id="uk" />
                <label htmlFor="uk">🇬🇧 United Kingdom</label>
              </div>

              <div className="check-card">
                <input type="checkbox" id="usa" />
                <label htmlFor="usa">🇺🇸 United States</label>
              </div>
            </div>

            <div className="btn-row">
              <button type="button" className="next-btn" onClick={handleNext}>
                Finish Assessment →
              </button>
            </div>
          </div>
        </section>

        {/* FINAL */}

        <section
          ref={(el) => {
            if (el) stepsRef.current[6] = el;
          }}
          className={`form-step ${currentStep === 6 ? "active" : ""}`}
        >
          <div className="card success-card">
            <span className="step-label">COMPLETE</span>

            <h2>Assessment Submitted Successfully</h2>

            <p>
              Your AI relocation analysis is now being prepared. We’ll generate
              the best migration pathways, country matches, and
              recommendations for your profile.
            </p>

            <Link href="/result" className="next-btn">
              View AI Analysis
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}