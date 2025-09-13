"use client";

import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CategoriesSectionProps {
    categoryId?: string;
}

// useSuspenseQuery를 사용할 때마다 Suspense와 ErrorBoundary로 감싸줘야 하기 때문에 잊지 않기 위해 이렇게 해놓으면 좋다.
export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
    return (
        <Suspense fallback={<FilterCarousel isLoading data={[]} onSelect={() => { }} />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <CategoriesSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
}

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {

    const router = useRouter();
    const [categories] = trpc.categories.getMany.useSuspenseQuery();

    const data = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const onSelect = (value: string | null) => {
        const url = new URL(window.location.href);

        if (value) {
            url.searchParams.set("categoryId", value);
        } else {
            url.searchParams.delete("categoryId");
        }

        router.push(url.toString());
    }

    return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
};