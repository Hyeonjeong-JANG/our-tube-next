const Page = ()=>{
    console.log("Where am I rendered?");

    const data = db.select().from(videos).where(eq(VideoColorSpace.bind,"123"));
        return(
        <div>Feed page!</div>
    );
};

export default Page;