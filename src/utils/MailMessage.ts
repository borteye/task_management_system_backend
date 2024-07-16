export const mailMessage = (code: string) => {
  return ` <section
  style={{
    width: "700px",
    fontSize: "19px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }}
>
  <h1 style={{ fontWeight: "bold", fontSize: "1.7rem" }}>
    Reset Password Verification
  </h1>
  <p>
    You're one step away from resetting your password. Here's your
    verification code:
  </p>
  <h3
    style={{ fontSize: "1.65rem", fontWeight: "500", color: "#FFC11E" }}
  >
   ${code}
  </h3>
  <h3>
  <strong>NB:</strong> This code expires in about 30 minutes
  </h3>
  <p>
    Use this code to reset your password. It expires soon, so act fast!
  </p>
  <p>If you didn't request this, no worries. Just ignore this email.</p>
</section>`;
};
