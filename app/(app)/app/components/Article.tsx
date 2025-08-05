export function Article({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{slug}</h1>
    </div>
  );
}
