
export default function AuthCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="container-prose">
      <div className="mx-auto max-w-md mt-10 mb-16">
        <div className="card">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
