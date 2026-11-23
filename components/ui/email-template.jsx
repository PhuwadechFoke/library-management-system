import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const EmailTemplate = ({
  name = "",
  redirectUrl,
  linkText,
  subject,
  description,
}) => (
  <Html lang="th">
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>{linkText}</Text>

        <Section style={section}>
          <Text style={text}>
            สวัสดีครับ <strong>{name}</strong>!
          </Text>
          <Text style={text}>{description}</Text>

          <Link
            style={button}
            href={redirectUrl}
          >
            {linkText}
          </Link>
        </Section>

        <Text style={links}>
          บันทึกการตรวจสอบความปลอดภัยของคุณ ・ ติดต่อฝ่ายสนับสนุน
        </Text>

        <Text style={footer}>จาก อาชีวศึกษาอุดรธานี</Text>
      </Container>
    </Body>
  </Html>
);

export default EmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  width: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};
const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center",
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left",
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "0.75em 1.5em",
  marginTop: "20px",
  display: "inline-block",
};

const links = {
  textAlign: "center",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center",
  marginTop: "60px",
};
