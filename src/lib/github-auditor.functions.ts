import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface GitHubRepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
  topics: string[];
  hasReadme?: boolean;
  hasLicense?: boolean;
}

export interface GitHubAuditReport {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "D";
  breakdown: {
    profileCompleteness: number; // /20
    repoQuality: number; // /30
    activityAndImpact: number; // /30
    recruiterReadiness: number; // /20
  };
  languages: Array<{ name: string; count: number; percentage: number }>;
  topRepos: GitHubRepoSummary[];
  strengths: string[];
  redFlags: string[];
  actionItems: string[];
}

const AuditInput = z.object({
  username: z.string().min(1).max(100).trim(),
});

export const auditGitHubProfile = createServerFn({ method: "POST" })
  .validator((d: unknown) => AuditInput.parse(d || {}))
  .handler(async ({ data }) => {
    const rawUsername = data.username.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "").trim();

    // 1. Fetch GitHub User Profile
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "LearnifyAI-CareerStudio-Auditor",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const userRes = await fetch(`https://api.github.com/users/${rawUsername}`, { headers });
    if (!userRes.ok) {
      if (userRes.status === 404) {
        throw new Error(`GitHub user "${rawUsername}" not found. Please verify the handle.`);
      }
      if (userRes.status === 403) {
        throw new Error("GitHub API rate limit reached. Please try again in a few minutes.");
      }
      throw new Error(`GitHub API error (${userRes.status})`);
    }

    const user = await userRes.json();

    // 2. Fetch User Repositories (sorted by recently updated, up to 100)
    const reposRes = await fetch(
      `https://api.github.com/users/${rawUsername}/repos?sort=updated&per_page=100`,
      { headers },
    );
    const repos: any[] = reposRes.ok ? await reposRes.json() : [];

    // Filter out forks for quality analysis
    const sourceRepos = repos.filter((r) => !r.fork);
    const totalRepos = sourceRepos.length || repos.length || 1;

    // 3. Compute Metrics & Breakdown
    // A. Profile Completeness (max 20 pts)
    let profilePts = 0;
    if (user.avatar_url) profilePts += 3;
    if (user.name) profilePts += 4;
    if (user.bio && user.bio.trim().length > 10) profilePts += 5;
    if (user.location) profilePts += 3;
    if (user.blog) profilePts += 3;
    if (user.twitter_username) profilePts += 2;
    const profileCompleteness = Math.min(20, profilePts);

    // B. Repo Quality (max 30 pts)
    const reposWithDesc = sourceRepos.filter((r) => r.description && r.description.trim().length > 8);
    const descRatio = reposWithDesc.length / totalRepos;
    const reposWithLicense = sourceRepos.filter((r) => r.license);
    const licenseRatio = reposWithLicense.length / totalRepos;
    const reposWithTopics = sourceRepos.filter((r) => r.topics && r.topics.length > 0);
    const topicRatio = reposWithTopics.length / totalRepos;

    let repoQualityPts = 0;
    repoQualityPts += Math.round(descRatio * 15);
    repoQualityPts += Math.round(licenseRatio * 8);
    repoQualityPts += Math.round(topicRatio * 7);
    const repoQuality = Math.min(30, Math.max(5, repoQualityPts));

    // C. Activity & Impact (max 30 pts)
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    let activityPts = 0;
    if (user.public_repos >= 5) activityPts += 6;
    if (user.public_repos >= 15) activityPts += 4;
    if (totalStars >= 5) activityPts += 6;
    if (totalStars >= 25) activityPts += 6;
    if (user.followers >= 5) activityPts += 4;
    if (totalForks >= 3) activityPts += 4;
    const activityAndImpact = Math.min(30, Math.max(5, activityPts));

    // D. Recruiter Readiness (max 20 pts)
    let recruiterPts = 0;
    // Check if user has updated a repo in the last 60 days
    const recentRepo = sourceRepos.find((r) => {
      const days = (Date.now() - new Date(r.pushed_at || r.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 60;
    });
    if (recentRepo) recruiterPts += 10;
    if (sourceRepos.length >= 3) recruiterPts += 5;
    if (user.blog && user.blog.includes("http")) recruiterPts += 5;
    const recruiterReadiness = Math.min(20, Math.max(4, recruiterPts));

    // Total Score
    const overallScore = profileCompleteness + repoQuality + activityAndImpact + recruiterReadiness;

    let grade: "A+" | "A" | "B" | "C" | "D" = "C";
    if (overallScore >= 90) grade = "A+";
    else if (overallScore >= 80) grade = "A";
    else if (overallScore >= 65) grade = "B";
    else if (overallScore >= 50) grade = "C";
    else grade = "D";

    // 4. Tech Languages Breakdown
    const langCounts: Record<string, number> = {};
    for (const r of sourceRepos) {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    }
    const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const languages = Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalLangRepos) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 5. Strengths & Red Flags
    const strengths: string[] = [];
    const redFlags: string[] = [];
    const actionItems: string[] = [];

    if (totalStars > 10) strengths.push(`Earned ${totalStars} stars across public repositories.`);
    if (user.bio) strengths.push("Professional bio clearly describes technical domain.");
    if (languages.length >= 3) strengths.push(`Diverse tech stack covering ${languages.map((l) => l.name).slice(0, 3).join(", ")}.`);
    if (descRatio >= 0.7) strengths.push("High proportion of repositories have clear, informative descriptions.");
    if (strengths.length === 0) strengths.push("Active public profile ready for recruiter optimization.");

    if (!user.bio) {
      redFlags.push("Missing GitHub profile bio. Recruiters cannot see your primary role or focus area at a glance.");
      actionItems.push("Write a concise bio summarizing your tech stack and target role (e.g. 'Full Stack Engineer | React, TypeScript & Node.js').");
    }
    if (!user.blog) {
      redFlags.push("No portfolio website or LinkedIn URL linked in profile.");
      actionItems.push("Add your Learnify AI Portfolio link or LinkedIn URL to your GitHub profile settings.");
    }
    if (descRatio < 0.5) {
      redFlags.push("More than 50% of your repositories are missing descriptions.");
      actionItems.push("Add a one-line description to every repository explaining what problem it solves.");
    }
    if (totalStars === 0) {
      redFlags.push("Zero repository stars — projects may lack polish or visual demos.");
      actionItems.push("Add GIFs or screenshots to your top project READMEs to attract community engagement.");
    }
    if (actionItems.length < 3) {
      actionItems.push("Create a special profile repository (named your username) to display a customized README pinned to your front page.");
      actionItems.push("Pin your top 4 best full-stack projects featuring live deployment links.");
    }

    // Top Repos
    const topRepos: GitHubRepoSummary[] = [...sourceRepos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        url: r.html_url,
        updatedAt: new Date(r.updated_at).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        topics: r.topics || [],
      }));

    return {
      username: user.login,
      avatarUrl: user.avatar_url,
      name: user.name || user.login,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      createdAt: new Date(user.created_at).getFullYear().toString(),
      overallScore,
      grade,
      breakdown: {
        profileCompleteness,
        repoQuality,
        activityAndImpact,
        recruiterReadiness,
      },
      languages,
      topRepos,
      strengths,
      redFlags,
      actionItems,
    };
  });
