import type { LegalPage } from '@/lib/types';

/**
 * Legal page templates. These are sensible starting points written for an Indian yoga
 * business, NOT legal advice. Have a lawyer review them before launch and fill in the
 * business details (legal name, address, grievance officer) in Admin > Settings.
 *
 * Each section: { h: heading, p: [paragraphs], ul: [bullets] }
 */

export const UPDATED = '29 October 2026';

export const PAGES: Record<string, LegalPage> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How Yovana Yoga collects, uses and protects your personal information, in line with Indian data protection law.',
    sections: [
      {
        h: 'What this policy covers',
        p: [
          'This policy explains what personal information we collect when you use this website, why we collect it, and the choices you have. We follow the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and its rules, as they apply to us.',
        ],
      },
      {
        h: 'Information we collect',
        p: ['We only collect what we need to respond to you and run our classes.'],
        ul: [
          'Contact form: your name, mobile number, email address, class interest, experience level, preferred format and time, and any message you choose to write.',
          'Reviews: your name, city, rating and the review text you submit.',
          'Technical data: basic server logs such as IP address, browser type and pages requested, used for security and to keep the site working.',
        ],
      },
      {
        h: 'How we use your information',
        ul: [
          'To contact you about your trial class and answer your questions.',
          'To send you a confirmation email after you submit the contact form.',
          'To keep a record of enquiries so the studio team can follow up.',
          'To publish a review, but only after we have approved it.',
          'To protect the site against spam and abuse.',
        ],
      },
      {
        h: 'Consent and your choices',
        p: [
          'We process your contact details because you give us your consent when you submit the form. You can withdraw that consent at any time by writing to us, and we will stop contacting you about classes.',
        ],
      },
      {
        h: 'Who sees your information',
        p: [
          'Your information is visible to the studio team. We use an email service provider to deliver confirmation emails, and a hosting provider to run this website. These providers process data on our behalf and are not allowed to use it for their own purposes. We do not sell your personal information.',
        ],
      },
      {
        h: 'How long we keep it',
        p: [
          'We keep enquiry details for as long as they are needed to deal with your request and for a reasonable period afterwards, then delete or anonymise them. You can ask us to delete your details earlier.',
        ],
      },
      {
        h: 'Security',
        p: [
          'We use reasonable technical and organisational measures to protect your information, including encrypted connections and restricted access to our admin area. No system is completely secure, so please do not send us sensitive health or financial details through the contact form.',
        ],
      },
      {
        h: 'Your rights',
        p: ['You can ask us to:'],
        ul: [
          'Tell you what personal data we hold about you.',
          'Correct anything that is wrong or out of date.',
          'Delete your personal data.',
          'Handle a complaint about how your data is used.',
        ],
      },
      {
        h: 'Children',
        p: ['This website is intended for adults. If you are under 18, please ask a parent or guardian to contact us on your behalf.'],
      },
      {
        h: 'Cookies',
        p: ['We only use cookies that are essential for the website and admin area to work. See our Cookie Policy for details.'],
      },
      {
        h: 'Changes to this policy',
        p: ['We may update this policy from time to time. The date at the top of this page shows when it was last changed.'],
      },
      {
        h: 'Contact and grievances',
        p: ['For any request or complaint about your personal data, please use the contact details on our Contact page and mention "Privacy request" in your message.'],
      },
    ],
  },

  'terms-and-conditions': {
    title: 'Terms and Conditions',
    description: 'The terms that apply when you use the Yovana Yoga website and book or attend our classes.',
    sections: [
      {
        h: 'Using this website',
        p: [
          'By using this website you agree to these terms. If you do not agree, please do not use the site. The information on the site is provided in good faith and may be updated at any time.',
        ],
      },
      {
        h: 'Classes and bookings',
        ul: [
          'Submitting the contact form is an enquiry, not a confirmed booking. A booking is confirmed only when the studio confirms a class with you.',
          'Class timings, teachers and formats may change. We will tell you as early as we can.',
          'You agree to give us accurate information, including relevant injuries or health conditions, so we can teach you safely.',
        ],
      },
      {
        h: 'Your responsibility',
        p: [
          'Yoga involves physical movement. You take part at your own risk and should listen to your body, rest when needed and tell the teacher if something hurts. Please read our Disclaimer before joining a class.',
        ],
      },
      {
        h: 'Payments, cancellations and refunds',
        p: ['Fees, cancellations and refunds are described in our Refund and Cancellation Policy and are confirmed to you when you enrol.'],
      },
      {
        h: 'Content and intellectual property',
        p: [
          'The text, images, logos and design on this website belong to Yovana Yoga or are used with permission. You may not copy or republish them without written permission.',
        ],
      },
      {
        h: 'Reviews and user content',
        p: [
          'Reviews you submit may be edited for length or removed if they are abusive, misleading or off-topic. By submitting a review you allow us to display it on this website.',
        ],
      },
      {
        h: 'Limitation of liability',
        p: [
          'To the extent permitted by law, we are not liable for any loss or injury arising from your use of this website or from information on it. Nothing in these terms limits liability that cannot lawfully be limited.',
        ],
      },
      {
        h: 'Governing law',
        p: ['These terms are governed by the laws of India. Any dispute will be subject to the courts at the location of our studio.'],
      },
      {
        h: 'Changes',
        p: ['We may revise these terms. Continued use of the site after a change means you accept the updated terms.'],
      },
    ],
  },

  disclaimer: {
    title: 'Disclaimer',
    description: 'Important health and information disclaimers for Yovana Yoga classes, blog articles and website content.',
    sections: [
      {
        h: 'Not medical advice',
        p: [
          'Everything on this website, including blog articles, class descriptions and answers to questions, is for general information and education only. It is not medical advice and is not a substitute for diagnosis or treatment by a qualified doctor.',
        ],
      },
      {
        h: 'Check with your doctor first',
        p: ['Please consult your doctor before starting yoga or breathwork if you:'],
        ul: [
          'Are pregnant or have recently given birth.',
          'Have had recent surgery or an injury.',
          'Live with a heart condition, high or low blood pressure, epilepsy, a spinal condition, glaucoma or any chronic illness.',
          'Are taking medication that affects balance, blood pressure or alertness.',
        ],
      },
      {
        h: 'Practise within your limits',
        p: [
          'Stop immediately if you feel pain, dizziness or shortness of breath, and seek medical help if needed. Breathing practices should never be forced.',
        ],
      },
      {
        h: 'Results vary',
        p: [
          'Experiences described on this website, including reviews, are individual. We do not promise or guarantee any specific health outcome, such as weight loss, pain relief or cure of any condition.',
        ],
      },
      {
        h: 'External links and third parties',
        p: ['We are not responsible for the content or practices of websites we link to.'],
      },
      {
        h: 'Accuracy of information',
        p: ['We try to keep this site accurate and up to date, but we make no warranty that it is complete or error-free.'],
      },
    ],
  },

  'refund-policy': {
    title: 'Refund and Cancellation Policy',
    description: 'How cancellations, rescheduling and refunds work for Yovana Yoga classes and packages.',
    sections: [
      {
        h: 'Trial class',
        p: ['Your first trial class is free. You can decide afterwards whether to continue, with no obligation.'],
      },
      {
        h: 'Cancelling or rescheduling a class',
        ul: [
          'Please tell us at least 6 hours before class if you cannot attend, so we can offer your place to someone else.',
          'If we cancel a class, we will offer you a replacement class or an extension of your package.',
        ],
      },
      {
        h: 'Refunds',
        ul: [
          'Fees for classes already attended are not refundable.',
          'If you cancel a package before it starts, we will refund the amount paid after deducting any payment-gateway charges.',
          'If you need to stop part-way through for a medical reason, contact us and we will look at your case fairly.',
        ],
      },
      {
        h: 'How refunds are paid',
        p: ['Approved refunds are returned to the original payment method within 7 to 10 working days.'],
      },
      {
        h: 'Questions',
        p: ['If anything here is unclear, ask us before you enrol. We would rather explain it up front than have a surprise later.'],
      },
    ],
  },

  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'The few cookies the Yovana Yoga website uses and why they are needed.',
    sections: [
      {
        h: 'What are cookies',
        p: ['Cookies are small text files that a website stores in your browser so it can remember things between pages.'],
      },
      {
        h: 'Cookies we use',
        p: [
          'This public website does not use advertising or analytics cookies. The only cookie we set is a strictly necessary session cookie for the staff admin area, so that signed-in staff stay signed in. Visitors to the public pages are not given a tracking cookie.',
        ],
      },
      {
        h: 'Third-party content',
        p: [
          'To display our fonts we load files from Google Fonts. Google may receive your IP address when it serves these files. If we add analytics or embedded media in future, we will update this page.',
        ],
      },
      {
        h: 'Controlling cookies',
        p: ['You can block or delete cookies in your browser settings. Blocking the essential cookie will not affect the public pages.'],
      },
    ],
  },
};

export const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms and Conditions' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/refund-policy', label: 'Refund Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
];
