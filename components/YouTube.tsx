export function YouTube({ id }: { id: string }) {
  return (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-2xl border">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
