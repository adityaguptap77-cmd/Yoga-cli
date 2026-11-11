import type { Faq } from '@/lib/types';

interface Titled { title: string; text: string }

export const HOME_FAQS: Faq[] = [
  {
    q: 'I have never done yoga. Can I still join?',
    a: 'Yes. Most students start with Hatha Foundations, where every pose is explained and every pose has an easier version. You do not need to be flexible, strong or fit. You only need to turn up.',
  },
  {
    q: 'What happens in the free trial class?',
    a: 'You will have a short chat with the teacher about your goals and any injuries, then join a regular class. There is no sales pitch during the class. You decide afterwards whether it suits you.',
  },
  {
    q: 'What should I wear and bring?',
    a: 'Comfortable clothes you can move in and a bottle of water. Mats and props are available at the studio. For online classes, a mat or a folded blanket on a non-slip floor is enough.',
  },
  {
    q: 'Do you teach online?',
    a: 'Yes. Online classes are live over video, so the teacher can see you and correct you, which is the main thing recorded videos cannot do. You will get the link by email and WhatsApp before class.',
  },
  {
    q: 'I have an injury or a medical condition. Is yoga safe for me?',
    a: 'Often it can be adapted, but it depends on the condition. Tell us about it in the contact form or during your trial chat, and check with your doctor first if you are pregnant, recovering from surgery or managing a chronic condition. Yoga here is not a substitute for medical care.',
  },
  {
    q: 'How soon will you reply after I send the contact form?',
    a: 'You get a confirmation email straight away. A teacher from the studio will follow up personally to fix your trial class, usually within one working day.',
  },
];

export const PRINCIPLES: Titled[] = [
  { title: 'Breath before posture', text: 'Every class starts with breathing, because a calm nervous system is what lets the body open.' },
  { title: 'Small batches', text: 'The room stays small so the teacher can see every student and correct form before it turns into pain.' },
  { title: 'Adapt the pose, not the person', text: 'Props and variations are normal here, not a sign that you are behind.' },
  { title: 'A practice you can keep', text: 'You leave each class with something short to repeat at home, so progress does not stop at the door.' },
];

export const JOURNEY: Titled[] = [
  { title: 'Send your details', text: 'Answer a few short questions on the contact page. It takes about two minutes.' },
  { title: 'We talk first', text: 'A teacher calls or messages you to understand your body, your schedule and what you want from yoga.' },
  { title: 'Try a class', text: 'Join a trial class that suits your level. Ask anything. Leave whenever you like.' },
  { title: 'Choose your rhythm', text: 'If it feels right, pick the days that fit your week. If not, no pressure at all.' },
];
