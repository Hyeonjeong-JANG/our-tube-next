"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
    const [data] = trpc.categories.getMany.useSuspenseQuery(
        // suspanse query는 null일 수 없음
        // useSuspense를 사용할 때마다 여기에 상응하는 프리페치가 있어야 함
    );

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
};