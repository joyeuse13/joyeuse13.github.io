import type { AtpSessionData, AtpAgent } from "@atproto/api";
import type { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { Popover } from "@kobalte/core";
import {
  createSignal,
  type Accessor,
  type Component,
  createEffect,
} from "solid-js";

interface HeaderProps {
  agent: Accessor<AtpAgent | undefined>;
  session: Accessor<AtpSessionData | undefined>;
  signOut: () => void;
}

export const Header: Component<HeaderProps> = ({ agent, session, signOut }) => {
  const [profile, setProfile] = createSignal<ProfileViewDetailed>();
  createEffect(async () => {
    if (agent() && session()) {
      const profile = await agent()?.getProfile({
        actor: agent()?.session?.handle ?? "",
      });
      profile?.success && setProfile(profile.data);
    } else {
      setProfile(undefined);
    }
  });

  // @ts-ignore
  return (
    <header class="comments-header">
      <h2>Comments</h2>
      <div>
        <Popover.Root>
          <Popover.Trigger class="comments-popover-trigger">
            <img
              class="w-16 rounded-full"
              src={profile()?.avatar}
              alt="avatar"
            />
          </Popover.Trigger>
          <Popover.Content
            class='comments-popover-content'>
            <span class="comments-popover-display-name">{profile()?.displayName}</span>
            <button type="button" onClick={signOut}>
              Sign out
            </button>
          </Popover.Content>
        </Popover.Root>
      </div>
    </header>
  );
};
