import React from "react";
import { Paginate } from "../../Paginate";

const Summary = () => {
  return (
    <Paginate.Section className="py-8" datatype="main-summary">
      Краткое резюме (summary) в резюме - это короткий абзац, который
      размещается в верхней части резюме и представляет собой краткое описание
      вашего профессионального опыта, навыков и целей. Оно должно быть написано
      так, чтобы привлечь внимание работодателя и выделить вас среди других
      кандидатов
    </Paginate.Section>
  );
};

export default Summary;
