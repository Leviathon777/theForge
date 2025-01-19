import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Style from "../styles/InvestorProfile.module.css";
import { Button } from "../components/componentsindex";
import { addForger } from "../firebase/forgeServices";

const InvestorProfile = ({ isOpen, onRequestClose, isClosing, openModal }) => {
    const router = useRouter();
    const { address, dripPercent, xdripBalance, bonusQualification } = router.query;

    const [walletAddress, setWalletAddress] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleInitial, setMiddleInitial] = useState("");
    const [lastName, setLastName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [phone, setPhone] = useState("");
    const [territory, setTerritory] = useState("");
    const [otherTerritory, setOtherTerritory] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [dob, setDob] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [ukFCAAgreed, setUKFCAAgreed] = useState(false);
    const [euAgreed, setEUAgreed] = useState(false);
    const [errors, setErrors] = useState({});

    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
    const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
    const [isUKComplianceModalOpen, setIsUKComplianceModalOpen] = useState(false);
    const [isEUComplianceModalOpen, setIsEUComplianceModalOpen] = useState(false);

    const Exempt = "Exempt";



    useEffect(() => {
        if (address) {
            setWalletAddress(address);
        } else {
            toast.info("Must connect a wallet to complete your profile.");
        }
    }, [address]);

    const truncateAddress = (address) => {
        if (!address) return "";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const requiresUKCompliance = territory === "UK";
    const requiresEUCompliance = territory === "EU";

    // Helper for phone code
    const getPhoneCode = () => {
        switch (territory) {
            case "US":
                return "+1";
            case "UK":
                return "+44";
            case "EU":
                return "+3x or +4x";
            default:
                return "";
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const enteredDob = new Date(dob);
        const age = today.getFullYear() - enteredDob.getFullYear();
        const is18OrOlder = age > 18 || (age === 18 && today >= new Date(enteredDob.setFullYear(enteredDob.getFullYear() + 18)));

        if (!firstName.trim()) newErrors.firstName = "First Name is required.";
        if (!lastName.trim()) newErrors.lastName = "Last Name is required.";
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
            newErrors.email = "Valid Email Address is required.";
        if (!territory) newErrors.territory = "Please select your territory.";
        if (!dob) {
            newErrors.dob = "Date of Birth is required.";
        } else if (!is18OrOlder) {
            newErrors.dob = "You must be at least 18 years old.";
        }
        if (!walletAddress) newErrors.walletAddress = "Wallet connection is required.";
        if (!agreed) newErrors.agreed = "You must agree to the Terms, User Agreement, and Privacy Policy.";

        // UK compliance
        if (requiresUKCompliance && !ukFCAAgreed) {
            newErrors.ukFCAAgreed = "You must agree to the FCA Disclosures and Agreement.";
        }

        // EU compliance
        if (requiresEUCompliance && !euAgreed) {
            newErrors.euAgreed = "You must confirm EU-related compliance to proceed.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTerritoryChange = (selectedTerritory) => {
        setTerritory(selectedTerritory);
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            // Display all errors in the toast
            Object.values(errors).forEach((error) => {
                toast.error(error); // Show each error as a separate toast notification
            });
            return;
        }

        // Construct the territory to store; "Other" => user input
        const finalTerritory = territory === "Other" ? otherTerritory : territory;

        // Build the profileData object to send to Firebase
        const profileData = {
            fullName: `${firstName} ${middleInitial ? middleInitial + " " : ""}${lastName}${surname ? " " + surname : ""
                }`,
            email,
            phone: phone || null,
            territory: finalTerritory,
            mailingAddress: {
                streetAddress: streetAddress || null,
                apartment: apartment || null,
                city: city || null,
                state: state || null,
                zipCode: zipCode || null,
            },
            walletAddress,
            dob,
            agreed,
            kyc: {
                kycStatus: "not submitted",
                kycCompletedAt: "N/A",
                kycSubmittedAt: "N/A",
                kycVerified: false,
            },
            // Only set these if needed
            ukFCAAgreed: requiresUKCompliance ? ukFCAAgreed : Exempt,
            euAgreed: requiresEUCompliance ? euAgreed : Exempt,
            dateOfJoin: new Date().toISOString(),
            drip: {
                dripCount: parseFloat(xdripBalance || 0),
                dripPercent: `${parseFloat(dripPercent || 0).toFixed(2)}%`,
                qualifiesForBonus: bonusQualification === "true" || bonusQualification === true,
                DateLastLogged: new Date().toISOString(),
            },
        };

        try {
            await addForger(profileData);
            toast.success("Profile submitted successfully!");
            setTimeout(() => {
                router.push("/TheForge");
            }, 3000);
        } catch (error) {
            console.error("Error submitting profile:", error);
            toast.error("Failed to submit your profile. Please try again.");
        }
    };

    const handleBackToForge = () => {
        router.push("/TheForge");
    };

    return (
        <div className={Style.container}>
            <h2 className={Style.title}>Create Your Investor Profile</h2>
            <div className={Style.splitContainer}>
                <div className={Style.left}>
                    <p className={Style.notice}>
                        Welcome to our secure investor profile setup. By completing this profile, you will gain access to a personalized and seamless investment experience. Here's how we ensure your data is secure and how it will be used:
                        <ul>
                            <li>
                                <strong>Data Privacy:</strong> We do not share your data with third parties unless you explicitly authorize it, such as during a <strong>KYC (Know Your Customer)</strong> process or a transaction facilitated by <strong>Transak</strong>.
                            </li>
                            <li>
                                <strong>Required Information:</strong> Your <strong>Full Name</strong>, <strong>Date of Birth</strong>, <strong>Email</strong>, <strong>Territory</strong>, and <strong>Wallet Address</strong> are essential for account management, regulatory compliance, and ensuring accurate tracking of your investments.
                            </li>
                            <li>
                                <strong>Optional Information:</strong> Providing your <strong>Phone Number</strong> and <strong>Mailing Address</strong> can help in account recovery and improving our support services.
                            </li>
                            <li>
                                <strong>Transparency:</strong> You are in control of your data. At any point, you can review or update your information, ensuring it remains up-to-date and accurate.
                            </li>
                        </ul>
                        Our commitment to your privacy and security ensures that your data is used solely to enhance your investment experience and meet regulatory requirements.
                    </p>
                </div>
                <div className={Style.right}>
                    <div className={Style.walletDisplay}>
                        {walletAddress ? (
                            <p title={walletAddress}>
                                <strong>Connected Wallet:</strong> {truncateAddress(walletAddress)}
                            </p>
                        ) : (
                            <p className={Style.errorMsg}>Wallet not connected. Please connect your wallet.</p>
                        )}
                    </div>
                    <div className={Style.groupedFields}>
                        <div className={Style.nameFields}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={errors.firstName ? Style.inputError : Style.inputField}
                            />
                            <input
                                type="text"
                                placeholder="M.I."
                                maxLength="1"
                                value={middleInitial}
                                onChange={(e) => setMiddleInitial(e.target.value)}
                                className={Style.middleInitial}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={errors.lastName ? Style.inputError : Style.inputField}
                            />
                            <select
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className={Style.surnameDropdown}
                            >
                                <option value="">Suffix</option>
                                <option value="Jr.">Jr.</option>
                                <option value="Sr.">Sr.</option>
                                <option value="Sr.">Mr.</option>
                                <option value="Sr.">Mrs.</option>
                                <option value="Sr.">Miss</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                            </select>
                        </div>
                    </div>

                    <div className={Style.dateOfBirthWrapper}>
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className={errors.dob ? Style.inputError : Style.inputField}
                        />
                        <input
                            type="email"
                            placeholder="Your Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? Style.inputError : Style.inputField}
                        />

                    </div>

                    {/* Territory */}
                    <div className={`${Style.territorySection} ${errors.territory ? Style.errorSection : ""}`}>
                        <label
                            className={`${Style.territoryLabel} ${errors.territory ? Style.errorLabel : ""}`}
                        >
                            Are You An Investor From The:
                        </label>
                        <div className={Style.territoryOptions}>
                            <label className={Style.territoryOption}>
                                <input
                                    type="radio"
                                    name="territory"
                                    value="US"
                                    checked={territory === "US"}
                                    onChange={() => setTerritory("US")}
                                />
                                USA
                            </label>
                            <label className={Style.territoryOption}>
                                <input
                                    type="radio"
                                    name="territory"
                                    value="UK"
                                    checked={territory === "UK"}
                                    onChange={() => setTerritory("UK")}
                                />
                                UK
                            </label>
                            {/* NEW: EU territory */}
                            <label className={Style.territoryOption}>
                                <input
                                    type="radio"
                                    name="territory"
                                    value="EU"
                                    checked={territory === "EU"}
                                    onChange={() => setTerritory("EU")}
                                />
                                EU
                            </label>
                            <label className={Style.territoryOption}>
                                <input
                                    type="radio"
                                    name="territory"
                                    value="Other"
                                    checked={territory === "Other"}
                                    onChange={() => setTerritory("Other")}
                                />
                                Other
                                {territory === "Other" && (
                                    <input
                                        type="text"
                                        placeholder="Specify"
                                        value={otherTerritory}
                                        onChange={(e) => setOtherTerritory(e.target.value)}
                                        className={Style.inlineInputField}
                                    />
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Address And Phone */}
                    <div className={Style.addressSection}>
                        <div className={Style.phoneField}>
                            <select
                                value={phoneCode}
                                onChange={(e) => setPhoneCode(e.target.value)}
                                className={Style.territorySelect}
                            >
                                <option value="">Select a Code</option>
                                <option value="+1">🇺🇸 +1 (US)</option>
                                <option value="+44">🇬🇧 +44 (UK)</option>
                                <option value="+33">🇫🇷 +33 (France)</option>
                                <option value="+49">🇩🇪 +49 (Germany)</option>
                                <option value="+34">🇪🇸 +34 (Spain)</option>
                                <option value="+39">🇮🇹 +39 (Italy)</option>
                                <option value="+31">🇳🇱 +31 (Netherlands)</option>
                                <option value="+41">🇨🇭 +41 (Switzerland)</option>
                                <option value="Custom">🌍 Other</option>
                            </select>
                            <input
                                type="tel"
                                placeholder="Phone Number (Optional)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={Style.phoneInput}
                            />
                        </div>

                        {/* Street address fields */}
                        <input
                            type="text"
                            placeholder="Residential address"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            className={Style.inputField}
                        />
                        <input
                            type="text"
                            placeholder="Apartment #, Building #, etc. (Optional)"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                            className={Style.inputField}
                        />

                        {/* US */}
                        {territory === "US" && (
                            <div className={Style.cityStateZip}>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={Style.inputField}
                                />
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className={Style.stateDropdown}
                                >
                                    <option value="">State</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AK">Alaska</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="CA">California</option>
                                    <option value="CO">Colorado</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="DE">Delaware</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WY">Wyoming</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="ZIP code"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className={Style.inputField}
                                />
                            </div>
                        )}

                        {/* UK */}
                        {territory === "UK" && (
                            <div className={Style.cityCountyPostcode}>
                                <input
                                    type="text"
                                    placeholder="City or Town"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={Style.inputField}
                                />
                                <input
                                    type="text"
                                    placeholder="County"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className={Style.inputField}
                                />
                                <input
                                    type="text"
                                    placeholder="Postcode"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className={Style.inputField}
                                />
                            </div>
                        )}

                        {/* EU */}
                        {territory === "EU" && (
                            <div className={Style.cityRegionPostal}>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={Style.inputField}
                                />
                                <input
                                    type="text"
                                    placeholder="Region/Province/State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className={Style.inputField}
                                />
                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className={Style.inputField}
                                />

                                <select
                                    value={otherTerritory}
                                    onChange={(e) => setOtherTerritory(e.target.value)}
                                    className={Style.euDropdown}
                                >
                                    <option value="">Select EU Country</option>
                                    <option value="France">France</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Italy">Italy</option>
                                    <option value="Netherlands">Netherlands</option>
                                </select>
                            </div>
                        )}


                        {/* Other */}
                        {territory === "Other" && (
                            <div className={Style.cityRegionPostal}>
                                <input
                                    type="text"
                                    placeholder="City or Region"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={Style.inputField}
                                />
                                <input
                                    type="text"
                                    placeholder="Postal Code (Optional)"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className={Style.inputField}
                                />
                            </div>
                        )}
                    </div>

                    {/* Agreements */}
                    <div className={Style.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="agreement"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="agreement">
                            I agree to the{" "}
                            <button
                                type="button"
                                className={Style.linkButton}
                                onClick={() => openModal("isTermsModalOpen")}
                            >
                                Terms of Use
                            </button>
                            ,{" "}
                            <button
                                type="button"
                                className={Style.linkButton}
                                onClick={() => openModal("isUserAgreementModalOpen")}
                            >
                                User Agreement
                            </button>
                            , and{" "}
                            <button
                                type="button"
                                className={Style.linkButton}
                                onClick={() => openModal("isPrivacyPolicyModalOpen")}
                            >
                                Privacy Policy
                            </button>
                            .
                        </label>
                    </div>

                    {/* UK compliance */}
                    {requiresUKCompliance && (
                        <div className={Style.checkboxWrapper}>
                            <input
                                type="checkbox"
                                id="ukFCAAgreement"
                                checked={ukFCAAgreed}
                                onChange={(e) => setUKFCAAgreed(e.target.checked)}
                            />
                            <label htmlFor="ukFCAAgreement">
                                I agree to the{" "}
                                <button
                                    type="button"
                                    className={Style.linkButton}
                                    onClick={() => openModal("isUKComplianceModalOpen")}
                                >
                                    FCA Disclosures and Agreement
                                </button>{" "}
                                specific to UK investors.
                            </label>
                        </div>
                    )}

                    {/* EU compliance */}
                    {requiresEUCompliance && (
                        <div className={Style.checkboxWrapper}>
                            <input
                                type="checkbox"
                                id="euAgreement"
                                checked={euAgreed}
                                onChange={(e) => setEUAgreed(e.target.checked)}
                            />
                            <label htmlFor="euAgreement">
                                I confirm that I have read the{" "}
                                <button
                                    type="button"
                                    className={Style.linkButton}
                                    onClick={() => openModal("isEUComplianceModalOpen")}
                                >
                                    EU Compliance Notice
                                </button>
                            </label>
                        </div>
                    )}

                    <div className={Style.buttonGroup}>
                        <Button
                            btnName="Submit Profile"
                            onClick={handleSubmit}
                            fontSize="14px"
                            paddingTop=".5rem"
                            paddingRight="1rem"
                            paddingBottom=".5rem"
                            paddingLeft="1rem"
                            background=""
                            isActive={false}
                        />
                        <Button
                            btnName="Back to Forge"
                            onClick={handleBackToForge}
                            paddingTop=".5rem"
                            paddingRight="1rem"
                            paddingBottom=".5rem"
                            paddingLeft="1rem"
                            background=""
                            fontSize="14px"
                            isActive={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorProfile;
