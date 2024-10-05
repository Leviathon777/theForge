import React, { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { Button } from "../../components/componentsindex.js";
import { addKYCDataAndSetKYCStatus } from "../../firebase/services";
import Style from "./KYC.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

import PhoneInput from 'react-phone-number-input';

import PhoneNumberInput from './phoneInput';

import 'react-phone-number-input/style.css';

const KYC = ({ currentAccount, KYCSrc }) => {
    const [idFrontImage, setIdFrontImage] = useState(null);
    const [idBackImage, setIdBackImage] = useState(null);
    const [proofOfAddressImage, setProofOfAddressImage] = useState(null);
    const [activeBtn, setActiveBtn] = useState(1);
    const [legalName, setLegalName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [message, setMessage] = useState("");
    const [selfieImage, setSelfieImage] = useState(null);
    const [consentChecked, setConsentChecked] = useState(false);
    const router = useRouter();

    const address = useAddress();

    const [legalAddress, setLegalAddress] = useState({
        address1: "",
        address2: "",
        country: "",
        city: "",
        state: "",
        zipCode: "",
    });

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setLegalAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (address) {
            setWalletAddress(address);
        }
    }, [address]);

    useEffect(() => {
        if (currentAccount) {
            setWalletAddress(currentAccount);
        }
    }, [currentAccount]);

    const handleImageUpload = (e, setImage, imageName) => {
        const file = e.target.files[0];
        setImage(file);

        const imgPreview = document.getElementById(`${imageName}-preview`);
        if (imgPreview) {
            imgPreview.src = URL.createObjectURL(file);
        } else {
            console.error(`Image preview element not found for ${imageName}`);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
        if (!legalName || !phoneNumber || !email || !walletAddress || !legalAddress || !consentChecked) {
            setMessage("Please fill out all required fields and agree to the Terms and Conditions.");
            return;
        }
        try {
            const kycData = {
                legalName,
                phoneNumber,
                email,
                walletAddress,
                legalAddress,
                proofOfAddressImage,
                idFrontImage,
                idBackImage,
                selfieImage,
                kyc: "PENDING",
                consentAccepted: consentChecked,
            };
    
            console.log('kycData:', kycData);
    
            await addKYCDataAndSetKYCStatus(kycData);
    
            toast.success("Congratulations! You have successfully submitted your KYC information. You will receive an email with a decision on approval.");
            setMessage("KYC SUBMITTED SUCCESSFULLY!");
    
            // Redirect to /myProfile after successful submission
            router.push('/myProfile');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };
    
    return (
        <div className={Style.user}>
            <div className={Style.user_box}>
                <div className={Style.form_box}>
                    <form onSubmit={handleSubmit} className={Style.user_box_input}>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="legalName">LEGAL NAME</label>
                            <input
                                type="text"
                                placeholder="Enter Legal Name"
                                name="legalName"
                                value={legalName}
                                onChange={(e) => setLegalName(e.target.value)}
                            />
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="address1">ADDRESS 1</label>
                            <input
                                type="text"
                                placeholder="Enter Address 1"
                                name="address1"
                                value={legalAddress.address1}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="address2">ADDRESS 2</label>
                            <input
                                type="text"
                                placeholder="Enter Address 2"
                                name="address2"
                                value={legalAddress.address2}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="country">COUNTRY</label>
                            <input
                                type="text"
                                placeholder="Enter Country"
                                name="country"
                                value={legalAddress.country}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="city">CITY</label>
                            <input
                                type="text"
                                placeholder="Enter City"
                                name="city"
                                value={legalAddress.city}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="state">STATE/PROVINCE</label>
                            <input
                                type="text"
                                placeholder="Enter State/Province"
                                name="state"
                                value={legalAddress.state}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="zipCode">LOCATOR / ZIP CODE</label>
                            <input
                                type="text"
                                placeholder="Enter Locator / ZIP Code"
                                name="zipCode"
                                value={legalAddress.zipCode}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="phoneNumber">PHONE NUMBER</label>
                         <div>
      {/* replaced <input> with the PhoneNumberInput  */}
      <PhoneInput
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChange={setPhoneNumber}
      />
    </div>
                        </div>
                        <div className={Style.user_box_input_box}>
                            <label htmlFor="email">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                placeholder="example@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={Style.user_box_input_box}>
                            <label htmlFor="walletAddress">WALLET ADDRESS</label>
                            <input
                                type="text"
                                placeholder="Enter your wallet address"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                <p className={Style.user_box_or}></p>

                <div className={Style.user_box_social}>
                    <form onSubmit={handleSubmit} className={Style.user_box_input}>
                        <div className={Style.user_box_input_box_img}>
                            <label htmlFor="proofOfAddressImage">PROOF OF ADDRESS</label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif"
                                onChange={(e) => handleImageUpload(e, setProofOfAddressImage, 'proofOfAddressImage')}
                            />

                            {proofOfAddressImage && (
                                <img
                                    src={URL.createObjectURL(proofOfAddressImage)}
                                    alt="Proof of Address Preview"
                                    id="proofOfAddressImage-preview"
                                />
                            )}

                        </div>

                        <div className={Style.user_box_input_box_img}>
                            <label htmlFor="idFrontImage">ID PICTURE (FRONT)</label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif"
                                onChange={(e) => handleImageUpload(e, setIdFrontImage, 'idFrontImage')}
                            />

                            {idFrontImage && (
                                <img
                                    src={URL.createObjectURL(idFrontImage)}
                                    alt="ID Picture (Front) Preview"
                                    id="idFrontImage-preview"
                                />
                            )}

                        </div>
                        <div className={Style.user_box_input_box_img}>
                            <label htmlFor="idBackImage">ID PICTURE (BACK)</label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif"
                                onChange={(e) => handleImageUpload(e, setIdBackImage, 'idBackImage')}
                            />

                            {idBackImage && (
                                <img
                                    src={URL.createObjectURL(idBackImage)}
                                    alt="ID Picture (Back) Preview"
                                    id="idBackImage-preview"
                                />
                            )}

                        </div>
                        <div className={Style.user_box_input_box_img}>
                            <label htmlFor="selfieImage">SELFIE PHOTO</label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif"
                                onChange={(e) => handleImageUpload(e, setSelfieImage, 'selfieImage')}
                            />

                            {selfieImage && (
                                <img
                                    src={URL.createObjectURL(selfieImage)}
                                    alt="Selfie Photo Preview"
                                    id="selfieImage-preview"
                                />
                            )}
                        </div>
                        <div className={Style.user_box_input_checkbox}>
                            <label htmlFor="consentCheckbox">
                                <input
                                    type="checkbox"
                                    id="consentCheckbox"
                                    checked={consentChecked}
                                    onChange={() => setConsentChecked(!consentChecked)}
                                />
                                 <small>I HAVE READ AND AGREE TO XMARKET</small> <a href="/termsOfService" target="_blank">TERMS AND CONDITIONS</a>
                            </label>
                        </div>


                        {message && <div className={Style.message}>{message}</div>}
                        <div className={Style.continue_button_box}>
                            <Button type="submit" btnName="SUBMIT FORM" classStyle={Style.continue_button} />
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                //hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName={Style.toast_container}
                bodyClassName={Style.toast_body}
            />
        </div>
    );
};

export default KYC;
