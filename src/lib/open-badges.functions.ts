export type OpenBadgeV3Credential = {
  "@context": string[];
  id: string;
  type: string[];
  issuer: {
    id: string;
    type: string[];
    name: string;
    url: string;
    email?: string;
  };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id?: string;
    name: string;
    achievement: {
      id: string;
      type: string[];
      name: string;
      description: string;
      criteria: {
        narrative: string;
      };
      image?: string;
      alignment?: Array<{
        targetName: string;
        targetUrl?: string;
      }>;
    };
  };
};

export function generateOpenBadgeV3({
  certificateId,
  studentName,
  courseName,
  description,
  issueDate,
  skills = [],
  verificationUrl,
}: {
  certificateId: string;
  studentName: string;
  courseName: string;
  description?: string;
  issueDate?: string;
  skills?: string[];
  verificationUrl: string;
}): OpenBadgeV3Credential {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://learnifyaitool.vercel.app";

  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://purl.imsglobal.org/spec/ob/v3p0/context.json",
    ],
    id: `urn:uuid:${certificateId}`,
    type: ["VerifiableCredential", "OpenBadgeCredential"],
    issuer: {
      id: `${origin}/issuers/learnify-ai`,
      type: ["Profile"],
      name: "Learnify AI Accreditation Board",
      url: origin,
      email: "accreditation@learnify.ai",
    },
    issuanceDate: issueDate || new Date().toISOString(),
    credentialSubject: {
      name: studentName,
      achievement: {
        id: verificationUrl,
        type: ["Achievement"],
        name: courseName,
        description: description || `Successfully completed ${courseName} on Learnify AI.`,
        criteria: {
          narrative: `Completed all modules, passed assessment tests, and verified core competencies for ${courseName}.`,
        },
        alignment: skills.map((skill) => ({
          targetName: skill,
          targetUrl: `https://learnifyaitool.vercel.app/skills/${encodeURIComponent(skill)}`,
        })),
      },
    },
  };
}

export function generateLinkedInCertUrl({
  courseName,
  certificateId,
  issueDate,
  verificationUrl,
}: {
  courseName: string;
  certificateId: string;
  issueDate?: string;
  verificationUrl: string;
}): string {
  const params = new URLSearchParams();
  params.set("startTask", "CERTIFICATION_NAME");
  params.set("name", courseName);
  params.set("organizationName", "Learnify AI");
  params.set("certUrl", verificationUrl);
  params.set("certId", certificateId);

  if (issueDate) {
    const d = new Date(issueDate);
    if (!isNaN(d.getTime())) {
      params.set("issueYear", d.getFullYear().toString());
      params.set("issueMonth", (d.getMonth() + 1).toString());
    }
  }

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
