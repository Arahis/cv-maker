export const EMPTY_LEXICAL_STATE =
  '{"root":{"type":"root","version":1,"children":[{"type":"paragraph","version":1,"direction":"ltr","format":"","indent":0,"children":[]} ]}}';

export const avatarCropInitialValues = { x: 0, y: 0, zoom: 1, rotation: 0 };

export const defaultFormValues = {
  title: "My resume",
  description: "",

  avatarCropData: avatarCropInitialValues,
  firstName: "",
  lastName: "",
  jobTitle: "",
  city: "",
  country: "",
  phone: "",
  email: "",

  workExperiences: [],
  educations: [],
  languages: [],
  skills: { technical: [], personal: [] },
  summary: "",
};
