import { ResumeData } from "@/types/resume";

/**
 * Reorders ResumeData object to match the schema order:
 * profile, workExperiences, educations, skills, licenses, languages, achievements, publications, honors
 */
export function reorderResumeData(data: ResumeData): ResumeData {
  return {
    profile: data.profile,
    workExperiences: data.workExperiences || [],
    educations: data.educations || [],
    skills: data.skills || [],
    licenses: data.licenses || [],
    languages: data.languages || [],
    achievements: data.achievements || [],
    publications: data.publications || [],
    honors: data.honors || [],
  };
}

