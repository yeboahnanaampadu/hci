export default function ProcessingTimesPage() {
  return (
    <main className="container-prose my-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Processing Times</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Standard Processing</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Tourist Visa: 5-7 business days</li>
              <li>Business Visa: 7-10 business days</li>
              <li>Transit Visa: 3-5 business days</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Express Processing</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Tourist Visa: 2-3 business days (+$50 fee)</li>
              <li>Business Visa: 3-5 business days (+$75 fee)</li>
              <li>Transit Visa: 1-2 business days (+$30 fee)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Emergency Processing</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>All visa types: Same day (+$100 fee)</li>
              <li>Available for urgent travel situations</li>
              <li>Additional documentation may be required</li>
            </ul>
          </section>
          <p className="text-sm text-gray-600">
            Processing times are from the date all required documents are received and payment is processed.
            Additional time may be required for document verification or if additional information is requested.
          </p>
        </div>
      </div>
    </main>
  )
}