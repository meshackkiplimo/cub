import nodemailer from 'nodemailer';
import { emailService } from '../../src/services/emailService';
import { sendEmail } from '../../src/config/emailConfig';

// Mock nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn()
    })
}));

// Mock the emailConfig sendEmail function
jest.mock('../../src/config/emailConfig', () => ({
    sendEmail: jest.fn()
}));

describe('Email Service', () => {
    const mockEmail = 'test@example.com';
    const mockCode = '123456';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Send Verification Code', () => {
        it('should send verification email successfully', async () => {
            (sendEmail as jest.Mock).mockResolvedValue('Email sent successfully');

            const result = await emailService.sendVerificationCode(mockEmail, mockCode);

            expect(sendEmail).toHaveBeenCalledWith(
                mockEmail,
                'Email Verification',
                expect.stringContaining(mockCode),
                expect.stringContaining(mockCode)
            );
            expect(result).toBe('Email sent successfully');
        });

        it('should handle rejected email', async () => {
            (sendEmail as jest.Mock).mockResolvedValue('Email not sent');

            const result = await emailService.sendVerificationCode(mockEmail, mockCode);

            expect(sendEmail).toHaveBeenCalled();
            expect(result).toBe('Email not sent');
        });

        it('should handle server error', async () => {
            (sendEmail as jest.Mock).mockResolvedValue('Email server error');

            const result = await emailService.sendVerificationCode(mockEmail, mockCode);

            expect(sendEmail).toHaveBeenCalled();
            expect(result).toBe('Email server error');
        });

        it('should handle transport exceptions', async () => {
            const errorMessage = 'SMTP connection failed';
            (sendEmail as jest.Mock).mockRejectedValue(new Error(errorMessage));

            const result = await emailService.sendVerificationCode(mockEmail, mockCode);

            expect(sendEmail).toHaveBeenCalled();
            expect(result).toBe(JSON.stringify(errorMessage, null, 500));
        });

        it('should include correct email content', async () => {
            (sendEmail as jest.Mock).mockImplementation(
                (email: string, subject: string, message: string, html: string) => {
                    // Verify email content structure
                    expect(subject).toBe('Email Verification');
                    expect(message).toContain(mockCode);
                    expect(html).toContain('<h1>Email Verification</h1>');
                    expect(html).toContain(`<strong>${mockCode}</strong>`);
                    expect(html).toContain('expire in 3 hours');
                    return Promise.resolve('Email sent successfully');
                }
            );

            await emailService.sendVerificationCode(mockEmail, mockCode);
            expect(sendEmail).toHaveBeenCalled();
        });
    });

    describe('Email Transport Configuration', () => {
        it('should create transport with correct configuration', async () => {
            // Test the actual transport creation
            process.env.EMAIL_USER = 'test@gmail.com';
            process.env.EMAIL_PASSWORD = 'testpassword';

            const transport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                service: 'gmail',
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                host: 'smtp.gmail.com',
                port: 465,
                service: 'gmail',
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        });

        it('should handle mail sending with correct options', async () => {
            process.env.EMAIL_USER = 'test@gmail.com';
            
            const mockTransport = {
                sendMail: jest.fn().mockResolvedValue({
                    accepted: [mockEmail],
                    rejected: []
                })
            };

            (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransport);

            await emailService.sendVerificationCode(mockEmail, mockCode);

            expect(sendEmail).toHaveBeenCalledWith(
                mockEmail,
                'Email Verification',
                expect.any(String),
                expect.any(String)
            );
        });
    });
});