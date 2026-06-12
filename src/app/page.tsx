import { InviteExperience } from "@/components/InviteExperience";
import { getDefaultInviteConfig } from "@/config/getInviteConfig";
import { InviteConfigProvider } from "@/context/InviteConfigContext";

export default function Home() {
  const config = getDefaultInviteConfig();

  return (
    <InviteConfigProvider config={config}>
      <InviteExperience />
    </InviteConfigProvider>
  );
}
