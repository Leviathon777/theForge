export default function WelcomeEmail() {
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt Email</title>
</head>
<body style="padding: 0px;" margin: 0px;>
<div style="width: 100%;  background: rgb(43, 40, 40);">
<div style="max-width: 600px; margin: 20px auto; padding: 20px; background:rgb(54, 54, 54); border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  <div style="background-color:rgb(0, 0, 0); color: #ffffff; padding: 20px; text-align: center;">
    <img src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/3f1b449b-f38b-42d4-bd7c-2d46bcf846b8/MetalsOfHonor.webp" alt="The Forge Logo" style="height: 75px;">
    <h1 style="margin: 0px 0; font-size: 50px;">Your Receipt:</h1>
      <h1 style="margin: 0px 0; font-size: 50px;">Medal of Honor</h1>

  </div>

  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background:rgb(0, 0, 0); border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <p style="font-size: 24px;  margin-bottom: 10px;">Congratulations, <strong>BOB BOBBY</strong>!</p>
    <p>You’ve successfully forged your <strong>LEGENDARY</strong> Medal of Honor.</p>

    <table style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 16px;">
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color:rgb(0, 0, 0);">Medal Type:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">LEGENDARY</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color:rgb(0, 0, 0);">Price:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">2.5 BNB</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color:rgb(0, 0, 0);">Transaction ID:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">
          65465138561615168143151685413561<br>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=54665168161351684163516168416" alt="QR Code" style="margin-top: 10px;">
        </td>
      </tr>
    </table>

    <p style="margin-top: 20px; font-size: 16px; color: #555555;">Thank you for supporting <strong>The Forge</strong>. Share your achievement with others and track your medals anytime.</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://moh.xdrip.io" style="text-decoration: none; background-color: #170cce; color: #ffffff; padding: 5px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">View Your Dashboard</a>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; background:rgb(0, 0, 0); color: #ffffff; font-size: 14px;">
    <p style="margin: 0;">&copy; 2024 XDRIP Digital Management LLC | Visit us at <a href="https://xdrip.io" style="color: #170cce; text-decoration: underline;">www.xdrip.io</a></p>
  </div>
   </div>
</body>
</html>


    `;
    return <div dangerouslySetInnerHTML={{ __html: emailHTML }} />;
}
