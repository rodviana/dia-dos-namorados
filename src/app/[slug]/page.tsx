import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InviteExperience } from "@/components/InviteExperience";
import {
  getInviteConfigForSlug,
  getProfileSlugs,
} from "@/config/getInviteConfig";
import { InviteConfigProvider } from "@/context/InviteConfigContext";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProfileSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getInviteConfigForSlug(slug);
  if (!config) return {};

  return {
    title: `${config.title} — ${config.guestName}`,
    description: config.invitation.slice(0, 160),
    openGraph: {
      title: `${config.yourName} convidou ${config.guestName} 💌`,
      description: config.invitation.slice(0, 160),
    },
  };
}

export default async function ProfileInvitePage({ params }: Props) {
  const { slug } = await params;
  const config = getInviteConfigForSlug(slug);
  if (!config) notFound();

  return (
    <InviteConfigProvider config={config}>
      <InviteExperience />
    </InviteConfigProvider>
  );
}
