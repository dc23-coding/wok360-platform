import { supabase } from '@/utils/supabase'

export default async function HomePage() {
  const { data, error } = await supabase.from('test_table').select()

  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data found.</div>

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Test Table</h1>
      <ul>
        {data.map((row: any, i: number) => (
          <li key={i}>{JSON.stringify(row)}</li>
        ))}
      </ul>
    </main>
  )
}
