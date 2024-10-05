function PhoneNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <PhoneInput
      placeholder="Enter phone number"
      value={phoneNumber}
      onChange={setPhoneNumber}
    />
  );
}

export default PhoneNumberInput;
