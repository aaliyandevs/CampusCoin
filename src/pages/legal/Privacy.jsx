import LegalLayout, { Section, Ul } from './LegalLayout'

function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 2026">
      <p className="text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
        This policy explains what Campus Coin collects, why, and how it's protected. We built
        Campus Coin to be a lightweight student tool, not a data business — so the short version
        is: we collect only what the app needs to work, we don't sell it, and there's no ad
        tracking anywhere on the site.
      </p>

      <Section title="1. Information we collect">
        <p>
          <strong>Account information:</strong> the name, email address, and password you provide
          at registration. Your password is hashed before storage — we never store or can see it
          in plain text.
        </p>
        <p>
          <strong>Profile details (optional):</strong> academic year, a monthly allowance baseline,
          and a savings goal, if you choose to fill them in on your Profile page.
        </p>
        <p>
          <strong>Financial data you enter:</strong> the income and expense transactions, custom
          categories, and budgets you create or import via CSV. This is entered manually by you —
          Campus Coin has no connection to any real bank account, card, or payment provider.
        </p>
        <p>
          <strong>Technical data:</strong> your browser's user-agent string, recorded against your
          login session so we can expire stale sessions. We do not log your IP address or use any
          analytics or tracking scripts.
        </p>
      </Section>

      <Section title="2. How we use it">
        <Ul>
          <li>To create and secure your account, and to keep you signed in between visits.</li>
          <li>To show you your own dashboard, reports, budgets, and saving tips — all generated from your own data.</li>
          <li>To let administrators manage default categories, post announcements, and view aggregate usage statistics (like total active students or most-used categories) — not your individual transaction line items.</li>
          <li>To send you a password-reset email if you request one.</li>
        </Ul>
      </Section>

      <Section title="3. How you stay signed in">
        <p>
          Campus Coin doesn't use tracking cookies. When you log in, we store a single session
          token in your browser's local storage and a matching record on our server. That session
          automatically expires after 24 hours of inactivity, or after 7 days regardless of
          activity — whichever comes first. Logging out, or resetting your password, immediately
          revokes it server-side.
        </p>
      </Section>

      <Section title="4. Who else sees your data">
        <p>We don't sell or rent your personal data. A small number of infrastructure providers process it on our behalf, strictly to run the Service:</p>
        <Ul>
          <li><strong>Aiven</strong> — hosts our MySQL database.</li>
          <li><strong>Render</strong> — hosts our backend API.</li>
          <li><strong>Vercel</strong> — hosts the web app you're using right now.</li>
          <li><strong>EmailJS</strong> — delivers password-reset emails; it receives only the email address and reset link needed for that one message.</li>
        </Ul>
        <p>Each of these providers has its own privacy and security practices, independent of ours.</p>
      </Section>

      <Section title="5. Data retention & deletion">
        <p>
          We keep your data for as long as your account is active. An administrator can wipe a
          student account's transactions, budgets, custom categories, and saving tips on request —
          the login itself stays intact so you can keep using the app with a clean slate.
        </p>
        <p>
          Campus Coin doesn't yet have a self-service "delete my account" button. If you'd like
          your account and all associated data fully removed, contact the SharpStackers team via
          the project repository at{' '}
          <a href="https://github.com/aaliyandevs/CampusCoin" target="_blank" rel="noreferrer">
            github.com/aaliyandevs/CampusCoin
          </a>{' '}
          and we'll action it.
        </p>
      </Section>

      <Section title="6. Security">
        <p>We take reasonable, standard precautions to protect your data:</p>
        <Ul>
          <li>Passwords are hashed with bcrypt — never stored or logged in plain text.</li>
          <li>Rate limiting on login, registration, and password-reset endpoints to slow down abuse.</li>
          <li>Session tokens that expire automatically and can be revoked instantly on logout.</li>
          <li>Standard security headers (via Helmet) and CORS restricted to our own domains.</li>
        </Ul>
        <p>
          No system is perfectly secure, and we can't guarantee absolute protection against every
          possible attack — but we built Campus Coin to follow solid, current practices rather than
          cut corners on the essentials.
        </p>
      </Section>

      <Section title="7. Children's privacy">
        <p>
          Campus Coin is built for college and university students and isn't directed at children.
          We don't knowingly collect data from anyone under 13.
        </p>
      </Section>

      <Section title="8. Changes to this policy">
        <p>
          If this policy changes in a meaningful way, we'll update the date at the top of this
          page. Continuing to use Campus Coin afterward means you accept the revised policy.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Questions, concerns, or a request to access or delete your data? Reach the SharpStackers
          team via{' '}
          <a href="https://github.com/aaliyandevs/CampusCoin" target="_blank" rel="noreferrer">
            github.com/aaliyandevs/CampusCoin
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  )
}

export default Privacy
