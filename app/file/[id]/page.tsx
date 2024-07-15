interface PageProps
{
  params: {
    id: string;
  };
}

export default async function Page ({ params }: PageProps): Promise<JSX.Element>
{
  return (
    <button className="bg-emerald-500 rounded-lg px-8 py-2">
      Download
    </button>
  );
}