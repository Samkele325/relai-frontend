"use client";

import { useEffect } from "react";
import Script from "next/script";
import "./questionnaire.css";

export default function QuestionnairePage() {
  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>(".form-step"));
    const nextBtns = Array.from(document.querySelectorAll<HTMLButtonElement>(".next-btn"));
    const progressFill = document.getElementById("progressFill") as HTMLDivElement | null;
    const progressText = document.getElementById("progressText") as HTMLSpanElement | null;

    let currentStep = 0;

    function updateProgress() {
      if (!progressFill || !progressText) return;

      let percent = ((currentStep + 1) / steps.length) * 100;
      progressFill.style.width = percent + "%";
      progressText.innerText = Math.round(percent) + "%";
    }

    updateProgress();

    const nextBtnHandlers = new Map<HTMLButtonElement, (event: MouseEvent) => void>();

    nextBtns.forEach((btn) => {
      if (btn.id !== "viewAnalysisBtn" && btn.id !== "premiumPayBtn") {
        const handler = () => {
          if (currentStep < steps.length - 1) {
            currentStep++;
            steps[currentStep].scrollIntoView({ behavior: "smooth" });
            steps[currentStep].classList.add("active");
            updateProgress();
          }
        };

        nextBtnHandlers.set(btn, handler);
        btn.addEventListener("click", handler);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    steps.forEach((step) => {
      observer.observe(step);
    });

    const countryInput = document.getElementById("country") as HTMLSelectElement | null;
    const fundsSelect = document.getElementById("funds") as HTMLSelectElement | null;
    const premiumPrice = document.getElementById("premiumPrice") as HTMLDivElement | null;

    const pricingMap: Record<
      string,
      {
        free: string;
        premium: string;
        funds: string[];
      }
    > = {
      "South Africa": {
        free: "R250 ZAR (~$15 USD)",
        premium: "R250 ZAR (~$15 USD)",
        funds: ["Under R50k", "R50k–R100k", "R100k–R300k", "R300k+"],
      },

      Brazil: {
        free: "R$75 BRL (~$15 USD)",
        premium: "R$75 BRL (~$15 USD)",
        funds: ["Under R$10k", "R$10k–R50k", "R$50k–R$150k", "R$150k+"],
      },

      India: {
        free: "₹1,441 INR (~$15 USD)",
        premium: "₹1,441 INR (~$15 USD)",
        funds: ["Under ₹100k", "₹100k–₹500k", "₹500k–₹1M", "₹1M+"],
      },

      Nigeria: {
        free: "₦20,563 NGN (~$15 USD)",
        premium: "₦20,563 NGN (~$15 USD)",
        funds: ["Under ₦5M", "₦5M–₦15M", "₦15M–₦50M", "₦50M+"],
      },

      "United States": {
        free: "$15 USD",
        premium: "$15 USD",
        funds: ["Under $5k", "$5k–$10k", "$10k–$30k", "$30k+"],
      },
    };

    function updateCurrencyUI() {
      if (!countryInput || !fundsSelect || !premiumPrice) return;

      const selectedCountry = countryInput.value;

      const config = pricingMap[selectedCountry] || pricingMap["United States"];

      premiumPrice.innerText = config.premium;

      const fundsLabel = document.getElementById("fundsLabel");
      if (fundsLabel) {
        fundsLabel.innerHTML = `
    Available Funds
    <span style="
      display:block;
      margin-top:8px;
      color:#8b6f47;
      font-size:0.95rem;
      font-weight:600;
    ">
      Estimated relocation benchmark:
      ${config.free}
    </span>
  `;
      }

      fundsSelect.innerHTML = `
    <option>Select Range</option>
    ${config.funds
      .map(
        (item) => `
      <option>${item}</option>
    `
      )
      .join("")}
  `;
    }

    if (countryInput) {
      countryInput.addEventListener("change", updateCurrencyUI);
    }

    updateCurrencyUI();

    function getQuestionnaireData() {
      const selectedGoal = document.querySelector<HTMLInputElement>('input[name="goal"]:checked');

      const selectedCountries: string[] = [];

      const canada = document.getElementById("canada") as HTMLInputElement | null;
      const uk = document.getElementById("uk") as HTMLInputElement | null;
      const usa = document.getElementById("usa") as HTMLInputElement | null;

      if (canada?.checked) {
        selectedCountries.push("Canada");
      }

      if (uk?.checked) {
        selectedCountries.push("United Kingdom");
      }

      if (usa?.checked) {
        selectedCountries.push("United States");
      }

      return {
        name: (document.getElementById("name") as HTMLInputElement | null)?.value || "",
        email: (document.getElementById("email") as HTMLInputElement | null)?.value || "",
        age: (document.getElementById("age") as HTMLInputElement | null)?.value || "",
        citizenship: (document.getElementById("citizenship") as HTMLInputElement | null)?.value || "",
        country: (document.getElementById("country") as HTMLSelectElement | null)?.value || "",
        education: (document.getElementById("education") as HTMLSelectElement | null)?.value || "",
        profession: (document.getElementById("profession") as HTMLInputElement | null)?.value || "",
        experience: (document.getElementById("experience") as HTMLInputElement | null)?.value || "",
        funds: (document.getElementById("funds") as HTMLSelectElement | null)?.value || "",
        goal: selectedGoal ? selectedGoal.value : "",
        destination_interest: selectedCountries,
      };
    }

    function saveQuestionnaireSnapshot(data: ReturnType<typeof getQuestionnaireData>) {
      localStorage.setItem("relai_questionnaire", JSON.stringify(data));
      sessionStorage.setItem("relai_questionnaire", JSON.stringify(data));

      localStorage.setItem("relai_email", data.email || "");
      sessionStorage.setItem("relai_email", data.email || "");

      localStorage.setItem("relai_origin_country", data.country || "");
      sessionStorage.setItem("relai_origin_country", data.country || "");

      localStorage.setItem("relai_profession", data.profession || "");
      sessionStorage.setItem("relai_profession", data.profession || "");
    }

    const questionnaireEmailInput = document.getElementById("email") as HTMLInputElement | null;
    const premiumEmailInput = document.getElementById("premiumEmail") as HTMLInputElement | null;

    function hydrateEmails() {
      if (!questionnaireEmailInput || !premiumEmailInput) return;

      const storedEmail =
        localStorage.getItem("relai_email") ||
        sessionStorage.getItem("relai_email") ||
        questionnaireEmailInput.value ||
        "";

      if (storedEmail && !questionnaireEmailInput.value) {
        questionnaireEmailInput.value = storedEmail;
      }

      if (storedEmail && !premiumEmailInput.value) {
        premiumEmailInput.value = storedEmail;
      }
    }

    const onQuestionnaireEmailInput = () => {
      if (!questionnaireEmailInput) return;
      localStorage.setItem("relai_email", questionnaireEmailInput.value);
      sessionStorage.setItem("relai_email", questionnaireEmailInput.value);
    };

    const onPremiumEmailInput = () => {
      if (!premiumEmailInput || !questionnaireEmailInput) return;
      localStorage.setItem("relai_email", premiumEmailInput.value);
      sessionStorage.setItem("relai_email", premiumEmailInput.value);
      questionnaireEmailInput.value = premiumEmailInput.value;
    };

    questionnaireEmailInput?.addEventListener("input", onQuestionnaireEmailInput);
    premiumEmailInput?.addEventListener("input", onPremiumEmailInput);

    hydrateEmails();

    const viewAnalysisBtn = document.getElementById("viewAnalysisBtn") as HTMLButtonElement | null;
    const loadingState = document.getElementById("loadingState") as HTMLDivElement | null;

    const onViewAnalysisClick = async () => {
      if (!loadingState) return;

      loadingState.style.display = "block";

      const questionnaireData = getQuestionnaireData();

      saveQuestionnaireSnapshot(questionnaireData);

      try {
        const response = await fetch("/generate-free-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionnaireData),
        });

        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        const aiResult = await response.json();

        localStorage.setItem("relocation_analysis_result", JSON.stringify(aiResult));
        sessionStorage.setItem("relocation_analysis_result", JSON.stringify(aiResult));

        window.location.href = "result.html";
      } catch (error) {
        console.error(error);
        alert("Failed to generate AI analysis.");
        loadingState.style.display = "none";
      }
    };

    viewAnalysisBtn?.addEventListener("click", onViewAnalysisClick);

    const premiumBtn = document.getElementById("premiumBtn") as HTMLButtonElement | null;
    const premiumModal = document.getElementById("premiumModal") as HTMLDivElement | null;
    const closeModal = document.getElementById("closeModal") as HTMLButtonElement | null;
    const premiumPayBtn = document.getElementById("premiumPayBtn") as HTMLButtonElement | null;
    const paypalContainer = document.getElementById("paypal-button-container") as HTMLDivElement | null;
    const paypalPlaceholder = document.getElementById("paypalPlaceholder") as HTMLDivElement | null;

    let firebaseDocId: string | null = null;
    let paypalRendered = false;
    let pendingPaymentIntent: any = null;

    function openPremiumModal() {
      if (!premiumModal || !premiumEmailInput) return;

      const questionnaireData = getQuestionnaireData();

      saveQuestionnaireSnapshot(questionnaireData);

      premiumEmailInput.value =
        questionnaireData.email || localStorage.getItem("relai_email") || "";

      premiumModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closePremiumModal() {
      if (!premiumModal) return;

      premiumModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    premiumBtn?.addEventListener("click", openPremiumModal);
    closeModal?.addEventListener("click", closePremiumModal);

    const onModalOverlayClick = (e: MouseEvent) => {
      if (e.target === premiumModal) {
        closePremiumModal();
      }
    };

    premiumModal?.addEventListener("click", onModalOverlayClick);

    const onEscapeKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && premiumModal?.classList.contains("active")) {
        closePremiumModal();
      }
    };

    document.addEventListener("keydown", onEscapeKeyDown);

    function buildPaymentIntentData() {
      const questionnaireData = getQuestionnaireData();

      const email = (premiumEmailInput?.value.trim() || questionnaireData.email.trim()) as string;

      return {
        email,
        questionnaire: questionnaireData,
        selectedCountry: questionnaireData.country,
        profession: questionnaireData.profession,
        paymentIntent: true,
        paymentStatus: "pending",
        premiumUnlocked: false,
        createdAt: new Date().toISOString(),
      };
    }

    async function savePaymentIntent(data: any) {
      localStorage.setItem("relai_payment_intent", JSON.stringify(data));
      sessionStorage.setItem("relai_payment_intent", JSON.stringify(data));

      localStorage.setItem("relai_payment_status", "pending");
      sessionStorage.setItem("relai_payment_status", "pending");

      saveQuestionnaireSnapshot(data.questionnaire);

      if (typeof window !== "undefined" && (window as any).db) {
        try {
          const { addDoc, collection } = await import("firebase/firestore");
          const docRef = await addDoc(collection((window as any).db, "relai_payments"), data);
          firebaseDocId = docRef.id;
        } catch (error) {
          console.error("Firebase save failed:", error);
        }
      }
    }

    const onPremiumPayClick = async () => {
      const questionnaireData = getQuestionnaireData();
      const email = premiumEmailInput?.value.trim() || questionnaireData.email.trim();

      if (!email) {
        alert("Please confirm your email.");
        return;
      }

      if (premiumEmailInput) premiumEmailInput.value = email;
      if (questionnaireEmailInput) questionnaireEmailInput.value = email;

      const paymentIntentData = buildPaymentIntentData();
      pendingPaymentIntent = paymentIntentData;

      saveQuestionnaireSnapshot(questionnaireData);
      localStorage.setItem("relai_email", email);
      sessionStorage.setItem("relai_email", email);

      try {
        await savePaymentIntent(paymentIntentData);

        if (!paypalContainer || !paypalPlaceholder) return;

        paypalContainer.classList.add("active");
        paypalPlaceholder.style.display = "block";
        paypalPlaceholder.innerText = "Preparing secure PayPal checkout...";

        if ((window as any).paypal && typeof (window as any).paypal.Buttons === "function") {
          if (!paypalRendered) {
            paypalRendered = true;

            paypalPlaceholder.style.display = "none";

            (window as any).paypal
              .Buttons({
                style: {
                  layout: "vertical",
                  shape: "pill",
                  color: "gold",
                  label: "paypal",
                },

                createOrder: function (data: any, actions: any) {
                  const selectedCountry = (document.getElementById("country") as HTMLSelectElement | null)?.value;

                  let amount = "15";

                  if (selectedCountry === "South Africa") {
                    amount = "14";
                  }

                  if (selectedCountry === "Brazil") {
                    amount = "15";
                  }

                  if (selectedCountry === "India") {
                    amount = "16";
                  }

                  if (selectedCountry === "Nigeria") {
                    amount = "13";
                  }

                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount,
                        },
                      },
                    ],
                  });
                },

                onApprove: async function (data: any, actions: any) {
                  try {
                    const details = await actions.order.capture();

                    localStorage.setItem("premium_unlocked", "true");
                    sessionStorage.setItem("premium_unlocked", "true");

                    localStorage.setItem("relai_payment_status", "paid");
                    sessionStorage.setItem("relai_payment_status", "paid");

                    localStorage.setItem(
                      "relai_payment_receipt",
                      JSON.stringify({
                        paypalOrderId: data.orderID,
                        details,
                        paidAt: new Date().toISOString(),
                      })
                    );

                    sessionStorage.setItem(
                      "relai_payment_receipt",
                      JSON.stringify({
                        paypalOrderId: data.orderID,
                        details,
                        paidAt: new Date().toISOString(),
                      })
                    );

                    if (firebaseDocId && (window as any).db) {
                      try {
                        const { doc, updateDoc } = await import("firebase/firestore");
                        await updateDoc(doc((window as any).db, "relai_payments", firebaseDocId), {
                          paymentStatus: "paid",
                          premiumUnlocked: true,
                          paypalOrderId: data.orderID,
                          paidAt: new Date().toISOString(),
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    }

                    window.location.href = "result.html";
                  } catch (err) {
                    console.error(err);
                    alert("Payment approval failed. Please try again.");
                  }
                },

                onError: function (err: any) {
                  console.error(err);
                  alert("Payment failed. Please try again.");
                },
              })
              .render("#paypal-button-container");
          }
        } else {
          paypalPlaceholder.style.display = "block";
          paypalPlaceholder.innerText =
            "PayPal is not ready yet. Please check your client ID and reload the page.";
        }
      } catch (error) {
        console.error(error);
        alert("Failed to initialize payment.");
      }
    };

    premiumPayBtn?.addEventListener("click", onPremiumPayClick);

    return () => {
      nextBtns.forEach((btn) => {
        const handler = nextBtnHandlers.get(btn);
        if (handler) btn.removeEventListener("click", handler);
      });

      observer.disconnect();

      if (countryInput) {
        countryInput.removeEventListener("change", updateCurrencyUI);
      }

      questionnaireEmailInput?.removeEventListener("input", onQuestionnaireEmailInput);
      premiumEmailInput?.removeEventListener("input", onPremiumEmailInput);
      viewAnalysisBtn?.removeEventListener("click", onViewAnalysisClick);
      premiumBtn?.removeEventListener("click", openPremiumModal);
      closeModal?.removeEventListener("click", closePremiumModal);
      premiumModal?.removeEventListener("click", onModalOverlayClick);
      document.removeEventListener("keydown", onEscapeKeyDown);
      premiumPayBtn?.removeEventListener("click", onPremiumPayClick);
    };
  }, []);

  return (
    <>
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      <nav>
        <div className="logo">RelAI</div>

        <a href="landing.html" className="back-btn">
          ← Back
        </a>
      </nav>

      <div className="container">
        <div className="header">
          <div className="badge">AI-Powered Relocation Assessment</div>

          <h1>Find Your Best Visa Pathway</h1>

          <p>
            Complete this quick assessment and our AI will analyze your relocation opportunities based on your profile,
            finances, experience, and goals.
          </p>
        </div>

        <div className="progress-wrapper">
          <div className="progress-card">
            <div className="progress-top">
              <span>Assessment Progress</span>
              <span id="progressText">16%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" id="progressFill"></div>
            </div>
          </div>
        </div>

        <section className="form-step active">
          <div className="card">
            <span className="step-label">SECTION 1</span>

            <h2>Basic Information</h2>

            <p>Tell us a little about yourself so we can personalize your relocation analysis.</p>

            <div className="input-group">
              <label>Full Name</label>
              <input type="text" id="name" placeholder="Enter your full name" />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>

            <div className="input-group">
              <label>Age</label>
              <input type="number" id="age" placeholder="Enter your age" />
            </div>

            <div className="input-group">
              <label>Citizenship</label>
              <input type="text" id="citizenship" placeholder="e.g South African" />
            </div>

            <div className="input-group">
              <label>Current Country</label>

              <select id="country">
                <option value="">Select Country</option>
                <option value="South Africa">South Africa</option>
                <option value="Brazil">Brazil</option>
                <option value="India">India</option>
                <option value="Nigeria">Nigeria</option>
                <option value="United States">United States</option>
              </select>
            </div>

            <div className="btn-row">
              <button className="next-btn">Continue →</button>
            </div>
          </div>
        </section>

        <section className="form-step">
          <div className="card">
            <span className="step-label">SECTION 2</span>

            <h2>Education</h2>

            <p>Your education level helps us identify eligible visa pathways.</p>

            <div className="input-group">
              <label>Highest Education Level</label>

              <select id="education">
                <option>Select Education</option>
                <option>High School</option>
                <option>Diploma</option>
                <option>Bachelor’s</option>
                <option>Master’s</option>
                <option>PhD</option>
              </select>
            </div>

            <div className="btn-row">
              <button className="next-btn">Continue →</button>
            </div>
          </div>
        </section>

        <section className="form-step">
          <div className="card">
            <span className="step-label">SECTION 3</span>

            <h2>Work Experience</h2>

            <p>Your work history plays a major role in relocation eligibility.</p>

            <div className="input-group">
              <label>Current Job Title</label>
              <input type="text" id="profession" placeholder="e.g Software Engineer" />
            </div>

            <div className="input-group">
              <label>Years of Experience</label>
              <input type="number" id="experience" placeholder="e.g 3" />
            </div>

            <div className="btn-row">
              <button className="next-btn">Continue →</button>
            </div>
          </div>
        </section>

        <section className="form-step">
          <div className="card">
            <span className="step-label">SECTION 4</span>

            <h2>Finances</h2>

            <p>This helps us estimate affordability and relocation readiness.</p>

            <div className="input-group">
              <label id="fundsLabel">Available Funds</label>

              <select id="funds">
                <option>Select Range</option>
              </select>
            </div>

            <div className="btn-row">
              <button className="next-btn">Continue →</button>
            </div>
          </div>
        </section>

        <section className="form-step">
          <div className="card">
            <span className="step-label">SECTION 5</span>

            <h2>Your Goals</h2>

            <p>Select the main reason you want to move abroad.</p>

            <div className="option-grid">
              <div className="radio-card">
                <input type="radio" id="study" name="goal" value="Study Abroad" />
                <label htmlFor="study">🎓 Study Abroad</label>
              </div>

              <div className="radio-card">
                <input type="radio" id="work" name="goal" value="Work Abroad" />
                <label htmlFor="work">💼 Work Abroad</label>
              </div>

              <div className="radio-card">
                <input type="radio" id="relocate" name="goal" value="Permanent Relocation" />
                <label htmlFor="relocate">🌍 Permanent Relocation</label>
              </div>
            </div>

            <div className="btn-row">
              <button className="next-btn">Continue →</button>
            </div>
          </div>
        </section>

        <section className="form-step">
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
              <button className="next-btn" id="finishBtn">
                Finish Assessment →
              </button>
            </div>
          </div>
        </section>

        <section className="form-step">
          <div className="card success-card">
            <span className="step-label">COMPLETE</span>

            <h2>Assessment Submitted Successfully</h2>

            <p>
              Your AI relocation analysis is now being prepared. We’ll generate the best migration pathways, country
              matches, and recommendations for your profile.
            </p>

            <button id="viewAnalysisBtn" className="next-btn">
              View AI Analysis
            </button>

            <button id="premiumBtn" className="premium-btn">
              ✨ Get Full AI Report
            </button>

            <div id="loadingState" className="loading-state">
              <div className="spinner"></div>

              <h3>Generating Your AI Relocation Roadmap...</h3>

              <p>RelAI is analyzing your profile, profession, finances, and destination opportunities.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="modal-overlay" id="premiumModal">
        <div className="premium-modal">
          <button className="close-modal" id="closeModal">
            ✕
          </button>

          <h2 className="modal-title">Unlock Your Full AI Relocation Roadmap 🌍</h2>

          <p className="modal-subtitle">
            Get a deeper AI-powered breakdown tailored to your career, finances, immigration profile, and relocation
            goals.
          </p>

          <div className="checklist">
            <div className="check-item">
              <div className="tick">✓</div>
              <span>Detailed eligibility analysis</span>
            </div>

            <div className="check-item">
              <div className="tick">✓</div>
              <span>Best cities for your profession</span>
            </div>

            <div className="check-item">
              <div className="tick">✓</div>
              <span>Salary expectations</span>
            </div>

            <div className="check-item">
              <div className="tick">✓</div>
              <span>Step-by-step relocation roadmap</span>
            </div>

            <div className="check-item">
              <div className="tick">✓</div>
              <span>Visa comparisons</span>
            </div>

            <div className="check-item">
              <div className="tick">✓</div>
              <span>Estimated timelines</span>
            </div>

            <div className="check-item">
              <div className="tick">✓</div>
              <span>Required documents checklist</span>
            </div>

            <div className="check-item">
              <div className="tick">✓</div>
              <span>AI-powered relocation strategy</span>
            </div>
          </div>

          <div className="price-box">
            <div className="price-label">Full Premium AI Report</div>

            <div className="dynamic-price" id="premiumPrice">
              $15 USD
            </div>
          </div>

          <div className="email-confirm">
            <input type="email" id="premiumEmail" placeholder="Confirm your email address" />

            <small>Your email is prefilled from the questionnaire and can be edited here.</small>
          </div>

          <button className="next-btn" id="premiumPayBtn" style={{ width: "100%" }}>
            Continue To Secure Payment
          </button>

          <div className="paypal-wrapper" id="paypal-button-container">
            <div className="paypal-placeholder" id="paypalPlaceholder">
              PayPal checkout will appear here after you continue to secure payment.
            </div>
          </div>
        </div>
      </div>

      <Script
        src="https://www.paypal.com/sdk/js?client-id=AYLeuCy_I_Kll_oOMGZl0Aza8fa7mIta9-sSIq9-p_RHPlXEclyBsIKtvney6okR39OfPuyXzAypegFv&currency=USD"
        strategy="afterInteractive"
      />
    </>
  );
}