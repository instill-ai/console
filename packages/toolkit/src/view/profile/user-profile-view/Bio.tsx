"use client";

import * as React from "react";
import {
  Button,
  ComplicateIcons,
  Icons,
  Logos,
  Nullable,
  Skeleton,
  Tag,
} from "@instill-ai/design-system";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserMembership } from "../../../lib";
import { EntityAvatar } from "../../../components";

export const UserBioSkeleton = () => {
  return (
    <div className="flex w-[320px] flex-col gap-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-40 w-40 rounded-full bg-semantic-bg-line">
          <Skeleton className="m-auto h-20 w-20 rounded-full stroke-semantic-fg-secondary" />
        </div>
        <div className="flex w-full flex-col items-center space-y-1">
          <Skeleton className="h-6 w-24 rounded bg-semantic-bg-line" />
          <Skeleton className="h-6 w-16 rounded bg-semantic-bg-line" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className="text-semantic-fg-primary product-body-text-2-semibold">
          About
        </p>
        <Skeleton className="h-[60px] w-full rounded bg-semantic-bg-line" />
      </div>
    </div>
  );
};

export const UserProfileBio = ({
  name,
  id,
  bio,
  githubLink,
  twitterLink,
  isOwner,
  userMemberships,
  avatar,
}: {
  name: string;
  id: string;
  bio: Nullable<string>;
  githubLink: Nullable<string>;
  twitterLink: Nullable<string>;
  isOwner: boolean;
  userMemberships: Nullable<UserMembership[]>;
  avatar: Nullable<string>;
}) => {
  const router = useRouter();

  return (
    <div className="flex w-[320px] flex-col gap-y-8">
      <div className="flex flex-col items-center space-y-4">
        <EntityAvatar
          src={avatar}
          className="mx-auto h-40 w-40 rounded-full"
          fallbackImg={
            <div className="flex h-40 w-40 rounded-full bg-semantic-bg-line">
              <Icons.User02 className="m-auto h-20 w-20 stroke-semantic-fg-secondary" />
            </div>
          }
          entityName={name}
        />
        <div className="flex w-full flex-col items-center space-y-1">
          <h3 className="text-semantic-fg-primary product-headings-heading-3">
            {name}
          </h3>
          <Tag size="sm">{id}</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
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
        {twitterLink ? (
          <SocialMediaRow
            url={twitterLink}
            icon={<Logos.TwitterDark className="h-3 w-3" />}
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
                <EntityAvatar
                  entityName={membership.organization.name}
                  src={membership.organization.profile?.avatar ?? null}
                  className="h-5 w-5"
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
UserProfileBio.Skeleton = UserBioSkeleton;

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
        className="line-clamp-1 cursor-pointer !normal-case text-semantic-fg-secondary product-button-button-3 hover:!underline"
        href={url}
      >
        {url}
      </Link>
    </div>
  );
};
