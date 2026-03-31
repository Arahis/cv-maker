import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "Is Cvoop really free?",
    a: "Yes. Cvoop is a completely free resume and CV builder. You can create, edit, and download your resume without paying or creating an account.",
  },
  {
    q: "Do I need to sign up to use Cvoop?",
    a: "No. You can build and download your resume without registration or login. This makes the process faster and easier, especially if you need a resume quickly.",
  },
  {
    q: "Can I download my resume without an account?",
    a: "Yes. You can download your resume instantly in PDF format. No signup, no email required.",
  },
  {
    q: "How do I download my resume as a PDF?",
    a: "You can download your resume by clicking the print button and saving it as a PDF. This works on desktop and mobile browsers. Just choose “Save as PDF” in your print options.",
  },
  {
    q: "Where is my data stored?",
    a: "Your resume data is stored locally in your browser and never uploaded to our servers. This means your resume stays private and secure. It is available only on the device and browser where you created it, so we recommend downloading a copy after finishing.",
  },
  {
    q: "Why can’t I see my resumes on other devices?",
    a: "Your resumes are stored locally and are not synced or saved online. This makes Cvoop a privacy-focused resume builder. Because of this, your resumes are available only on the device and browser where they were created. To use your resume on another device, download it as a PDF.",
  },
  {
    q: "Is Cvoop safe to use?",
    a: "Yes. Since your data stays on your device, your resume remains private. We do not track, sell, or store your personal information.",
  },
  {
    q: "Can I use Cvoop on mobile?",
    a: "Yes. Cvoop works on mobile, tablet, and desktop browsers. You can create and download your resume from your phone.",
  },
  {
    q: "Are the templates ATS-friendly?",
    a: "Yes. Our resume templates are designed to be clean and structured, helping applicant tracking systems (ATS) read your resume correctly.",
  },
  {
    q: "Will Cvoop support cloud storage and sync across devices in the future?",
    a: "We are exploring optional cloud storage and resume sync in the future. This will allow users to access their resumes from any device while still keeping local privacy-focused storage as an option.",
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
