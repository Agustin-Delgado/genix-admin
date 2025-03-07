"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, AlertCircle, HelpCircle } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type ParameterConfig = {
  field: string;
  title: string;
  options: Option[];
};

const parameters: ParameterConfig[] = [
  {
    field: "fat_metabolism",
    title: "Metabolismo de grasas",
    options: [
      { label: "Bueno", value: "good" },
      { label: "Normal", value: "normal" },
      { label: "Malo", value: "bad" },
    ],
  },
  {
    field: "protein_metabolism",
    title: "Metabolismo de proteínas",
    options: [
      { label: "Bueno", value: "good" },
      { label: "Normal", value: "normal" },
      { label: "Malo", value: "bad" },
    ],
  },
  {
    field: "sensibility",
    title: "Sensibilidad a la insulina",
    options: [
      { label: "Bueno", value: "good" },
      { label: "Normal", value: "normal" },
      { label: "Malo", value: "bad" },
    ],
  },
  {
    field: "methylation",
    title: "Metilación",
    options: [
      { label: "Bueno", value: "good" },
      { label: "Normal", value: "normal" },
      { label: "Malo", value: "bad" },
    ],
  },
  {
    field: "carbs_metabolism",
    title: "Metabolismo de carbohidratos",
    options: [
      { label: "Bueno", value: "good" },
      { label: "Normal", value: "normal" },
      { label: "Malo", value: "bad" },
    ],
  },
  {
    field: "micronutrients",
    title: "Micronutrientes",
    options: [
      { label: "Bueno", value: "good" },
      { label: "Normal", value: "normal" },
      { label: "Malo", value: "bad" },
    ],
  },
  {
    field: "detoxification",
    title: "Detoxificación",
    options: [
      { label: "Bueno", value: "good" },
      { label: "Normal", value: "normal" },
      { label: "Malo", value: "bad" },
    ],
  },
  {
    field: "aging",
    title: "Envejecimiento",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Bueno", value: "good" },
    ],
  },
];

export default function Parameters() {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const getIconForValue = (value?: string) => {
    if (value === "good") return <CheckCircle className="text-green-500" size={16} />;
    if (value === "normal") return <Circle className="text-yellow-500" size={16} />;
    if (value === "bad") return <AlertCircle className="text-red-500" size={16} />;
    return <HelpCircle size={16} />;
  };

  const metadataValues = useWatch({ name: "metadata.values" });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {parameters.map((param) => {
        const selectedOption = param.options.find((opt) => opt.value === metadataValues?.[param.field]);
        const metadataError = errors.metadata;
        const valuesError =
          metadataError && typeof metadataError === "object" && "values" in metadataError
            ? (metadataError as { values: Record<string, any> }).values
            : undefined;
        const fieldError = valuesError?.[param.field];

        return (
          <div key={param.field} className="flex flex-col px-4 py-2 bg-accent rounded-sm hover:bg-secondary/50 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{param.title}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Seleccionar ${param.title}`}
                    className={cn("justify-center h-7 w-7", fieldError && "border-destructive")}
                  >
                    {selectedOption ? (
                      <>
                        {getIconForValue(selectedOption.value)}
                      </>
                    ) : (
                      <>
                        {getIconForValue(undefined)}
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-32">
                  {param.options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => {
                        setValue(`metadata.values.${param.field}`, option.value, { shouldValidate: true });
                      }}
                    >
                      {getIconForValue(option.value)}
                      <span className="ml-2">{option.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {fieldError && (
              <p className="text-xs text-destructive">{fieldError.message}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
