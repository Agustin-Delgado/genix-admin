import { z } from "zod";

export const createStudySchema = (studyCode: string, fileRequired: boolean = true) => {
  const baseSchema = z.object({
    client_id: z.string(),
    study_code: z.string(),
    file: !fileRequired ? z.instanceof(File, {
      message: "El archivo es requerido",
    }).optional() : z.instanceof(File, {
      message: "El archivo es requerido",
    }),
    metadata: z.object({}).passthrough().optional(),
    storage_ref: z.string().optional(),
  });
  switch (studyCode) {
    case "nutritional":
      return baseSchema.merge(
        z.object({
          metadata: z.object({
            blocks: z.array(
              z.object({
                title: z.string(),
                body: z.string(),
              })
            ).nonempty("Se requiere al menos un bloque"),
            values: z.object({
              fat_metabolism: z.enum(["bad", "normal", "good"], { required_error: "El metabolismo de grasas es requerido" }),
              protein_metabolism: z.enum(["bad", "normal", "good"], { required_error: "El metabolismo de proteínas es requerido" }),
              sensibility: z.enum(["bad", "normal", "good"], { required_error: "La sensibilidad a la insulina es requerida" }),
              methylation: z.enum(["bad", "normal", "good"], { required_error: "La metilación es requerida" }),
              carbs_metabolism: z.enum(["bad", "normal", "good"], { required_error: "El metabolismo de carbohidratos es requerido" }),
              micronutrients: z.enum(["bad", "normal", "good"], { required_error: "Los micronutrientes son requeridos" }),
              detoxification: z.enum(["bad", "normal", "good"], { required_error: "La detoxificación es requerida" }),
              aging: z.enum(["normal", "good"], { required_error: "El envejecimiento es requerido" }),
            }, { required_error: "Los valores son requeridos" }),
          }),
        })
      );
    case "training":
      return baseSchema.merge(
        z.object({
          metadata: z.object({
            blocks: z.array(
              z.object({
                day: z.string(),
                body: z.string(),
              })
            ),
          }),
        })
      );
    case "supplements":
      return baseSchema.merge(
        z.object({
          metadata: z.object({
            blocks: z.array(
              z.object({
                supplement: z.string(),
                body: z.string(),
                dose: z.string(),
              })
            ),
            note: z.string().optional(),
          }),
        })
      );
    case "lab":
      return baseSchema.merge(
        z.object({
          metadata: z.object({
            obs: z.string(),
          }),
        })
      );
    case "in_body":
      return baseSchema.merge(
        z.object({
          metadata: z.object({
            obs: z.string(),
          }),
        })
      );
    case "genetic":
      return baseSchema.merge(
        z.object({
          metadata: z.object({
            obs: z.string(),
          }),
        })
      );
    default:
      return baseSchema;
  }
};

export const getStudyDefaultValues = (studyCode: string) => {
  switch (studyCode) {
    case "nutritional":
      return {
        client_id: "",
        study_code: "",
        file: undefined,
        metadata: {
          blocks: [],
          values: {
            fat_metabolism: undefined,
            protein_metabolism: undefined,
            sensibility: undefined,
            methylation: undefined,
            carbs_metabolism: undefined,
            micronutrients: undefined,
            detoxification: undefined,
            aging: undefined,
          },
        },
        storage_ref: "",
      };
    case "training":
      return {
        client_id: "",
        study_code: "",
        file: undefined,
        metadata: {
          blocks: [],
        },
        storage_ref: "",
      };
    case "supplements":
      return {
        client_id: "",
        study_code: "",
        file: undefined,
        metadata: {
          blocks: [],
          note: "",
        },
        storage_ref: "",
      };
    case "lab":
      return {
        client_id: "",
        study_code: "",
        file: undefined,
        metadata: {
          obs: "",
        },
        storage_ref: "",
      };
    case "in_body":
      return {
        client_id: "",
        study_code: "",
        file: undefined,
        metadata: {
          obs: "",
        },
        storage_ref: "",
      };
    case "genetic":
      return {
        client_id: "",
        study_code: "",
        file: undefined,
        metadata: {
          obs: "",
        },
        storage_ref: "",
      };
    default:
      return {
        client_id: "",
        study_code: "",
        file: undefined,
        metadata: {},
        storage_ref: "",
      };
  }
}

export const getBlockSchemaAndDefaults = (study_id: string) => {
  switch (study_id) {
    case "nutritional":
      return {
        schema: z.object({
          title: z.string().nonempty("El título es requerido"),
          body: z.string().nonempty("El contenido es requerido"),
        }),
        defaultValues: { title: "", body: "" },
        fields: [
          { name: "title", label: "Título", type: "text" },
          { name: "body", label: "Contenido", type: "textarea" },
        ]
      };
    case "training":
      return {
        schema: z.object({
          day: z.string().nonempty("El día es requerido"),
          body: z.string().nonempty("El contenido es requerido"),
        }),
        defaultValues: { day: "", body: "" },
        fields: [
          { name: "day", label: "Día", type: "text" },
          { name: "body", label: "Contenido", type: "textarea" },
        ]
      };
    case "supplements":
      return {
        schema: z.object({
          supplement: z.string().nonempty("El suplemento es requerido"),
          body: z.string().nonempty("La descripción es requerida"),
          dose: z.string().nonempty("La dosis es requerida"),
        }),
        defaultValues: { supplement: "", body: "", dose: "" },
        fields: [
          { name: "supplement", label: "Suplemento", type: "text" },
          { name: "body", label: "Descripción", type: "textarea" },
          { name: "dose", label: "Dosis", type: "text" },
        ]
      };
    case "lab":
      return {
        schema: z.object({
          obs: z.string().nonempty("La observación es requerida"),
        }),
        defaultValues: { obs: "" },
        fields: [
          { name: "obs", label: "Observación", type: "textarea" },
        ]
      };
    case "in_body":
      return {
        schema: z.object({
          obs: z.string().nonempty("La observación es requerida"),
        }),
        defaultValues: { obs: "" },
        fields: [
          { name: "obs", label: "Observación", type: "textarea" },
        ]
      };
    case "genetic":
      return {
        schema: z.object({
          obs: z.string().nonempty("La observación es requerida"),
        }),
        defaultValues: { obs: "" },
        fields: [
          { name: "obs", label: "Observación", type: "textarea" },
        ]
      };
    default:
      return {
        schema: z.object({}),
        defaultValues: {},
        fields: []
      };
  }
};
