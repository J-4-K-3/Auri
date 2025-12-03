import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import '../styles/Terms.css';

const sectionsData = [
  {
    id: 'summary',
    title: 'Summary',
    content: (
      <>
        <p>
          Welcome to Auri — a calm space to share your world. This page contains the Terms & Conditions and the Privacy Policy effective December 2, 2025. You can expand each section to read the full details about account rules, content moderation, data practices, and how to contact support.
        </p> <br />
      </>
    ),
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    content: (
      <>
        <p><strong>Effective Date:</strong> December 2, 2025</p> <br />

        <h4>1. Accounts &amp; Access</h4>
        <ul>
          <li>Users must create an account to use Auri; guest access is not available.</li>
          <li>Users may request permanent deletion of their account and associated data at any time.</li>
          <li>Users are responsible for keeping their login credentials secure.</li>
        </ul> <br />

        <h4>2. Content &amp; Interaction</h4>
        <ul>
          <li>Users may post images, media, links, and text. Text posts must include at least one image.</li>
          <li>Users may edit or delete their own content at any time.</li>
          <li>Content must not contain pornography, nudity, extreme violence, hate speech, threats, or illegal activity.</li>
          <li>Age-based filtering helps ensure younger users do not see sensitive content.</li>
          <li>Users may report inappropriate content, which is reviewed by AI systems and human moderators.</li>
        </ul> <br />

        <h4>3. Moderation &amp; Safety</h4>
        <p>
          Auri uses automated systems and human moderation to keep the community safe. Content that violates guidelines may result in removal, warnings, or suspension. Severe violations may be escalated to authorities when required.
        </p> <br />

        <h4>4. Feature Syncing</h4>
        <p>
          Auri may connect with other Innoxation apps to access additional features. Syncing is optional and only used for features that rely on cross-app functionality.
        </p> <br />

        <h4>5. Liability &amp; Responsibility</h4>
        <p>
          Users are responsible for the content they post. Innoxation Tech Inc moderates the platform but is not liable for individual user content. Illegal or harmful content is prohibited and may be reported to law enforcement if necessary.
        </p> <br />

        <h4>6. Updates &amp; Changes</h4>
        <p>
          Auri may release updates or bug fixes that improve performance or stability. Users will be notified if any update requires manual installation.
        </p> <br />

        <h4>7. Contact</h4>
        <p>
          For questions or concerns: <a href="mailto:innoxation.tech@gmail.com">support@innoxation.com</a>
        </p>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: (
      <>
        <p><strong>Effective Date:</strong> December 2, 2025</p> <br />

        <h4>Overview</h4>
        <p>
          Your privacy matters. Auri collects only the information necessary to operate the platform and maintain a safe environment.
        </p> <br />

        <h4>1. Information We Collect</h4>
        <ul>
          <li><strong>Account Data:</strong> Email, name, age, and location.</li>
          <li><strong>Optional User Inputs:</strong> Reviews, feedback, and user reports you choose to submit.</li>
        </ul> <br />

        <h4>2. How We Use Data</h4>
        <p>
          Your data is used to:
        </p>
        <ul>
          <li>Provide core app functionality</li>
          <li>Maintain age-appropriate content filtering and safety features</li>
          <li>Process user reports and community moderation</li>
          <li>Communicate updates or policy changes when necessary</li>
          <li>Support optional cross-app features within Innoxation apps</li>
        </ul> <br />

        <h4>3. Sharing &amp; Disclosure</h4>
        <ul>
          <li>Auri does <strong>not</strong> sell user data.</li>
          <li>Data is only shared within Innoxation systems when syncing features (optional).</li>
          <li>Third-party services are used <strong>only</strong> for Auri Shop items, item tracking, and checkout purposes.</li>
          <li>No other part of Auri uses third-party data processors.</li>
        </ul> <br />

        <h4>4. Security</h4>
        <p>
          Data is encrypted and stored securely. Users are responsible for protecting their login credentials.
        </p> <br />

        <h4>5. Children’s Privacy</h4>
        <p>
          Auri is suitable for users aged 8 and above. Content filtering and moderation help protect younger users. Parents or guardians may request account deletion at any time.
        </p> <br />

        <h4>6. Data Retention</h4>
        <p>
          We retain data for as long as the account is active. Users may request full deletion of their account and data.
        </p> <br />

        <h4>7. User Rights</h4>
        <ul>
          <li>Request access to their stored information</li>
          <li>Request corrections to inaccurate data</li>
          <li>Request deletion of their data</li>
          <li>Withdraw consent for optional features</li>
        </ul> <br />

        <h4>8. Third-Party Services</h4>
        <p>
          Third-party providers are used only for:
        </p>
        <ul>
          <li>Auri Shop item management</li>
          <li>Shipping or digital item delivery</li>
          <li>Payment processing or checkout</li>
        </ul>
        <p>
          These providers receive only the information required to complete the transaction. Auri does not use cookies or third-party trackers.
        </p> <br />

        <h4>9. Changes to This Policy</h4>
        <p>
          Policy updates may occur occasionally. The latest version will always be available in the app and website.
        </p> <br />

        <h4>10. Contact</h4>
        <p>
          For privacy questions: <a href="mailto:innoxation.tech@gmail.com">innoxation.tech@gmail.com</a>
        </p>
      </>
    ),
  },
];

export const Terms = () => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState('');

  const toggle = (id) => setOpenId((prev) => (prev === id ? '' : id));

  return (
    <div className="terms-container">
      <div className="terms-content">
        <button className="terms-back" onClick={() => navigate('/')} aria-label="Go back">
          <FiArrowLeft size={16} style={{ marginRight: 8 }} /> Go back
        </button>

        <h1>Terms &amp; Conditions — Overview</h1>

        <div className="accordion">
          {sectionsData.map((s) => (
            <div className="accordion-item" key={s.id}>
              <button
                className="accordion-header"
                onClick={() => toggle(s.id)}
                aria-expanded={openId === s.id}
              >
                <span>{s.title}</span>
                <span className="accordion-icon">{openId === s.id ? <FiChevronUp /> : <FiChevronDown />}</span>
              </button>

              <div
                className={`accordion-content ${openId === s.id ? 'open' : ''}`}
                aria-hidden={openId !== s.id}
              >
                <div className="accordion-inner">{s.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
