import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export const VerificationEmail = ({ username, otp }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code for account activation</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section style={{ textAlign: "center" }}>
          <Heading style={heading}>Welcome to Our Platform, {username}!</Heading>
          <Text style={paragraph}>
            Thank you for joining us. To complete your sign-up and secure your account,
            please verify your email using the code below.
          </Text>

          <Text style={otpLabel}>Your verification code:</Text>
          <Text style={otpValue}>{otp}</Text>

          <Text style={paragraph}>
            This code will expire in <strong>10 minutes</strong>. If you didn’t
            request this, please ignore this email — your account will remain safe.
          </Text>

          <Hr style={divider} />

          <Text style={paragraph}>
            Once verified, you’ll gain full access to your dashboard, message center,
            and all upcoming features.
          </Text>

          <Button
            href="https://your-app-domain.com/verify"
            style={button}
          >
            Verify My Email
          </Button>

          <Text style={footerText}>
            Thank you for choosing <strong>YourApp</strong>!  
            <br />
            — The YourApp Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// --- Styles ---
const main = {
  backgroundColor: "#f3f4f6",
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 32px",
  borderRadius: "12px",
  maxWidth: "480px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const heading = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: 600,
  marginBottom: "12px",
};

const paragraph = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  marginBottom: "16px",
};

const otpLabel = {
  fontSize: "14px",
  color: "#374151",
  marginTop: "24px",
};

const otpValue = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  display: "inline-block",
  padding: "12px 24px",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#2563eb",
  letterSpacing: "4px",
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 500,
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  marginTop: "20px",
  display: "inline-block",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  marginTop: "24px",
  lineHeight: "18px",
  textAlign: "center" as const,
};

export default VerificationEmail;
