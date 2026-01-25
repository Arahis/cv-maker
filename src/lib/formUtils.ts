export const EMPTY_LEXICAL_STATE =
  '{"root":{"type":"root","version":1,"children":[{"type":"paragraph","version":1,"direction":"ltr","format":"","indent":0,"children":[]} ]}}';

export const defaultFormValues = {
  title: "My resume",
  description: "",

  avatarCropData: { x: 0, y: 0, zoom: 1, rotation: 0 },
  firstName: "",
  lastName: "",
  jobTitle: "",
  city: "",
  country: "",
  phone: "",
  email: "",

  workExperiences: [],
  educations: [],
  skills: { technical: [], personal: [] },
  summary: EMPTY_LEXICAL_STATE,
};
