import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TeamProfilePage } from "@/components/team-profile-page";
import { getTeamProfile, getTeamSlugs } from "@/lib/team-data";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getTeamSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getTeamProfile(slug);

  if (!profile) {
    return {
      title: "Team Not Found | KSP Intelligence Portal"
    };
  }

  return {
    title: `${profile.name} | KSP Intelligence Portal`,
    description: `${profile.name} team profile for ${profile.role}: ${profile.subtitle}`,
    openGraph: {
      title: `${profile.name} | KSP Intelligence Portal`,
      description: profile.subtitle,
      type: "profile"
    }
  };
}

export default async function TeamMemberPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const profile = getTeamProfile(slug);

  if (!profile) {
    notFound();
  }

  return <TeamProfilePage profile={profile} />;
}
