import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"; // 이렇게 하지 않으면 prefetch 하는 부분에서 빌드 에러가 생길 수 있음

interface PageProps {
  searchParams: Promise<{
    categoryId?: string,
  }>
};

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  // src/app/(home)/client.tsx의 useSuspenseQuery와 쌍을 이룸

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  )
}

export default Page;