import { HydrateClient, trpc } from "@/trpc/server";

const Page = () => {
  void trpc.studio.getMany.prefetchInfinite();

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
