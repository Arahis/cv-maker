import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "Is Cvoop really free?",
    a: "Yes. Cvoop is a free resume and CV builder. You can create, edit, and export your resume as a PDF without paying or creating an account.",
  },
  {
    q: "Do I need to sign up to use Cvoop?",
    a: "No. You can build and download a resume in guest mode without registration. Creating an account is optional and lets you save resumes and access them on supported devices. You can register with email or use Google Sign-In when available.",
  },
  {
    q: "Can I download my resume without an account?",
    a: "Yes. You can export your resume as a PDF without signing up or providing an email address. In guest mode, the browser's print dialog is used to save the file.",
  },
  {
    q: "How do I download my resume as a PDF?",
    a: "Open your resume in the editor and click the print/download button. If you are signed in, the PDF is generated and downloaded automatically. In guest mode, a print dialog opens: choose “Save as PDF” on desktop or the PDF/save option in your mobile browser's print or share menu.",
  },
  {
    q: "Where is my data stored?",
    a: "In guest mode, your resume data is stored locally in your browser and is not uploaded to our servers just because you edit it. If you create an account or use an account feature, resumes and images you choose to save are stored in our servers or cloud storage so they can be synchronized across supported devices.",
  },
  {
    q: "Why can’t I see my resumes on other devices?",
    a: "Guest resumes are stored only in the browser where they were created and are not synchronized automatically. After you create an account or sign in, you can save a local resume by clicking it in your resume list, or use its dropdown menu and choose “Sync to account”. You can then open it on other supported devices using the same account.",
  },
  {
    q: "Is Cvoop safe to use?",
    a: "We use reasonable security measures to protect the Service and account data. Guest resumes remain in your browser, while account resumes are stored securely so they can be synchronized. We do not sell personal information.",
  },
  {
    q: "Can I use Cvoop on mobile?",
    a: "Yes. Cvoop works on mobile, tablet, and desktop browsers. You can create, edit, and export your resume as a PDF from your phone or tablet.",
  },
  {
    q: "Are the templates ATS-friendly?",
    a: "Yes. Our resume templates are designed to be clean and structured, helping applicant tracking systems (ATS) read your resume correctly.",
  },
  {
    q: "Can I save my resume online and use it on another device?",
    a: "Yes. Create an account and save your resume to access it on supported devices. If you prefer not to create an account, you can continue using local browser storage and download your resume as a PDF.",
  },
];

const FAQ = () => {
  return (
    <section aria-labelledby="faq" className="mx-auto mb-20 md:w-[50%]">
      <h2 className="font-brand mb-20 text-2xl font-semibold md:text-4xl">
        Frequently asked questions
      </h2>

      <Accordion
        type="single"
        collapsible
        defaultValue="shipping"
        className="w-full px-4"
      >
        {faqItems.map((v) => (
          <AccordionItem value={v.q} key={v.q}>
            <AccordionTrigger className="text-lg">
              <h3>{v.q}</h3>
            </AccordionTrigger>
            <AccordionContent className="text-left">
              <p>{v.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="text-muted-foreground mt-8 text-center text-sm">
        Didn’t find your answer here? Feel free to contact us at{" "}
        <a href="mailto:support@cvoop.com" className="underline">
          support@cvoop.com
        </a>
        .
      </p>
    </section>
  );
};

export default FAQ;
