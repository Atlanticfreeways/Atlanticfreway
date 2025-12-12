import nodemailer from 'nodemailer';

export class NotificationService {
    // Email transporter (not used in demo mode, but ready for production)
    // @ts-expect-error Prepared for production use
    private static _transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', // Mock SMTP for demo
        port: 587,
        auth: {
            user: 'mock_user',
            pass: 'mock_pass'
        }
    });

    static async sendSafetyAlert(email: string, destination: string, oldScore: number, newScore: number) {
        console.log(`[📧 ALERT] Sending email to ${email} re: ${destination}`);

        // In real app, this sends actual email. For now, we log it clearly.
        const message = `
        🚨 SAFETY ALERT: ${destination} Status Change
        
        Dear Traveler,
        
        The safety score for your upcoming trip to ${destination} has dropped.
        
        Previous Score: ${oldScore}
        Current Score: ${newScore}
        
        Advisory: Please check the dashboard for the latest government warnings.
        
        Safe Travels,
        Atlantic Freeways Guardian
        `;

        console.log(message);
        return true;
    }
}
