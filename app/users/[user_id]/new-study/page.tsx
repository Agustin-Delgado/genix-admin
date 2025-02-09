"use client";

import { cn } from "@/lib/utils";
import { useGetClientQuery } from "@/services/clients";
import { useGetClientStudyQuery, useListClientStudiesQuery, useListStudiesQuery } from "@/services/studies";
import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import StudyCard from "../components/study-card";

export const studies_extension = [
  {
    code: "nutritional",
    title: "Informe nutricional",
    img: "/nutritional.webp",
  },
  {
    code: "training",
    title: "Plan de entrenamiento",
    img: "/training.webp",
  },
  {
    code: "lab",
    title: "Informe de laboratorio",
    img: "/lab.webp",
  },
  {
    code: "supplements",
    title: "Suplementos recomendados",
    img: "/supplements.webp",
  },
  {
    code: "in_body",
    title: "Análisis InBody",
    img: "/in_body.webp",
  },
  {
    code: "genetic",
    title: "Análisis genético",
    img: "/genetics.webp",
  }
];

export default function SelectStudyPage() {
  const { data: studiesData, isLoading: isStudiesLoading } = useListStudiesQuery(undefined);

  const studies = isStudiesLoading ? studies_extension : studiesData;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Seleccionar estudio</h1>
      <div className="flex flex-wrap justify-start items-start gap-5">
        {studies?.map((study) =>
          <StudyCard
            key={study.code}
            study={study}
            isStudiesLoading={isStudiesLoading}
          />
        )}
      </div>
    </div>
  );
}