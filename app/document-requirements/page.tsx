export default function DocumentRequirementsPage() {
  return (
    <main className="container-prose my-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Document Requirements</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tourist Visa</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Valid passport with at least 6 months validity</li>
              <li>Recent passport-sized photos</li>
              <li>Proof of travel purpose (itinerary, hotel booking)</li>
              <li>Proof of sufficient funds</li>
              <li>Flight itinerary</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Business Visa</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Valid passport with at least 6 months validity</li>
              <li>Recent passport-sized photos</li>
              <li>Business invitation letter</li>
              <li>Company registration documents</li>
              <li>Proof of business activities</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Transit Visa</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Valid passport with at least 6 months validity</li>
              <li>Recent passport-sized photos</li>
              <li>Transit flight tickets</li>
              <li>Visa for destination country (if required)</li>
              <li>Proof of onward travel</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}