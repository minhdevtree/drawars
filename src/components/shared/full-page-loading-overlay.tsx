export default function FullPageLoadingOverlay() {
  return (
    <div className="w-full h-full absolute inset-0 bg-background z-50">
      <div className="flex gap-2 justify-center items-center mt-[50vh] text-primary">
        <div className="text-center flex flex-col justify-center text-xl">
          Loading...
        </div>
      </div>
    </div>
  );
}
