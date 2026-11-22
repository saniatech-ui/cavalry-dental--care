/* ==========================================================================
   Cavalry Dental & Aesthetic Care — Interactive Clinical Concierge Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const WHATSAPP_NUMBER = "923140777071";

    // ======================================================================
    // 1. Sticky Header Scroll Shadow & Mobile Navigation Drawer
    // ======================================================================
    const siteHeader = document.getElementById("siteHeader");
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    const handleHeaderScroll = () => {
        if (!siteHeader) return;
        if (window.scrollY > 24) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("is-open");
            mobileToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("is-open");
                mobileToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ======================================================================
    // 2. Active Navigation Link Highlighting on Scroll
    // ======================================================================
    const sections = document.querySelectorAll("main section[id]");

    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${id}`
                    );
                });
            }
        });
    };

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    // ======================================================================
    // 3. Filterable Treatments Menu (All Services / Dental / Aesthetic)
    // ======================================================================
    const filterTabs = document.querySelectorAll(".filter-tab");
    const treatmentCards = document.querySelectorAll(".treatment-card");

    filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const selectedCategory = tab.getAttribute("data-filter");

            // Update active tab state & accessibility attributes
            filterTabs.forEach((btn) => {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");

            // Filter treatment cards
            treatmentCards.forEach((card) => {
                const cardCategory = card.getAttribute("data-category");
                const shouldShow =
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory;

                card.classList.toggle("is-hidden", !shouldShow);
            });
        });
    });

    // ======================================================================
    // 4. Interactive Appointment Booking Modal & WhatsApp Concierge Builder
    // ======================================================================
    const bookingModal = document.getElementById("bookingModal");
    const closeBookingModalBtn = document.getElementById("closeBookingModal");
    const openBookingTriggers = document.querySelectorAll("[data-open-booking]");
    const bookingForm = document.getElementById("bookingForm");

    const branchSelect = document.getElementById("branchSelect");
    const treatmentSelect = document.getElementById("treatmentSelect");
    const preferredDateInput = document.getElementById("preferredDate");
    const preferredTimeSelect = document.getElementById("preferredTime");
    const patientNameInput = document.getElementById("patientName");
    const patientNotesInput = document.getElementById("patientNotes");

    // Set minimum selectable date to today & default to today
    if (preferredDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const formattedToday = `${yyyy}-${mm}-${dd}`;
        preferredDateInput.min = formattedToday;
        preferredDateInput.value = formattedToday;
    }

    const openModal = (presetBranch = "", presetTreatment = "") => {
        if (!bookingModal) return;

        // Close mobile menu if open
        if (navMenu && mobileToggle) {
            navMenu.classList.remove("is-open");
            mobileToggle.setAttribute("aria-expanded", "false");
        }

        // Pre-select branch if triggered from a branch card
        if (presetBranch && branchSelect) {
            const branchMatch = Array.from(branchSelect.options).find(
                (opt) => opt.value.toLowerCase() === presetBranch.toLowerCase()
            );
            if (branchMatch) {
                branchSelect.value = branchMatch.value;
            }
        }

        // Pre-select treatment/package if triggered from a package card
        if (presetTreatment && treatmentSelect) {
            const treatmentMatch = Array.from(treatmentSelect.options).find(
                (opt) =>
                    opt.value.toLowerCase() === presetTreatment.toLowerCase()
            );
            if (treatmentMatch) {
                treatmentSelect.value = treatmentMatch.value;
            }
        }

        bookingModal.hidden = false;
        // Force reflow so CSS opacity/transform transition triggers smoothly
        void bookingModal.offsetWidth;
        bookingModal.classList.add("is-open");
        document.body.style.overflow = "hidden";

        if (patientNameInput) {
            setTimeout(() => patientNameInput.focus(), 120);
        }
    };

    const closeModal = () => {
        if (!bookingModal) return;
        bookingModal.classList.remove("is-open");
        document.body.style.overflow = "";

        setTimeout(() => {
            if (!bookingModal.classList.contains("is-open")) {
                bookingModal.hidden = true;
            }
        }, 260);
    };

    openBookingTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const branch = trigger.getAttribute("data-branch") || "";
            const treatment = trigger.getAttribute("data-treatment") || "";
            openModal(branch, treatment);
        });
    });

    if (closeBookingModalBtn) {
        closeBookingModalBtn.addEventListener("click", closeModal);
    }

    if (bookingModal) {
        bookingModal.addEventListener("click", (event) => {
            if (event.target === bookingModal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            bookingModal &&
            bookingModal.classList.contains("is-open")
        ) {
            closeModal();
        }
    });

    if (bookingForm) {
        bookingForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const patientName = patientNameInput ? patientNameInput.value.trim() : "";
            const branch = branchSelect ? branchSelect.value : "Cavalry Ground";
            const treatment = treatmentSelect
                ? treatmentSelect.value
                : "General Dental Consultation";
            const rawDate = preferredDateInput ? preferredDateInput.value : "";
            const timeSlot = preferredTimeSelect
                ? preferredTimeSelect.value
                : "05:00 PM – 08:00 PM";
            const notes = patientNotesInput ? patientNotesInput.value.trim() : "";

            // Format YYYY-MM-DD into a clean readable date (e.g., 24 Nov 2026)
            let formattedDate = rawDate;
            if (rawDate) {
                const dateObj = new Date(`${rawDate}T00:00:00`);
                if (!Number.isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });
                }
            }

            const messageLines = [
                "Hello Cavalry Dental & Aesthetic Care,",
                "I would like to request an appointment:",
                "",
                `*Patient Name:* ${patientName}`,
                `*Branch:* ${branch}, Lahore`,
                `*Treatment / Package:* ${treatment}`,
                `*Preferred Date:* ${formattedDate}`,
                `*Preferred Time:* ${timeSlot}`,
            ];

            if (notes) {
                messageLines.push(`*Notes:* ${notes}`);
            }

            messageLines.push("", "Please confirm my slot. Thank you!");

            const encodedMessage = encodeURIComponent(messageLines.join("\n"));
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
            closeModal();
        });
    }

    // ======================================================================
    // 5. Subtle Scroll-Reveal Animations
    // ======================================================================
    const revealTargets = document.querySelectorAll(
        ".hero-content, .hero-visual, .treatment-card, .package-card, .bridal-banner, .review-card, .branch-card, .concierge-bar"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                rootMargin: "0px 0px -40px 0px",
                threshold: 0.12,
            }
        );

        revealTargets.forEach((el) => {
            el.classList.add("reveal-hidden");
            revealObserver.observe(el);
        });
    }
});