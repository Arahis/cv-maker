import { cn } from "@/lib/utils";
import { ResumeForm } from "@/lib/validation";

const summaryLexicalString =
  '{"root":{"type":"root","version":1,"children":[{"type":"paragraph","version":1,"direction":"ltr","format":"","indent":0,"children":[{"type":"text","version":1,"text":"Frontend developer with strong UI/UX focus. Building complex, data-driven interfaces with React and TypeScript.","detail":0,"format":0,"mode":"normal","style":""}]}]}}';

const workExperienceDescriptionLexicalString =
  '{"root":{"type":"root","version":1,"children":[{"type":"paragraph","version":1,"direction":"ltr","format":"","indent":0,"children":[{"type":"text","version":1,"text":"Built reusable UI components, improved editor and preview performance, and collaborated closely with designers.","detail":0,"format":0,"mode":"normal","style":""}]}]}}';

export const resumeMock: ResumeForm = {
  title: "Frontend Developer Resume",
  description: "Modern, clean, ATS-friendly resume.",

  avatarCropData: { x: 42, y: 20, zoom: 1.5, rotation: 0 },

  firstName: "Sara",
  lastName: "Connor",
  jobTitle: "Frontend Developer (React / TypeScript)",
  city: "Philadelphia",
  country: "United States",
  phone: "+495 69 000 000",
  email: "sarah@example.com",

  summary: summaryLexicalString,

  workExperiences: [
    {
      id: "we_1",
      position: "Frontend Developer",
      company: "Semrush",
      city: "Remote",
      startDate: "2023-06",
      endDate: "2025-01",
      isFullDate: false,
      description: workExperienceDescriptionLexicalString,
    },
    {
      id: "we_2",
      position: "Frontend Developer",
      company: "Indie project",
      city: "Chișinău",
      startDate: "2024-01",
      endDate: "",
      isFullDate: false,
      description: workExperienceDescriptionLexicalString,
    },
  ],

  educations: [
    {
      id: "edu_1",
      degree: "BSc, Computer Science",
      institution: "State University",
      startDate: "2019",
      endDate: "2023",
      city: "Chișinău",
      isFullDate: false,
    },
  ],

  skills: {
    technical: [
      { id: "ts", name: "TypeScript" },
      { id: "react", name: "React" },
      { id: "lexical", name: "Lexical" },
    ],
    personal: [
      { id: "ui", name: "UI/UX thinking" },
      { id: "detail", name: "Attention to detail" },
    ],
  },
};

const getScaleForA4 = (scale: number) => {
  const WIDTH = 794;
  const HEIGHT = 1123;
  return {
    scaledWidth: WIDTH * scale,
    scaledHeight: HEIGHT * scale,
    width: WIDTH,
    height: HEIGHT,
    scale,
  };
};

const ResumeVarsPanel = ({
  onChange,
  resumeVariants,
  variant,
}: {
  onChange: (resumeVar: any) => void;
  resumeVariants: Record<string, React.ElementType>;
  variant: string;
}) => {
  const { scaledWidth, scaledHeight, width, height, scale } =
    getScaleForA4(0.2);

  const onVarChange = (key: string) => {
    onChange(key);
  };

  return (
    <div className="flex gap-2">
      {Object.entries(resumeVariants).map(([key, Variant]) => (
        <div
          key={key}
          className={cn(
            "flex rounded-md border p-1 hover:border-blue-300",
            variant === key && "border-2 border-blue-300",
          )}
        >
          <div
            onClick={() => onVarChange(key)}
            className="cursor-pointer overflow-hidden"
            style={{ width: scaledWidth, height: scaledHeight }}
          >
            <div
              className="origin-top-left transform"
              style={{ width: width, height: height, scale }}
            >
              <Variant data={resumeMock} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeVarsPanel;
