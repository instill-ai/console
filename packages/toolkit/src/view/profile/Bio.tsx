import * as React from "react";
import {
  Button,
  ComplicateIcons,
  Icons,
  Nullable,
  Tag,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserMembership } from "../../lib";
import { ImageWithFallback } from "../../components";

export const ProfileBio = ({
  name,
  id,
  bio,
  githubLink,
  isOwner,
  userMemberships,
  avatar,
}: {
  name: string;
  id: string;
  bio: string;
  githubLink: Nullable<string>;
  twitterLink: Nullable<string>;
  isOwner: boolean;
  userMemberships: Nullable<UserMembership[]>;
  avatar: Nullable<string>;
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex w-full px-20">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-semantic-bg-line">
            {avatar ? (
              <ImageWithFallback
                width={96}
                height={96}
                src={avatar}
                alt="This user's avatar"
                fallbackImg={
                  <Icons.User02 className="m-auto h-20 w-20 stroke-semantic-fg-secondary" />
                }
              />
            ) : (
              <Icons.User02 className="h-20 w-20 stroke-semantic-fg-secondary" />
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-center space-y-1">
          <h3 className="text-semantic-fg-primary product-headings-heading-3">
            {name}
          </h3>
          <Tag size="sm">{id}</Tag>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-semantic-fg-primary product-body-text-2-semibold">
          About
        </p>
        <p className="text-semantic-fg-primary product-body-text-3-regular">
          {bio}
        </p>
      </div>
      <div className="flex flex-col gap-y-1">
        {githubLink ? (
          <SocialMediaRow
            url={githubLink}
            icon={
              <ComplicateIcons.GitHub
                className="h-3 w-3"
                fillAreaColor="fill-[#161514]"
              />
            }
          />
        ) : null}
      </div>
      {isOwner ? (
        <div className="flex flex-col gap-y-1">
          <Button
            variant="secondaryGrey"
            onClick={() => {
              router.push("/settings/profile");
            }}
          >
            Edit Profile
          </Button>
        </div>
      ) : null}
      {userMemberships ? (
        <div className="flex flex-col gap-y-4">
          <p className="text-semantic-fg-primary product-headings-heading-5">
            Organizations
          </p>
          <div className="flex w-full flex-row flex-wrap gap-4">
            {userMemberships.map((membership) => (
              <button
                key={membership.name}
                className="flex items-center rounded-sm border border-semantic-bg-line p-2.5"
              >
                <ImageWithFallback
                  width={20}
                  height={20}
                  src={membership.organization.profile_avatar ?? ""}
                  alt={`${membership.organization.id}-logo`}
                  fallbackImg={
                    <Icons.User02 className="h-5 w-5 stroke-semantic-fg-secondary" />
                  }
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const SocialMediaRow = ({
  icon,
  url,
}: {
  url: string;
  icon: React.ReactElement;
}) => {
  return (
    <div className="flex flex-row items-center gap-x-2 px-2 py-1.5">
      {icon}
      <Link
        className="line-clamp-1 cursor-pointer text-semantic-fg-secondary product-button-button-3 hover:!underline"
        href={url}
      >
        {url}
      </Link>
    </div>
  );
};
