export const forgotPasswordTemplate = (fullname: string, link: string)=>{
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                }
                .email-container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                text-align: center;
                margin-bottom: 20px;
                }
                .email-header h1 {
                font-size: 24px;
                color: #333333;
                }
                .email-body {
                font-size: 16px;
                color: #333333;
                line-height: 1.5;
                }
                .email-body p {
                margin-bottom: 20px;
                }
                .reset-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                }
                .reset-button:hover {
                background-color: #0056b3;
                }
                .email-footer {
                margin-top: 30px;
                font-size: 14px;
                text-align: center;
                color: #888888;
                }
            </style>
            <title>Forgot Password</title>
            </head>
            <body>

            <div class="email-container">
                <div class="email-header">
                <h1>Reset Your Password</h1>
                </div>
                <div class="email-body">
                <p>Hi ${fullname},</p>
                <p>We received a request to reset your password for your account at Ebook.</p>
                <p>If you made this request, click the button below to reset your password:</p>
                <p><a href="${link}" class="reset-button" style="color: white">Reset Password</a></p>
                <p>If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
                </div>
                <div class="email-footer">
                <p>If you need further assistance, feel free to reach out to our support team.</p>
                <p>Best regards, <br> The Ebook Team</p>
                </div>
            </div>

            </body>
            </html>
    `
}