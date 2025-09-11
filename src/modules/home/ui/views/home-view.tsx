interface HomeViewProps {
    categoryId?: string;
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
    return (
        <div className="max-w-[2400px] mx-auth mb-10 px-4 pt-2.5 flex flex-col gap-y-6 border bg-red-500">
            {/* Render your content here */}
        </div>
    );
}