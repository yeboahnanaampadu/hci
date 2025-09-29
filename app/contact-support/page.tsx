export default function ContactSupportPage() {
  return (
    <main className="container-prose my-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Contact Support</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-4">
              Our support team is here to help you with your visa application. 
              Please use the contact information below or fill out our support form.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> support@guinea-evisa.gov.gn</p>
              <p><strong>Phone:</strong> +224 123 456 789</p>
              <p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM GMT</p>
              <p><strong>Emergency:</strong> +224 987 654 321 (24/7)</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Support Form</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option>Application Status</option>
                  <option>Document Questions</option>
                  <option>Payment Issues</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2" required></textarea>
              </div>
              <button type="submit" className="btn bg-guinea-green text-white">Send Message</button>
            </form>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-4">
              <details className="border rounded-lg p-4">
                <summary className="font-medium cursor-pointer">How do I check my application status?</summary>
                <p className="mt-2">Use the "Retrieve Application & Pay" page with your email address.</p>
              </details>
              <details className="border rounded-lg p-4">
                <summary className="font-medium cursor-pointer">What if my documents are rejected?</summary>
                <p className="mt-2">You'll receive an email with details. Correct the issues and resubmit.</p>
              </details>
              <details className="border rounded-lg p-4">
                <summary className="font-medium cursor-pointer">How long does processing take?</summary>
                <p className="mt-2">See our Processing Times page for detailed information.</p>
              </details>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}